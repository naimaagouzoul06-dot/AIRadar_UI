
import { useState, useRef, useEffect } from 'react';
import './Chatbot.css';

const API_BASE = 'http://localhost/AtelierWebProjet/proj_uml_web/Ai_Radar/back-end/Api';

const ChatIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const SendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

const BotIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    <line x1="12" y1="3" x2="12" y2="7"/>
    <circle cx="9" cy="16" r="1" fill="currentColor"/>
    <circle cx="15" cy="16" r="1" fill="currentColor"/>
  </svg>
);

// Icône agrandir
const ExpandIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 3 21 3 21 9"/>
    <polyline points="9 21 3 21 3 15"/>
    <line x1="21" y1="3" x2="14" y2="10"/>
    <line x1="3" y1="21" x2="10" y2="14"/>
  </svg>
);

// Icône réduire
const CollapseIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 14 10 14 10 20"/>
    <polyline points="20 10 14 10 14 4"/>
    <line x1="10" y1="14" x2="3" y2="21"/>
    <line x1="21" y1="3" x2="14" y2="10"/>
  </svg>
);

const SUGGESTIONS = [
  "Quel outil AI pour générer des images ?",
  "Recommande-moi un chatbot gratuit",
  "C'est quoi AI Radar ?",
  "Quels outils AI pour coder ?",
];

export default function Chatbot() {
  const [open, setOpen]         = useState(false);
  const [expanded, setExpanded] = useState(false); // ← état élargi
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Bonjour ! 👋 Je suis l'assistant AI Radar. Je peux vous aider à trouver l'outil AI parfait ou répondre à vos questions sur le site. Comment puis-je vous aider ?",
    },
  ]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [showSugg, setShowSugg] = useState(true);
  const bottomRef               = useRef(null);
  const inputRef                = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  // Fermer avec Escape
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        if (expanded) setExpanded(false);
        else setOpen(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [expanded]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;

    setInput('');
    setShowSugg(false);

    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res  = await fetch(`${API_BASE}/chatbot.php`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      if (data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: "Désolé, une erreur s'est produite. Réessayez." }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: "Erreur réseau — vérifiez que XAMPP est lancé." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: "Bonjour ! 👋 Je suis l'assistant AI Radar. Comment puis-je vous aider ?",
    }]);
    setShowSugg(true);
  };

  const toggleExpand = () => setExpanded(v => !v);

  return (
    <>
      {/* ── Overlay sombre quand élargi ── */}
      {expanded && (
        <div className="cb-overlay" onClick={() => setExpanded(false)} />
      )}

      {/* ── Bulle flottante ── */}
      <button
        className={`cb-bubble ${open ? 'cb-bubble-open' : ''}`}
        onClick={() => setOpen(v => !v)}
        aria-label="Open AI assistant"
      >
        {open ? <CloseIcon /> : <ChatIcon />}
        {!open && <span className="cb-bubble-dot" />}
      </button>

      {/* ── Fenêtre du chat ── */}
      <div className={`cb-window ${open ? 'cb-window-open' : ''} ${expanded ? 'cb-window-expanded' : ''}`}>

        {/* Header */}
        <div className="cb-header">
          <div className="cb-header-left">
            <div className="cb-avatar"><BotIcon /></div>
            <div>
              <div className="cb-header-name">AI Radar Assistant</div>
              <div className="cb-header-status">
                <span className="cb-status-dot" />
                Online
              </div>
            </div>
          </div>
          <div className="cb-header-actions">
            {/* Bouton agrandir/réduire */}
            <button
              className="cb-icon-btn"
              onClick={toggleExpand}
              title={expanded ? 'Réduire' : 'Agrandir'}
            >
              {expanded ? <CollapseIcon /> : <ExpandIcon />}
            </button>
            <button className="cb-icon-btn" onClick={clearChat} title="Effacer le chat">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/>
              </svg>
            </button>
            <button className="cb-icon-btn" onClick={() => { setOpen(false); setExpanded(false); }} title="Fermer">
              <CloseIcon />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="cb-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`cb-msg cb-msg-${msg.role}`}>
              {msg.role === 'assistant' && (
                <div className="cb-msg-avatar"><BotIcon /></div>
              )}
              <div className="cb-msg-bubble">{msg.content}</div>
            </div>
          ))}

          {/* Suggestions */}
          {showSugg && messages.length === 1 && (
            <div className="cb-suggestions">
              {SUGGESTIONS.map((s, i) => (
                <button key={i} className="cb-suggestion-btn" onClick={() => sendMessage(s)}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Loading dots */}
          {loading && (
            <div className="cb-msg cb-msg-assistant">
              <div className="cb-msg-avatar"><BotIcon /></div>
              <div className="cb-msg-bubble cb-typing">
                <span /><span /><span />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="cb-input-area">
          <textarea
            ref={inputRef}
            className="cb-input"
            placeholder="Posez votre question..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={loading}
          />
          <button
            className="cb-send-btn"
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
          >
            <SendIcon />
          </button>
        </div>

        <div className="cb-footer">
          Powered by Groq AI · AI Radar
        </div>

      </div>
    </>
  );
}