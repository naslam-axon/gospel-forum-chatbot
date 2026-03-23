import type { Metadata, Viewport } from 'next'
import { Inter, Lora } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
})

export const metadata: Metadata = {
  title: 'Gospel Forum Assistent',
  description: 'Der digitale Assistent des Gospel Forums Stuttgart — beantwortet Fragen zu Veranstaltungen, Gruppen, Glauben und mehr.',
}

export const viewport: Viewport = {
  themeColor: '#FAFAF7',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de">
      <body className={`${inter.variable} ${lora.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
