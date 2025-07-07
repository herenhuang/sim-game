import './globals.css'

export const metadata = {
  title: 'Micro-Simulation Quiz',
  description: 'A micro-simulation designed to understand how you handle pressure',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}