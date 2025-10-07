import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useConversations() {
  const [conversations, setConversations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadConversations = async () => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setConversations(data || [])
    } catch (err) {
      setError(err.message)
      console.error('Error loading conversations:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadConversations()

    const channel = supabase
      .channel('conversations_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'conversations' },
        () => {
          loadConversations()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const createConversation = async (title = 'New Conversation') => {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert([{ title }])
        .select()
        .single()

      if (error) throw error

      return data
    } catch (err) {
      setError(err.message)
      console.error('Error creating conversation:', err)
      return null
    }
  }

  const updateConversation = async (id, updates) => {
    try {
      const { error } = await supabase
        .from('conversations')
        .update(updates)
        .eq('id', id)

      if (error) throw error

      setConversations(conversations.map(c =>
        c.id === id ? { ...c, ...updates } : c
      ))
    } catch (err) {
      setError(err.message)
      console.error('Error updating conversation:', err)
    }
  }

  const deleteConversation = async (id) => {
    try {
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', id)

      if (error) throw error

      setConversations(conversations.filter(c => c.id !== id))
    } catch (err) {
      setError(err.message)
      console.error('Error deleting conversation:', err)
    }
  }

  return {
    conversations,
    loading,
    error,
    createConversation,
    updateConversation,
    deleteConversation,
    reload: loadConversations,
  }
}
