// 環境変数を手動で読み込む
const fs = require('fs')
const path = require('path')

try {
  const envPath = path.join(__dirname, '.env.local')
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8')
    const lines = envContent.split('\n')
    
    lines.forEach(line => {
      const trimmedLine = line.trim()
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=')
        const value = valueParts.join('=').trim()
        if (key && value) {
          process.env[key.trim()] = value
          console.log(`🔧 [next.config.js] Set ${key.trim()} = ${value.substring(0, 10)}...`)
        }
      }
    })
  }
} catch (error) {
  console.error('🔧 [next.config.js] Error loading .env.local:', error)
}

console.log('🔧 [next.config.js] After manual loading - OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY)
console.log('🔧 [next.config.js] After manual loading - GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY)
console.log('🔧 [next.config.js] After manual loading - FIGMA_API_KEY exists:', !!process.env.FIGMA_API_KEY)

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ['openai']
  },
  typescript: {
    // Temporarily ignore TypeScript errors during development
    ignoreBuildErrors: true,
  },
  eslint: {
    // Temporarily ignore ESLint errors during development
    ignoreDuringBuilds: true,
  },
  // 3️⃣ 環境変数を明示的に設定して確実に読み込む
  env: {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
    FIGMA_API_KEY: process.env.FIGMA_API_KEY || '',
  }
}

console.log('🔧 [next.config.js] Loading configuration...')
console.log('🔧 [next.config.js] OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY)
console.log('🔧 [next.config.js] GEMINI_API_KEY exists:', !!process.env.GEMINI_API_KEY)

module.exports = nextConfig