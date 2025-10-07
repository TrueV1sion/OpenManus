import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useMessages(conversationId) {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadMessages = async () => {
    if (!conversationId) {
      setMessages([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('timestamp', { ascending: true })

      if (error) throw error

      setMessages(data || [])
    } catch (err) {
      setError(err.message)
      console.error('Error loading messages:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMessages()

    if (!conversationId) return

    const channel = supabase
      .channel(`messages_${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        () => {
          loadMessages()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId])

  const addMessage = async (message) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert([{
          conversation_id: conversationId,
          role: message.role,
          content: message.content,
          metadata: message.metadata || {},
        }])
        .select()
        .single()

      if (error) throw error

      return data
    } catch (err) {
      setError(err.message)
      console.error('Error adding message:', err)
      return null
    }
  }

  return {
    messages,
    loading,
    error,
    addMessage,
    reload: loadMessages,
  }
}
