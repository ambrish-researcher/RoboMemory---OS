import { useState, useRef, useEffect } from 'react'
import { sendMessage, getMemories } from '../lib/api'
import { Memory, Message, RecalledMemory } from '../lib/types'

const CATEGORY_COLORS: Record<string, string> = {
  'AI & Robotics': '#00D4FF',
  'Research': '#7C6AF7',
  'Goals': '#3DD68C',
  'Learning': '#F5A623',
  'Inspirations': '#FF6B6B',
  'Values': '#A855F7',
  'General': '#8B92A8'
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [memories, setMemories] = useState<Memory[]>([])
  const [recalledMemories, setRecalledMemories] = useState<RecalledMemory[]>([])
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getMemories().then(setMemories).catch(console.error)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMessage = input.trim()
    setInput('')

    const newUserMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, newUserMsg])
    setLoading(true)

    try {
      const history = messages.map(m => ({
        role: m.role,
        content: m.content
      }))

      const data = await sendMessage(userMessage, history)

      const newRoboMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'ROBO encountered an error.',
        timestamp: new Date().toISOString()
      }

      setMessages(prev => [...prev, newRoboMsg])
      setRecalledMemories(data.recalled_memories || [])
      getMemories().then(setMemories)

    } catch (err) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'ROBO encountered an error. Please try again.',
        timestamp: new Date().toISOString()
      }])
    }

    setLoading(false)
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '260px 1fr 300px',
      height: '100%',
      overflow: 'hidden'
    }}>

      {/* LEFT - Memory Timeline */}
      <div style={{
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border)',
        overflowY: 'auto',
        padding: '16px'
      }}>
        <p style={{
          color: 'var(--accent-primary)',
          fontSize: '11px',
          fontFamily: 'JetBrains Mono',
          letterSpacing: '2px',
          marginBottom: '16px'
        }}>
          ROBO MEMORY
        </p>

        {memories.length === 0 ? (
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <p style={{ fontSize: '32px' }}>🤖</p>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
              No memories yet
            </p>
          </div>
        ) : (
          memories.map((mem, i) => (
            <div
              key={i}
              style={{
                borderLeft: `3px solid ${CATEGORY_COLORS[mem.category] || '#8B92A8'}`,
                paddingLeft: '10px',
                marginBottom: '14px',
                animation: 'fadeIn 0.3s ease'
              }}
            >
              <p style={{
                color: 'var(--text-primary)',
                fontSize: '12px',
                fontFamily: 'JetBrains Mono',
                lineHeight: '1.5',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {mem.content}
              </p>
              <span style={{
                color: CATEGORY_COLORS[mem.category] || '#8B92A8',
                fontSize: '10px',
                marginTop: '4px',
                display: 'block'
              }}>
                {mem.category}
              </span>
            </div>
          ))
        )}
      </div>

      {/* CENTER - Chat */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        background: 'var(--bg-base)',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '12px 20px',
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg-surface)'
        }}>
          <p style={{
            color: 'var(--text-primary)',
            fontSize: '14px',
            fontWeight: 500
          }}>
            🤖 Chat with ROBO
          </p>
        </div>

        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {messages.length === 0 && (
            <div style={{
              textAlign: 'center',
              marginTop: '80px',
              animation: 'fadeIn 0.5s ease'
            }}>
              <p style={{ fontSize: '64px', marginBottom: '16px' }}>🤖</p>
              <p style={{
                color: 'var(--accent-primary)',
                fontFamily: 'Space Grotesk',
                fontSize: '20px',
                marginBottom: '8px'
              }}>
                Hello Ambrish. I am ROBO.
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                I remember everything about you.
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginTop: '4px' }}>
                Ask me anything.
              </p>
            </div>
          )}

          {messages.map(msg => (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                animation: 'slideUp 0.15s ease'
              }}
            >
              {msg.role === 'assistant' && (
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '8px',
                  flexShrink: 0,
                  animation: 'glow 2s infinite',
                  fontSize: '14px'
                }}>
                  🤖
                </div>
              )}

              <div style={{
                maxWidth: '70%',
                padding: '12px 16px',
                borderRadius: '12px',
                background: msg.role === 'user'
                  ? 'var(--bg-elevated)'
                  : 'var(--bg-surface)',
                borderLeft: msg.role === 'user'
                  ? '3px solid var(--accent-primary)'
                  : 'none',
                fontSize: '14px',
                lineHeight: '1.6',
                color: 'var(--text-primary)'
              }}>
                <p style={{
                  fontSize: '10px',
                  color: msg.role === 'user'
                    ? 'var(--accent-primary)'
                    : 'var(--text-muted)',
                  marginBottom: '4px',
                  fontFamily: 'JetBrains Mono'
                }}>
                  {msg.role === 'user' ? 'Ambrish' : 'ROBO'}
                </p>
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px'
              }}>
                🤖
              </div>
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'var(--accent-primary)',
                    animation: `bounce 0.8s ${i * 0.15}s infinite`
                  }}
                />
              ))}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div style={{
          padding: '16px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          gap: '12px'
        }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Ask ROBO anything..."
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '8px',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
              resize: 'none',
              height: '48px',
              fontFamily: 'Inter',
              fontSize: '14px',
              outline: 'none'
            }}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            style={{
              padding: '12px 20px',
              borderRadius: '8px',
              background: loading || !input.trim()
                ? 'var(--bg-elevated)'
                : 'var(--accent-primary)',
              color: loading || !input.trim()
                ? 'var(--text-muted)'
                : '#000',
              border: 'none',
              cursor: loading || !input.trim()
                ? 'not-allowed'
                : 'pointer',
              fontWeight: 600,
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
          >
            Send
          </button>
        </div>
      </div>

      {/* RIGHT - Recall Panel */}
      <div style={{
        background: 'var(--bg-surface)',
        borderLeft: '1px solid var(--border)',
        padding: '16px',
        overflowY: 'auto'
      }}>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '11px',
          fontFamily: 'JetBrains Mono',
          letterSpacing: '2px',
          marginBottom: '16px'
        }}>
          MEMORIES USED
        </p>

        {recalledMemories.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            Memories used in this response will appear here.
          </p>
        ) : (
          recalledMemories.map((mem, i) => (
            <div
              key={i}
              style={{
                background: 'var(--bg-elevated)',
                borderRadius: '8px',
                padding: '10px',
                marginBottom: '10px',
                animation: 'slideUp 0.2s ease'
              }}
            >
              <p style={{
                color: 'var(--text-primary)',
                fontSize: '12px',
                fontFamily: 'JetBrains Mono',
                lineHeight: '1.5',
                marginBottom: '8px'
              }}>
                {mem.content?.substring(0, 120)}
              </p>
              <div style={{
                height: '4px',
                background: 'var(--border)',
                borderRadius: '2px'
              }}>
                <div style={{
                  height: '100%',
                  width: `${(mem.confidence || 0.9) * 100}%`,
                  background: 'var(--accent-warm)',
                  borderRadius: '2px'
                }} />
              </div>
              <p style={{
                color: 'var(--text-muted)',
                fontSize: '10px',
                marginTop: '4px',
                fontFamily: 'JetBrains Mono'
              }}>
                {Math.round((mem.confidence || 0.9) * 100)}% match
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
