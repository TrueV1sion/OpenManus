import { Bot, User, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

export default function MessageItem({ message }) {
  const [showSteps, setShowSteps] = useState(false)
  const isUser = message.role === 'user'
  const steps = message.metadata?.steps || []

  return (
    <div className={`flex items-start gap-4 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`p-2 rounded-lg ${isUser ? 'bg-gray-200' : 'bg-blue-100'}`}>
        {isUser ? (
          <User size={20} className="text-gray-700" />
        ) : (
          <Bot size={20} className="text-blue-500" />
        )}
      </div>

      <div
        className={`flex-1 max-w-3xl ${isUser ? 'flex justify-end' : ''}`}
      >
        <div
          className={`rounded-lg shadow-sm border p-4 ${
            isUser
              ? 'bg-blue-500 text-white border-blue-600'
              : 'bg-white border-gray-200'
          }`}
        >
          <div className="prose prose-sm max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
              {message.content}
            </pre>
          </div>

          {steps.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowSteps(!showSteps)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                {showSteps ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                <span>{showSteps ? 'Hide' : 'Show'} execution steps ({steps.length})</span>
              </button>

              {showSteps && (
                <div className="mt-3 space-y-2">
                  {steps.map((step, idx) => (
                    <div
                      key={idx}
                      className="text-xs bg-gray-50 rounded p-3 border border-gray-200"
                    >
                      <div className="font-medium text-gray-700 mb-1">
                        Step {idx + 1}
                      </div>
                      <div className="text-gray-600 whitespace-pre-wrap">
                        {step}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className={`text-xs text-gray-500 mt-2 ${isUser ? 'text-right' : ''}`}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}
