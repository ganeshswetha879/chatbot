import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';
import { storage } from '../lib/storage';

export default function ChatSupport() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMessages(storage.getChatMessages());
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      content: input,
      role: 'user',
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    storage.saveChatMessage(userMessage);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse = {
        content: "I'm a simple chatbot for this hackathon demo. I can acknowledge your message but can't provide real assistance yet.",
        role: 'assistant',
        created_at: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, botResponse]);
      storage.saveChatMessage(botResponse);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden h-[calc(100vh-12rem)]">
        <div className="p-4 bg-primary-600 text-white">
          <h1 className="text-xl font-semibold">Chat Support</h1>
          <p className="text-sm opacity-90">Demo chatbot for hackathon</p>
        </div>

        <div className="flex flex-col h-[calc(100%-8rem)]">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <ReactMarkdown className="prose prose-sm">
                    {message.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="input flex-1"
              />
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!input.trim() || isTyping}
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}