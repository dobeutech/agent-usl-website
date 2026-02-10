import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

export interface ChatMessage {
  id: string
  conversationId: string
  text: string
  sender: 'user' | 'bot' | 'agent'
  timestamp: string
  read: boolean
}

export interface ChatConversation {
  id: string
  visitorName: string
  status: 'active' | 'pending' | 'closed'
  createdAt: string
  updatedAt: string
  messages: ChatMessage[]
}

interface ChatContextType {
  conversations: ChatConversation[]
  activeConversationId: string | null
  startConversation: () => string
  sendUserMessage: (conversationId: string, text: string) => void
  sendBotMessage: (conversationId: string, text: string) => void
  sendAgentMessage: (conversationId: string, text: string) => void
  markConversationRead: (conversationId: string) => void
  closeConversation: (conversationId: string) => void
  getUnreadCount: () => number
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

const STORAGE_KEY = 'usp-chat-conversations'

function generateDemoConversations(): ChatConversation[] {
  const now = new Date()
  const hour = 60 * 60 * 1000

  return [
    {
      id: 'demo-conv-1',
      visitorName: 'Visitor #1847',
      status: 'active',
      createdAt: new Date(now.getTime() - 3 * hour).toISOString(),
      updatedAt: new Date(now.getTime() - 15 * 60 * 1000).toISOString(),
      messages: [
        {
          id: 'demo-msg-1',
          conversationId: 'demo-conv-1',
          text: "Hi, I'm looking for job opportunities in the area. What positions do you have available?",
          sender: 'user',
          timestamp: new Date(now.getTime() - 3 * hour).toISOString(),
          read: true
        },
        {
          id: 'demo-msg-2',
          conversationId: 'demo-conv-1',
          text: "Welcome! We have several positions available including warehouse, janitorial, construction, and administrative roles. What type of work interests you most?",
          sender: 'bot',
          timestamp: new Date(now.getTime() - 2.5 * hour).toISOString(),
          read: true
        },
        {
          id: 'demo-msg-3',
          conversationId: 'demo-conv-1',
          text: "I'm interested in construction jobs. Do you have anything in the Maryland area?",
          sender: 'user',
          timestamp: new Date(now.getTime() - 15 * 60 * 1000).toISOString(),
          read: false
        }
      ]
    },
    {
      id: 'demo-conv-2',
      visitorName: 'Visitor #1923',
      status: 'pending',
      createdAt: new Date(now.getTime() - 5 * hour).toISOString(),
      updatedAt: new Date(now.getTime() - 2 * hour).toISOString(),
      messages: [
        {
          id: 'demo-msg-4',
          conversationId: 'demo-conv-2',
          text: "Hello, I need to hire staff for my business. Can you help?",
          sender: 'user',
          timestamp: new Date(now.getTime() - 5 * hour).toISOString(),
          read: false
        },
        {
          id: 'demo-msg-5',
          conversationId: 'demo-conv-2',
          text: "We'd love to help! We provide temporary and permanent staffing solutions. What type of staff are you looking for and how many?",
          sender: 'bot',
          timestamp: new Date(now.getTime() - 2 * hour).toISOString(),
          read: true
        }
      ]
    },
    {
      id: 'demo-conv-3',
      visitorName: 'Visitor #1756',
      status: 'closed',
      createdAt: new Date(now.getTime() - 24 * hour).toISOString(),
      updatedAt: new Date(now.getTime() - 20 * hour).toISOString(),
      messages: [
        {
          id: 'demo-msg-6',
          conversationId: 'demo-conv-3',
          text: "Where are you located?",
          sender: 'user',
          timestamp: new Date(now.getTime() - 24 * hour).toISOString(),
          read: true
        },
        {
          id: 'demo-msg-7',
          conversationId: 'demo-conv-3',
          text: "We're located at 6200 Baltimore Avenue, Floor 3, Suite R20, Riverdale, MD 20737. We serve the Maryland, DC, and Northern Virginia areas.",
          sender: 'bot',
          timestamp: new Date(now.getTime() - 23.5 * hour).toISOString(),
          read: true
        },
        {
          id: 'demo-msg-8',
          conversationId: 'demo-conv-3',
          text: "Thanks, that's very helpful!",
          sender: 'user',
          timestamp: new Date(now.getTime() - 22 * hour).toISOString(),
          read: true
        },
        {
          id: 'demo-msg-9',
          conversationId: 'demo-conv-3',
          text: "You're welcome! Feel free to visit us during business hours or call (301) 277-2141. Have a great day!",
          sender: 'agent',
          timestamp: new Date(now.getTime() - 20 * hour).toISOString(),
          read: true
        }
      ]
    }
  ]
}

function loadConversations(): ChatConversation[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch {}
  const demo = generateDemoConversations()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(demo))
  return demo
}

function persistConversations(conversations: ChatConversation[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations))
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<ChatConversation[]>(loadConversations)
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null)

  useEffect(() => {
    persistConversations(conversations)
  }, [conversations])

  const startConversation = useCallback(() => {
    const id = `conv-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
    const visitorNum = Math.floor(1000 + Math.random() * 9000)
    const now = new Date().toISOString()
    const newConv: ChatConversation = {
      id,
      visitorName: `Visitor #${visitorNum}`,
      status: 'active',
      createdAt: now,
      updatedAt: now,
      messages: []
    }
    setConversations(prev => [...prev, newConv])
    setActiveConversationId(id)
    return id
  }, [])

  const sendUserMessage = useCallback((conversationId: string, text: string) => {
    const now = new Date().toISOString()
    const msg: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      conversationId,
      text,
      sender: 'user',
      timestamp: now,
      read: false
    }
    setConversations(prev => prev.map(c => {
      if (c.id !== conversationId) return c
      return {
        ...c,
        messages: [...c.messages, msg],
        updatedAt: now,
        status: 'pending' as const
      }
    }))
  }, [])

  const sendBotMessage = useCallback((conversationId: string, text: string) => {
    const now = new Date().toISOString()
    const msg: ChatMessage = {
      id: `msg-${Date.now()}-bot-${Math.random().toString(36).slice(2, 6)}`,
      conversationId,
      text,
      sender: 'bot',
      timestamp: now,
      read: true
    }
    setConversations(prev => prev.map(c => {
      if (c.id !== conversationId) return c
      return {
        ...c,
        messages: [...c.messages, msg],
        updatedAt: now
      }
    }))
  }, [])

  const sendAgentMessage = useCallback((conversationId: string, text: string) => {
    const now = new Date().toISOString()
    const msg: ChatMessage = {
      id: `msg-${Date.now()}-agent-${Math.random().toString(36).slice(2, 6)}`,
      conversationId,
      text,
      sender: 'agent',
      timestamp: now,
      read: true
    }
    setConversations(prev => prev.map(c => {
      if (c.id !== conversationId) return c
      return {
        ...c,
        messages: [...c.messages, msg],
        updatedAt: now,
        status: 'active' as const
      }
    }))
  }, [])

  const markConversationRead = useCallback((conversationId: string) => {
    setConversations(prev => prev.map(c => {
      if (c.id !== conversationId) return c
      return {
        ...c,
        messages: c.messages.map(m => ({ ...m, read: true }))
      }
    }))
  }, [])

  const closeConversation = useCallback((conversationId: string) => {
    setConversations(prev => prev.map(c => {
      if (c.id !== conversationId) return c
      return {
        ...c,
        status: 'closed' as const,
        updatedAt: new Date().toISOString()
      }
    }))
  }, [])

  const getUnreadCount = useCallback(() => {
    return conversations
      .filter(c => c.status !== 'closed')
      .reduce((sum, c) => {
        const unread = c.messages.filter(m => m.sender === 'user' && !m.read).length
        return sum + unread
      }, 0)
  }, [conversations])

  const value: ChatContextType = {
    conversations,
    activeConversationId,
    startConversation,
    sendUserMessage,
    sendBotMessage,
    sendAgentMessage,
    markConversationRead,
    closeConversation,
    getUnreadCount
  }

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}
