import { Menu, Bot } from 'lucide-react'

export default function Header({ onToggleSidebar, sidebarOpen }) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500 rounded-lg">
            <Bot size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">OpenManus</h1>
            <p className="text-sm text-gray-500">AI Agent Platform</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
          Ready
        </div>
      </div>
    </header>
  )
}
