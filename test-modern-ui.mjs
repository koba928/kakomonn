// Modern UI Generator のテスト
import { writeFileSync } from 'fs';

// generateModernUI関数を直接実装してテスト
function generateModernUI(requirements) {
  const { appType, description, features, primaryColor = '#3B82F6' } = requirements
  
  return `'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Sparkles, 
  ArrowRight, 
  Users, 
  TrendingUp,
  Activity,
  Menu,
  X,
  Plus,
  Check
} from 'lucide-react'

export default function ${appType.replace(/\\s+/g, '')}() {
  const [items, setItems] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [activeTab, setActiveTab] = useState('overview')
  const [progress, setProgress] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setProgress(75), 800)
    return () => clearTimeout(timer)
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputValue.trim()) {
      setItems([...items, {
        id: Date.now(),
        text: inputValue,
        completed: false,
        createdAt: new Date().toISOString()
      }])
      setInputValue('')
    }
  }

  const toggleItem = (id) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Modern Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl blur-lg opacity-75"></div>
                <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                ${appType}
              </h1>
            </motion.div>
          </div>
        </div>
      </motion.header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900">
            次世代の体験を、今ここに
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            ${description}
          </p>
        </motion.section>

        {/* Statistics Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: Users, label: 'アクティブユーザー', value: '10,000+', color: 'from-blue-500 to-cyan-500' },
            { icon: TrendingUp, label: '成長率', value: '+250%', color: 'from-green-500 to-emerald-500' },
            { icon: Activity, label: '稼働率', value: '99.9%', color: 'from-purple-500 to-pink-500' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="relative overflow-hidden">
                <div className={\`absolute inset-0 bg-gradient-to-br \${stat.color} opacity-5\`}></div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </section>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>新規作成</CardTitle>
                <CardDescription>簡単な操作で素早くデータを追加</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Input
                      placeholder="ここに入力してください..."
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="pr-24"
                    />
                    <motion.div 
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        type="submit" 
                        size="sm"
                        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        追加
                      </Button>
                    </motion.div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
                  主要機能
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  ${features.map((feature, i) => `
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: ${i * 0.1} }}
                    className="flex items-center space-x-3"
                  >
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-600 to-pink-600"></div>
                    <span className="text-sm text-gray-700">${feature}</span>
                  </motion.div>`).join('')}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}`
}

// テスト用の要件
const testRequirements = {
  appType: 'タスク管理アプリ',
  description: 'シンプルで使いやすいタスク管理システム',
  features: ['タスク作成', '完了マーク', '進捗表示', 'カテゴリ分け'],
  theme: 'modern',
  primaryColor: '#3B82F6',
  category: 'productivity'
}

try {
  console.log('🧪 Testing Modern UI Generator...')
  const modernCode = generateModernUI(testRequirements)
  
  console.log('✅ Modern UI generated successfully!')
  console.log('📊 Code length:', modernCode.length, 'characters')
  console.log('🎨 Contains modern features:')
  console.log('  - Gradient backgrounds:', modernCode.includes('gradient-to-br'))
  console.log('  - Motion animations:', modernCode.includes('motion.'))
  console.log('  - Backdrop blur:', modernCode.includes('backdrop-blur'))
  console.log('  - Glass effect:', modernCode.includes('bg-white/80'))
  console.log('  - Modern layout:', modernCode.includes('sticky top-0'))
  
  // 保存してテスト
  writeFileSync('./app/test-modern-output/page.tsx', modernCode)
  console.log('💾 Saved to app/test-modern-output/page.tsx')
  
} catch (error) {
  console.error('❌ Modern UI generation failed:', error)
}