import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, Loader2, Sparkles } from 'lucide-react';
import './TecChatbot.css';

const TecChatbot = ({ apiUrl, isEnabled = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Add welcome message when chatbot opens for the first time
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: Date.now(),
          text: 'مرحباً! أنا Tec 🤖، مساعدك الذكي في جامعة عمان العربية. كيف يمكنني مساعدتك اليوم؟',
          sender: 'bot',
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);
    setIsLoading(true);

    try {
      // Prepare conversation history for context
      const conversationHistory = messages.map((msg) => ({
        role: msg.sender === 'user' ? 'user' : 'assistant',
        content: msg.text,
      }));

      // Send message to backend API with conversation history
      const response = await fetch(`${apiUrl}/api/chatbot/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          conversationHistory: conversationHistory,
          imageUrl: imagePreview || null,
        }),
      });

      const data = await response.json();

      // Simulate typing delay for better UX
      setTimeout(() => {
        const botMessage = {
          id: Date.now() + 1,
          text: data.response || 'عذراً، لم أتمكن من فهم سؤالك. يرجى المحاولة مرة أخرى.',
          sender: 'bot',
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, botMessage]);
        setIsTyping(false);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      
      setTimeout(() => {
        const errorMessage = {
          id: Date.now() + 1,
          text: 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى لاحقاً.',
          sender: 'bot',
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, errorMessage]);
        setIsTyping(false);
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Don't render if chatbot is disabled
  if (!isEnabled) return null;

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="tec-chatbot-button"
            aria-label="Open Tec Chatbot"
          >
            <div className="tec-button-glow"></div>
            <MessageCircle className="tec-button-icon" size={28} />
            <motion.div
              className="tec-button-pulse"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="tec-chatbot-window"
          >
            {/* Header */}
            <div className="tec-chatbot-header">
              <div className="tec-header-content">
                <div className="tec-bot-avatar">
                  <img src="/tec_avatar.png" alt="Tec Bot Icon" className="tec-bot-icon" />
                  <motion.div
                    className="tec-avatar-pulse"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 0, 0.7],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                </div>
                <div className="tec-bot-info">
                  <h3 className="tec-bot-name">
                    Tec
                    <Sparkles size={16} className="tec-sparkle" />
                  </h3>
                  <p className="tec-bot-status">
                    {isTyping ? 'يكتب...' : 'متصل الآن'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="tec-close-button"
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="tec-chatbot-messages">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`tec-message ${
                      message.sender === 'user' ? 'tec-message-user' : 'tec-message-bot'
                    }`}
                  >
                    {message.sender === 'bot' && (
                      <div className="tec-message-avatar">
                        <img src="/tec_avatar.png" alt="Tec Bot Icon" className="tec-message-bot-icon" />
                      </div>
                    )}
                    <div className="tec-message-bubble">
                      <p className="tec-message-text">{message.text}</p>
                      <span className="tec-message-time">
                        {message.timestamp.toLocaleTimeString('ar-JO', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="tec-message tec-message-bot"
                >
                  <div className="tec-message-avatar">
                    <img src="/tec_avatar.png" alt="Tec Bot Icon" className="tec-message-bot-icon" />
                  </div>
                  <div className="tec-typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="tec-chatbot-input">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="اكتب سؤالك هنا..."
                className="tec-input-field"
                rows="1"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="tec-send-button"
                aria-label="Send message"
              >
                {isLoading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Send size={20} />
                )}
              </button>
            </div>

            {/* Footer */}
            <div className="tec-chatbot-footer">
              <p>Powered by AI • Amman Arab University</p>
              <p className="tec-developed-by">Developed by TechNest</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default TecChatbot;

