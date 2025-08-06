export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            過去問<span className="text-indigo-600">hub</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            過去問を探せて、話せる。
          </p>
          <p className="text-lg text-gray-500 mb-12">
            大学生のための過去問 × 情報共有プラットフォーム
          </p>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mt-16">
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <div className="text-3xl mb-4">📚</div>
                <h3 className="text-xl font-semibold mb-3">過去問アーカイブ</h3>
                <p className="text-gray-600">学部・授業名・年度で検索。先輩の勉強記録が見つかる</p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <div className="text-3xl mb-4">💬</div>
                <h3 className="text-xl font-semibold mb-3">情報交換</h3>
                <p className="text-gray-600">「この問題どう解く？」「今年何出る？」気軽に相談</p>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-lg">
                <div className="text-3xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold mb-3">パーソナライズ</h3>
                <p className="text-gray-600">あなたの大学・学部に合った情報が届く</p>
              </div>
            </div>
          </div>
          
          <div className="mt-16">
            <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors">
              近日公開
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}