import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';
import { storage } from '../lib/storage';

const DEMO_RESPONSES = {
  greetings: [
    "Hello! How can I help you today?",
    "Hi there! I'm here to assist you with any emergency-related questions.",
    "Welcome to GuardianBot! How may I help you?"
  ],
  emergency: [
    "If this is a life-threatening emergency, please call emergency services immediately at 911.",
    "Your safety is our priority. Please contact emergency services first, then report the incident through our platform.",
    "For immediate assistance, please contact emergency services. Once safe, you can report the incident using our reporting system."
  ],
  safety: [
    "Here are some general safety tips:\n\n1. Stay calm and assess the situation\n2. Contact emergency services if needed\n3. Follow official evacuation procedures\n4. Keep emergency contacts handy\n5. Stay informed through official channels",
    "Remember these safety guidelines:\n\n- Keep emergency supplies ready\n- Know your evacuation routes\n- Have a family emergency plan\n- Stay updated with local news\n- Keep important documents accessible"
  ]
};

function getAIResponse(message) {
  const lowerMsg = message.toLowerCase();
  
  if (lowerMsg.includes('hello') || lowerMsg.includes('hi ')) {
    return DEMO_RESPONSES.greetings[Math.floor(Math.random() * DEMO_RESPONSES.greetings.length)];
  }
  
  if (lowerMsg.includes('emergency') || lowerMsg.includes('help')) {
    return DEMO_RESPONSES.emergency[Math.floor(Math.random() * DEMO_RESPONSES.emergency.length)];
  }
  
  if (lowerMsg.includes('safety') || lowerMsg.includes('tips')) {
    return DEMO_RESPONSES.safety[Math.floor(Math.random() * DEMO_RESPONSES.safety.length)];
  }
  
  return "I understand your concern. For specific assistance, please use our Report Issue feature or contact emergency services if it's urgent.";
}

export default function ChatSupport() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const savedMessages = storage.getChatMessages();
    if (savedMessages.length === 0) {
      const initialMessage = {
        role: 'assistant',
        content: "Hello! I'm GuardianBot, your emergency response assistant. How can I help you today?",
        created_at: new Date().toISOString()
      };
      storage.saveChatMessage(initialMessage);
      setMessages([initialMessage]);
    } else {
      setMessages(savedMessages);
    }
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

    // Simulate AI response with a delay
    setTimeout(() => {
      const botResponse = {
        content: getAIResponse(input),
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
          <h1 className="text-xl font-semibold">Emergency Response Chat Support</h1>
          <p className="text-sm opacity-90">Get immediate assistance and safety guidance</p>
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