'use client';

import { useState, useRef, useEffect } from 'react';
import LeadForm from './LeadForm';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  showLeadForm?: boolean;
  properties?: Property[];
}

interface Property {
  id: string;
  title: string;
  price_display: string;
  bedrooms: number;
  bathrooms: number;
  location: string;
  amenities: string[];
  description: string;
}

interface LeadFormData {
  name: string;
  phone: string;
  email?: string;
  budget?: string;
  location_preference?: string;
}

const SUGGESTED_PROMPTS = [
  "3 bedroom apartment in Westlands under 15M",
  "Rental apartments near Kilimani",
  "Affordable homes in Syokimau",
  "Luxury apartments with gym and parking",
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Habari! I am Nyumba, your JustHomes AI assistant. I can help you find properties across Kenya. What are you looking for today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
          session_id: sessionId,
        }),
      });

      const data = await response.json();

      if (data.session_id) setSessionId(data.session_id);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        properties: data.properties || [],
        showLeadForm: data.lead_prompt && !leadSubmitted,
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, I am having trouble connecting. Please try again.',
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleLeadSubmit = async (formData: LeadFormData) => {
    try {
      const response = await fetch(`${API_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          intent: 'unknown',
          session_id: sessionId,
        }),
      });

      const data = await response.json();
      setLeadSubmitted(true);

      // Hide all lead forms
      setMessages(prev => prev.map(m => ({ ...m, showLeadForm: false })));

      // Add confirmation message
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.message + ' In the meantime, you can also reach us directly on WhatsApp!',
      }]);

      // Open WhatsApp if URL available
      if (data.whatsapp_url) {
        setTimeout(() => window.open(data.whatsapp_url, '_blank'), 1500);
      }

    } catch {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Sorry, something went wrong. Please try again.',
      }]);
    }
  };

  const handleLeadSkip = () => {
    setMessages(prev => prev.map(m => ({ ...m, showLeadForm: false })));
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'assistant',
      content: 'No problem! Feel free to keep browsing. I am here if you need anything. 😊',
    }]);
  };

  return (
    <>
      {/* Chat Panel */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '90px',
          right: '24px',
          width: '380px',
          height: '580px',
          background: '#111827',
          borderRadius: '20px',
          border: '1px solid #1f2937',
          boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          zIndex: 1000,
          animation: 'slideUp 0.3s ease-out forwards',
        }}>

          {/* Header */}
          <div style={{
            padding: '16px 20px',
            background: '#0f172a',
            borderBottom: '1px solid #1f2937',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
              }}>🏠</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px', color: 'white' }}>Nyumba</div>
                <div style={{ fontSize: '11px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
                  Online · JustHomes AI
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
  {/* WhatsApp Button */}
  <button
    onClick={() => window.open(
      `https://wa.me/254700000000?text=Hello JustHomes! I need help finding a property.`,
      '_blank'
    )}
    style={{
      background: 'rgba(37,211,102,0.1)',
      border: '1px solid rgba(37,211,102,0.3)',
      borderRadius: '8px',
      padding: '6px 10px',
      color: '#25d366',
      fontSize: '11px',
      fontWeight: 600,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
    }}
  >
    <span>💬</span>
    <span>WhatsApp</span>
  </button>

  {/* Close Button */}
  <button
    onClick={() => setIsOpen(false)}
    style={{
      background: 'none',
      border: 'none',
      color: '#6b7280',
      cursor: 'pointer',
      fontSize: '20px',
      lineHeight: 1,
    }}
  >×</button>
</div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            {messages.map(message => (
              <div key={message.id}>
                <div style={{
                  display: 'flex',
                  justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                }}>
                  <div style={{
                    maxWidth: '80%',
                    padding: '10px 14px',
                    borderRadius: message.role === 'user'
                      ? '18px 18px 4px 18px'
                      : '18px 18px 18px 4px',
                    background: message.role === 'user' ? '#14b8a6' : '#1f2937',
                    color: 'white',
                    fontSize: '13px',
                    lineHeight: 1.6,
                  }}>
                    {message.content}
                  </div>
                </div>

                {/* Property Cards */}
                {message.properties && message.properties.length > 0 && (
                  <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {message.properties.slice(0, 2).map(property => (
                      <div key={property.id} style={{
                        background: '#1f2937',
                        border: '1px solid #374151',
                        borderRadius: '12px',
                        padding: '12px',
                        marginLeft: '0',
                      }}>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: 'white', marginBottom: '4px' }}>
                          🏠 {property.title}
                        </div>
                        <div style={{ fontSize: '13px', color: '#14b8a6', fontWeight: 700, marginBottom: '4px' }}>
                          {property.price_display}
                        </div>
                        <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>
                          📍 {property.location} · {property.bedrooms}BR {property.bathrooms}BA
                        </div>
                        <div style={{ fontSize: '11px', color: '#6b7280' }}>
                          ✓ {property.amenities.slice(0, 3).join(' · ')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Lead Form */}
                {message.showLeadForm && (
                  <LeadForm
                    onSubmit={handleLeadSubmit}
                    onSkip={handleLeadSkip}
                  />
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '18px 18px 18px 4px',
                  background: '#1f2937',
                  display: 'flex',
                  gap: '4px',
                  alignItems: 'center',
                }}>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            )}

            {/* Suggested prompts */}
            {messages.length === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                <div style={{ fontSize: '11px', color: '#6b7280', textAlign: 'center' }}>Try asking:</div>
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    style={{
                      background: 'rgba(20,184,166,0.08)',
                      border: '1px solid rgba(20,184,166,0.2)',
                      borderRadius: '10px',
                      padding: '8px 12px',
                      color: '#5eead4',
                      fontSize: '12px',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '12px 16px',
            borderTop: '1px solid #1f2937',
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
          }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
              placeholder="Ask about properties..."
              style={{
                flex: 1,
                background: '#1f2937',
                border: '1px solid #374151',
                borderRadius: '12px',
                padding: '10px 14px',
                color: 'white',
                fontSize: '13px',
                outline: 'none',
              }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: input.trim() ? '#14b8a6' : '#1f2937',
                border: 'none',
                cursor: input.trim() ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                transition: 'all 0.2s',
              }}
            >
              ↑
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        zIndex: 1001,
      }}>
        {!isOpen && (
          <div style={{
            background: '#14b8a6',
            color: 'white',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 12px rgba(20,184,166,0.3)',
            animation: 'fadeInUp 0.3s ease-out forwards',
          }}>
            Uliza Swali 🏠
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #14b8a6, #0d9488)',
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 24px rgba(20,184,166,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '24px',
            transition: 'transform 0.2s',
          }}
        >
          {isOpen ? '×' : '🏠'}
        </button>
      </div>
    </>
  );
}