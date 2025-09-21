import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 text-white">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-8">
            Banco Colaborativo de
            <span className="block text-blue-200 mt-2">Recursos Didáticos</span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-blue-100 max-w-4xl mx-auto leading-relaxed">
            Uma plataforma para professores compartilharem e descobrirem 
            materiais educacionais de qualidade
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/register">
              <button className="bg-white text-blue-600 px-10 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 shadow-lg">
                🚀 Começar Agora
              </button>
            </Link>
            <Link href="/login">
              <button className="border-2 border-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300">
                👤 Fazer Login
              </button>
            </Link>
          </div>
          
          <div className="mt-12">
            <Link href="/materials">
              <button className="text-blue-200 hover:text-white transition-colors text-lg underline">
                Ou explore os materiais sem cadastro →
              </button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="bg-white text-gray-900 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              ✨ Funcionalidades Principais
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tudo que você precisa para compartilhar e descobrir materiais educacionais
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-blue-50 rounded-2xl">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-2xl font-bold mb-4">Compartilhe Materiais</h3>
              <p className="text-gray-600 text-lg">
                Faça upload dos seus materiais didáticos e ajude outros professores
              </p>
            </div>

            <div className="text-center p-8 bg-green-50 rounded-2xl">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold mb-4">Encontre Recursos</h3>
              <p className="text-gray-600 text-lg">
                Busque por disciplina, série e tipo de material educacional
              </p>
            </div>

            <div className="text-center p-8 bg-purple-50 rounded-2xl">
              <div className="text-6xl mb-4">⭐</div>
              <h3 className="text-2xl font-bold mb-4">Avalie & Comente</h3>
              <p className="text-gray-600 text-lg">
                Dê feedback e ajude a comunidade a encontrar os melhores recursos
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">🎓 Banco Didático</h3>
          <p className="text-gray-400">
            Conectando professores, compartilhando conhecimento
          </p>
        </div>
      </div>
    </div>
  );
}
