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
      <body>
        <div className="min-h-screen bg-white sm:bg-gray-800 flex justify-center">
          <div className="w-full sm:max-w-[375px] bg-white sm:rounded-lg sm:shadow-2xl sm:mx-4 sm:my-4 md:mx-0 md:my-8">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}