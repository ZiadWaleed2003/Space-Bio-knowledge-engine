// useChatBot.ts
import { useState, useRef, useEffect } from 'react'

export interface IMessage {
  from: 'user' | 'bot'
  text: string
  timestamp: string
}

export function useChatBot() {
  const [messages, setMessages] = useState<IMessage[]>([])
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const handleSend = () => {
    if (!input.trim()) return

    // Add user message
    setMessages([
      ...messages,
      { from: 'user', text: input, timestamp: new Date().toISOString() },
    ])
    setInput('')

    // Mock bot reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          from: 'bot',
          text: 'This is a bot response.',
          timestamp: new Date().toISOString(),
        },
      ])
    }, 800)
  }

  // Auto scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  return { messages, input, setInput, handleSend, messagesEndRef }
}
