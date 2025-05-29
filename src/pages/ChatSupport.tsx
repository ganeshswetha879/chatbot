import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';

export default function ChatSupport() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return;
    }
    setMessages(data || []);
  };

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
    setInput('');
    setIsTyping(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages.concat(userMessage).map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      const botResponse = {
        content: data.choices[0].message.content,
        role: 'assistant',
        created_at: new Date().toISOString()
      };

      setMessages(prev => [...prev, botResponse]);

      // Save messages to Supabase
      await supabase.from('chat_messages').insert([userMessage, botResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden h-[calc(100vh-12rem)]">
        <div className="p-4 bg-primary-600 text-white">
          <h1 className="text-xl font-semibold">Chat Support</h1>
          <p className="text-sm opacity-90">AI-powered assistance available 24/7</p>
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