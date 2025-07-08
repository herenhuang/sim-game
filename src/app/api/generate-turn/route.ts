import { NextRequest, NextResponse } from 'next/server'

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

export async function POST(request: NextRequest) {
  console.log('🔧 API route called, checking API key...')
  console.log('🔧 ANTHROPIC_API_KEY exists:', !!ANTHROPIC_API_KEY)
  
  if (!ANTHROPIC_API_KEY) {
    console.error('❌ No API key found')
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
  }

  try {
    console.log('🔧 Parsing request body...')
    const { prompt } = await request.json()
    console.log('🔧 Prompt received, length:', prompt?.length)

    console.log('🔧 Calling Anthropic API...')
    
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 300,
        temperature: 0.7,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      })
    })

    console.log('🔧 Anthropic response status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Claude API error:', response.status, errorText)
      return NextResponse.json({ error: 'AI service unavailable' }, { status: 500 })
    }

    const data = await response.json()
    const content = data.content[0].text.trim()
    
    console.log('🤖 Claude response:', content)
    
    // Clean up any markdown code blocks
    const jsonString = content.replace(/```json\n?|\n?```/g, '').trim()
    
    try {
      const parsedResponse = JSON.parse(jsonString)
      return NextResponse.json(parsedResponse)
    } catch (parseError) {
      console.error('JSON parse error:', parseError, 'Raw content:', content)
      return NextResponse.json({ error: 'Invalid AI response format' }, { status: 500 })
    }

  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}