import { useState, useRef, useEffect } from 'react'
import { Send, Loader as Loader2, CircleAlert as AlertCircle, Bot } from 'lucide-react'
import MessageItem from './MessageItem'
import { useMessages } from '../hooks/useMessages'

export default function ChatInterface({
  conversationId,
  onUpdateConversation,
  onNewConversation,
}) {
  const { messages, addMessage } = useMessages(conversationId)
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    if (!conversationId) {
      await onNewConversation()
      return
    }

    const messageText = input.trim()
    const firstMessage = messages.length === 0

    await addMessage({
      role: 'user',
      content: messageText,
    })

    if (firstMessage) {
      await onUpdateConversation(conversationId, {
        title: messageText.slice(0, 50),
      })
    }

    setInput('')
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/agent/run', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conversation_id: conversationId,
          message: messageText,
          history: messages,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response from agent')
      }

      const data = await response.json()

      await addMessage({
        role: 'assistant',
        content: data.response,
        metadata: { steps: data.steps || [] },
      })
    } catch (err) {
      setError(err.message)
      console.error('Error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (!conversationId) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="inline-flex p-4 bg-blue-100 rounded-full mb-4">
            <Bot size={48} className="text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to OpenManus
          </h2>
          <p className="text-gray-600 mb-6">
            Start a new conversation to interact with the AI agent. It can help you with
            coding, web browsing, file operations, and much more.
          </p>
          <button
            onClick={onNewConversation}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Start New Conversation
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <Bot size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">How can I help you today?</p>
              <p className="text-sm mt-2">Ask me anything or give me a task to complete.</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageItem key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Bot size={20} className="text-blue-500" />
                </div>
                <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Loader2 size={16} className="animate-spin" />
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {error && (
        <div className="mx-6 mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
          <AlertCircle size={18} />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <div className="border-t border-gray-200 p-6 bg-white">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything or describe a task..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <Send size={20} />
              )}
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
