import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { 
  ChatCircleDots, 
  X, 
  PaperPlaneTilt, 
  Robot,
  User,
  Phone,
  EnvelopeSimple,
  WhatsappLogo
} from '@phosphor-icons/react'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

const quickResponses = [
  { id: 'jobs', text: "I'm looking for a job", response: "Great! We have many opportunities available. You can browse our current openings in the Jobs section above, or fill out our application form and we'll match you with suitable positions. What type of work are you interested in?" },
  { id: 'employer', text: "I need to hire staff", response: "Excellent! We specialize in providing qualified temporary and permanent staff. Our team can help with janitorial, HR, retail, call center, and industrial staffing needs. Would you like us to call you to discuss your requirements?" },
  { id: 'status', text: "Check application status", response: "To check your application status, please contact us at (301) 277-2141 or email omorilla@uniquestaffingprofessionals.com with your name and the date you applied. We typically review applications within 2-3 business days." },
  { id: 'hours', text: "What are your hours?", response: "Our office is open Monday through Friday, 9:00 AM to 5:00 PM EST. You can reach us at (301) 277-2141. For urgent matters outside business hours, please leave a message and we'll return your call the next business day." },
  { id: 'location', text: "Where are you located?", response: "We're located at 6001 66th Ave, Riverdale, MD 20737. We primarily serve the Maryland, Washington D.C., and Northern Virginia areas (DMV region). Feel free to visit us during business hours!" }
]

export function LiveChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showQuickReplies, setShowQuickReplies] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial greeting
      setTimeout(() => {
        setMessages([{
          id: '1',
          text: "Hi! 👋 Welcome to Unique Staffing Professionals. I'm here to help you find the perfect job or staffing solution. How can I assist you today?",
          sender: 'bot',
          timestamp: new Date()
        }])
      }, 500)
    }
  }, [isOpen, messages.length])

  const handleQuickResponse = (quick: typeof quickResponses[0]) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: quick.text,
      sender: 'user',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setShowQuickReplies(false)

    // Simulate typing
    setIsTyping(true)
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: quick.response,
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
      setShowQuickReplies(true)
    }, 1000 + Math.random() * 1000)
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setShowQuickReplies(false)

    // Simulate typing and bot response
    setIsTyping(true)
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Thank you for your message! For personalized assistance, please call us at (301) 277-2141 or email omorilla@uniquestaffingprofessionals.com. One of our staffing specialists will be happy to help you.",
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
      setShowQuickReplies(true)
    }, 1500)
  }

  return (
    <>
      {/* Chat Button */}
      <motion.div
        className="fixed bottom-4 right-4 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, type: 'spring', stiffness: 200 }}
      >
        <AnimatePresence mode="wait">
          {!isOpen && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <Button
                onClick={() => setIsOpen(true)}
                size="lg"
                className="h-14 w-14 rounded-full shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-shadow"
              >
                <ChatCircleDots size={28} weight="fill" />
              </Button>
              {/* Notification badge */}
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-4 right-4 z-50 w-[380px] max-w-[calc(100vw-2rem)]"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <Card className="overflow-hidden shadow-2xl border-border/50">
              {/* Header */}
              <div className="bg-primary text-primary-foreground p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                        <Robot size={24} />
                      </div>
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Staffing Assistant</h3>
                      <p className="text-xs text-primary-foreground/80">Usually replies instantly</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-primary-foreground hover:bg-white/20"
                    onClick={() => setIsOpen(false)}
                  >
                    <X size={20} />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="h-80 overflow-y-auto p-4 bg-background space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-end gap-2 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                      }`}>
                        {message.sender === 'user' ? <User size={16} /> : <Robot size={16} />}
                      </div>
                      <div className={`rounded-2xl px-4 py-2 ${
                        message.sender === 'user' 
                          ? 'bg-primary text-primary-foreground rounded-br-md' 
                          : 'bg-secondary text-foreground rounded-bl-md'
                      }`}>
                        <p className="text-sm leading-relaxed">{message.text}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-end gap-2"
                  >
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <Robot size={16} />
                    </div>
                    <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Quick replies */}
                {showQuickReplies && messages.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-wrap gap-2 pt-2"
                  >
                    {quickResponses.slice(0, 3).map((quick) => (
                      <button
                        key={quick.id}
                        onClick={() => handleQuickResponse(quick)}
                        className="text-xs px-3 py-1.5 rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
                      >
                        {quick.text}
                      </button>
                    ))}
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick contact options */}
              <div className="border-t border-border bg-muted/50 px-4 py-2 flex justify-center gap-4">
                <a
                  href="tel:+13012772141"
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <Phone size={14} />
                  <span>Call</span>
                </a>
                <a
                  href="mailto:omorilla@uniquestaffingprofessionals.com"
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <EnvelopeSimple size={14} />
                  <span>Email</span>
                </a>
                <a
                  href="sms:+13012772141"
                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <WhatsappLogo size={14} />
                  <span>Text</span>
                </a>
              </div>

              {/* Input */}
              <div className="border-t border-border p-3 bg-card">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    handleSendMessage()
                  }}
                  className="flex gap-2"
                >
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1"
                  />
                  <Button type="submit" size="icon" disabled={!inputValue.trim()}>
                    <PaperPlaneTilt size={20} weight="fill" />
                  </Button>
                </form>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
