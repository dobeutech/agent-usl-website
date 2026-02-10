import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  ChatCircleDots,
  PaperPlaneTilt,
  Robot,
  UserCircle,
  User,
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft
} from '@phosphor-icons/react'
import { useChat } from '@/contexts/ChatContext'

function formatRelativeTime(timestamp: string): string {
  const now = Date.now()
  const then = new Date(timestamp).getTime()
  const diff = Math.floor((now - then) / 1000)

  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function formatMessageTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function LiveChatAdmin() {
  const {
    conversations,
    sendAgentMessage,
    markConversationRead,
    closeConversation,
    getUnreadCount
  } = useChat()

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'active' | 'pending' | 'closed'>('all')
  const [replyText, setReplyText] = useState('')
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const unreadCount = getUnreadCount()
  const selectedConversation = conversations.find(c => c.id === selectedId)

  const filteredConversations = conversations
    .filter(c => filter === 'all' || c.status === filter)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selectedConversation?.messages.length])

  useEffect(() => {
    if (selectedId) {
      markConversationRead(selectedId)
    }
  }, [selectedId, markConversationRead])

  const handleSelectConversation = (id: string) => {
    setSelectedId(id)
    setMobileView('chat')
    setReplyText('')
  }

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedId) return
    sendAgentMessage(selectedId, replyText.trim())
    setReplyText('')
  }

  const handleBack = () => {
    setMobileView('list')
    setSelectedId(null)
  }

  const getStatusDot = (status: string) => {
    if (status === 'active') return 'bg-green-500'
    if (status === 'pending') return 'bg-yellow-500'
    return 'bg-gray-400'
  }

  const getStatusIcon = (status: string) => {
    if (status === 'active') return <CheckCircle size={14} className="text-green-600" />
    if (status === 'pending') return <Clock size={14} className="text-yellow-600" />
    return <XCircle size={14} className="text-gray-500" />
  }

  const getUnreadForConversation = (conv: typeof conversations[0]) => {
    if (conv.status === 'closed') return 0
    return conv.messages.filter(m => m.sender === 'user' && !m.read).length
  }

  const renderConversationList = () => (
    <div className="w-full md:w-80 md:border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg">Conversations</h3>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="h-5 min-w-5 flex items-center justify-center rounded-full text-xs px-1.5">
              {unreadCount}
            </Badge>
          )}
        </div>
        <div className="flex gap-1">
          {(['all', 'active', 'pending', 'closed'] as const).map(f => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              size="sm"
              className="text-xs capitalize flex-1"
              onClick={() => setFilter(f)}
            >
              {f}
            </Button>
          ))}
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="divide-y divide-border">
          {filteredConversations.length === 0 && (
            <div className="p-8 text-center text-muted-foreground text-sm">
              No conversations found
            </div>
          )}
          {filteredConversations.map(conv => {
            const lastMsg = conv.messages[conv.messages.length - 1]
            const unread = getUnreadForConversation(conv)
            return (
              <button
                key={conv.id}
                onClick={() => handleSelectConversation(conv.id)}
                className={`w-full text-left p-3 hover:bg-muted/50 transition-colors ${
                  selectedId === conv.id ? 'bg-muted' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${getStatusDot(conv.status)}`} />
                    <span className="font-medium text-sm">{conv.visitorName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {unread > 0 && (
                      <Badge variant="destructive" className="h-4 min-w-4 flex items-center justify-center rounded-full text-[10px] px-1">
                        {unread}
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {formatRelativeTime(conv.updatedAt)}
                    </span>
                  </div>
                </div>
                {lastMsg && (
                  <p className="text-xs text-muted-foreground truncate">
                    {lastMsg.text.length > 50 ? lastMsg.text.slice(0, 50) + '...' : lastMsg.text}
                  </p>
                )}
              </button>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )

  const renderChatView = () => {
    if (!selectedConversation) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <ChatCircleDots size={48} className="mx-auto mb-3 opacity-40" />
            <p>Select a conversation to start replying</p>
          </div>
        </div>
      )
    }

    return (
      <div className="flex-1 flex flex-col min-h-0">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={handleBack}
            >
              <ArrowLeft size={20} />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{selectedConversation.visitorName}</h3>
                <Badge variant="outline" className="text-xs flex items-center gap-1">
                  {getStatusIcon(selectedConversation.status)}
                  {selectedConversation.status}
                </Badge>
              </div>
            </div>
          </div>
          {selectedConversation.status !== 'closed' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => closeConversation(selectedConversation.id)}
            >
              <XCircle size={16} className="mr-1" />
              Close
            </Button>
          )}
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {selectedConversation.messages.map(msg => {
              const isUser = msg.sender === 'user'
              const isAgent = msg.sender === 'agent'
              const isBot = msg.sender === 'bot'

              return (
                <div
                  key={msg.id}
                  className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-end gap-2 max-w-[80%] ${isUser ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isUser ? 'bg-primary text-primary-foreground' :
                      isAgent ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                      'bg-secondary text-secondary-foreground'
                    }`}>
                      {isUser && <User size={14} />}
                      {isBot && <Robot size={14} />}
                      {isAgent && <UserCircle size={14} />}
                    </div>
                    <div>
                      <div className={`rounded-2xl px-3 py-2 ${
                        isUser ? 'bg-primary text-primary-foreground rounded-br-md' :
                        isAgent ? 'bg-green-100 dark:bg-green-900/30 text-foreground rounded-bl-md' :
                        'bg-secondary text-foreground rounded-bl-md'
                      }`}>
                        <p className="text-sm leading-relaxed">{msg.text}</p>
                      </div>
                      <p className={`text-[10px] text-muted-foreground mt-1 ${isUser ? 'text-right' : ''}`}>
                        {formatMessageTime(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {selectedConversation.status !== 'closed' && (
          <div className="p-3 border-t border-border">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendReply()
              }}
              className="flex gap-2"
            >
              <Input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply..."
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={!replyText.trim()}>
                <PaperPlaneTilt size={18} weight="fill" />
              </Button>
            </form>
          </div>
        )}
      </div>
    )
  }

  return (
    <Card className="flex flex-col md:flex-row h-[600px] overflow-hidden">
      <div className={`${mobileView === 'chat' ? 'hidden md:flex' : 'flex'} md:flex flex-col w-full md:w-80`}>
        {renderConversationList()}
      </div>
      <div className={`${mobileView === 'list' ? 'hidden md:flex' : 'flex'} md:flex flex-col flex-1 min-h-0`}>
        {renderChatView()}
      </div>
    </Card>
  )
}
