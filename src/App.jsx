import { useState } from 'react'
import ChatInterface from './components/ChatInterface'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import { useConversations } from './hooks/useConversations'

function App() {
  const { conversations, createConversation, updateConversation, deleteConversation } = useConversations()
  const [activeConversationId, setActiveConversationId] = useState(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const activeConversation = conversations.find(c => c.id === activeConversationId)

  const handleCreateConversation = async () => {
    const conv = await createConversation()
    if (conv) {
      setActiveConversationId(conv.id)
    }
  }

  const handleDeleteConversation = async (id) => {
    await deleteConversation(id)
    if (activeConversationId === id) {
      setActiveConversationId(conversations[0]?.id || null)
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={setActiveConversationId}
        onNewConversation={handleCreateConversation}
        onDeleteConversation={handleDeleteConversation}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />

        <ChatInterface
          conversationId={activeConversationId}
          onUpdateConversation={updateConversation}
          onNewConversation={handleCreateConversation}
        />
      </div>
    </div>
  )
}

export default App
