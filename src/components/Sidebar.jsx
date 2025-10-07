import { Plus, MessageSquare, Trash2, X } from 'lucide-react'

export default function Sidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  isOpen,
  onToggle,
}) {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-20 transition-opacity lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onToggle}
      />

      <aside
        className={`
          fixed lg:relative inset-y-0 left-0 z-30
          w-80 bg-white border-r border-gray-200
          transform transition-transform duration-200 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${!isOpen && 'lg:w-0 lg:border-0'}
        `}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={onNewConversation}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              <Plus size={20} />
              New Conversation
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {conversations.length === 0 ? (
              <div className="text-center text-gray-500 text-sm py-8">
                No conversations yet.
                <br />
                Start a new one!
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`
                    group relative flex items-center gap-3 p-3 rounded-lg cursor-pointer
                    transition-colors
                    ${
                      conv.id === activeConversationId
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50'
                    }
                  `}
                  onClick={() => onSelectConversation(conv.id)}
                >
                  <MessageSquare
                    size={18}
                    className={
                      conv.id === activeConversationId
                        ? 'text-blue-500'
                        : 'text-gray-400'
                    }
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {conv.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(conv.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteConversation(conv.id)
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-100 rounded transition-all"
                    aria-label="Delete conversation"
                  >
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t border-gray-200 text-xs text-gray-500">
            <p>Built with OpenManus</p>
            <p className="mt-1">Powered by AI Agents</p>
          </div>
        </div>
      </aside>
    </>
  )
}
