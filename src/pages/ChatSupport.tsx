import { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';
import { storage } from '../lib/storage';
import { sendChatMessage } from '../lib/api';
import { MapPinIcon, ShareIcon } from '@heroicons/react/24/outline';
import Map, { Marker } from 'react-map-gl';

const SYSTEM_PROMPT = `You are GuardianBot, an AI emergency response assistant. Your role is to:
1. Help people report emergencies and incidents
2. Provide immediate safety guidance
3. Collect relevant information (location, situation details)
4. Offer emotional support
5. Guide users through the emergency response process

Always maintain a calm, professional tone. For serious emergencies, emphasize the importance of contacting emergency services first.`;

export default function ChatSupport() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [location, setLocation] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const savedMessages = storage.getChatMessages();
    if (savedMessages.length === 0) {
      const initialMessage = {
        role: 'assistant',
        content: "Hello! I'm your GuardianBot assistant. To help you better, could you:\n\n1. Share your location\n2. Describe what happened\n3. Any immediate help needed?\n\nOur team will guide you through the process. 🛡️",
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

    // Prepare messages for API
    const apiMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map(msg => ({ role: msg.role, content: msg.content })),
      { role: 'user', content: input }
    ];

    try {
      const response = await sendChatMessage(apiMessages);
      
      if (response) {
        const botResponse = {
          content: response,
          role: 'assistant',
          created_at: new Date().toISOString()
        };
        
        setMessages(prev => [...prev, botResponse]);
        storage.saveChatMessage(botResponse);
      }
    } catch (error) {
      toast.error('Failed to get response. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  const shareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setLocation(newLocation);
          
          // Add location message to chat
          const locationMessage = {
            role: 'user',
            content: `📍 Location shared: ${newLocation.lat}, ${newLocation.lng}`,
            created_at: new Date().toISOString()
          };
          setMessages(prev => [...prev, locationMessage]);
          storage.saveChatMessage(locationMessage);
          
          toast.success('Location shared successfully');
        },
        () => toast.error('Could not get your location')
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-6xl mx-auto h-screen flex flex-col">
        <div className="flex-1 flex flex-col bg-gray-800 shadow-xl rounded-lg m-4">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-700">
            <h1 className="text-2xl font-bold text-white">Emergency Response Chat</h1>
            <p className="text-gray-400">We're here to help 24/7</p>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-6 py-4 ${
                      message.role === 'user'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-700 text-gray-100'
                    }`}
                  >
                    <ReactMarkdown 
                      className="prose prose-invert prose-lg"
                      components={{
                        p: ({node, ...props}) => <p className="text-lg" {...props} />
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-700 rounded-2xl px-6 py-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                      <div className="w-3 h-3 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Location Map */}
          {location && (
            <div className="px-6 py-4 border-t border-gray-700">
              <div className="h-48 rounded-lg overflow-hidden">
                <Map
                  initialViewState={{
                    latitude: location.lat,
                    longitude: location.lng,
                    zoom: 14
                  }}
                  mapStyle="mapbox://styles/mapbox/dark-v10"
                  mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
                >
                  <Marker latitude={location.lat} longitude={location.lng}>
                    <MapPinIcon className="h-8 w-8 text-primary-500" />
                  </Marker>
                </Map>
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="px-6 py-4 border-t border-gray-700">
            <div className="flex space-x-4 mb-4">
              <button
                onClick={shareLocation}
                className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-xl transition-colors text-lg"
              >
                <MapPinIcon className="h-6 w-6" />
                Share Location
              </button>
              <button
                className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-xl transition-colors text-lg"
              >
                <ShareIcon className="h-6 w-6" />
                Share Media
              </button>
            </div>
            <form onSubmit={handleSubmit} className="flex space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-gray-700 text-gray-100 placeholder-gray-400 text-lg rounded-xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="submit"
                className="bg-primary-600 hover:bg-primary-500 text-white px-8 py-4 rounded-xl transition-colors text-lg font-medium"
                disabled={!input.trim() || isTyping}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}