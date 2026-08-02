import './globals.css'

export const metadata = {
  title: 'Txlio',
  description: 'Transaction tools for real estate agents and TCs',
}

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className='antialiased'>{children}</body>
    </html>
  )
}
