/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['pdfjs-dist', 'canvas', 'tesseract.js', 'pdfkit'],
  },
}

module.exports = nextConfig
