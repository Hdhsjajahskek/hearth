import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: 'Hearth',
  description: 'Forget nothing that matters.',
}

export const viewport: Viewport = {
  themeColor: '#F7F4EC',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-[#F7F4EC] text-[#1A1A1A]`}>
        {children}
      </body>
    </html>
  )
}