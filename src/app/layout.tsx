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
      <body className="overflow-hidden">
        <div className="h-screen bg-white sm:bg-gray-800 flex justify-center items-center">
          <div className="w-full sm:max-w-[375px] sm:h-[90vh] h-screen bg-white sm:rounded-lg sm:shadow-2xl overflow-hidden">
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}