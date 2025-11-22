
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User as UserIcon, Minimize2, Maximize2, Sparkles } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { MOCK_PRODUCTS, MOCK_KPIS, MOCK_OPERATIONS, MOCK_USER, MOCK_MOVE_HISTORY } from '../constants';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
}

interface ChatBotProps {
  showLabel?: boolean;
}

export const ChatBot: React.FC<ChatBotProps> = ({ showLabel = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: 'welcome', 
      role: 'model', 
      text: `Hi ${MOCK_USER.name}! I'm your StockMaster AI assistant. I have access to your inventory, KPIs, and recent operations. How can I help you today?` 
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Construct context from mock data
      const contextData = JSON.stringify({
        inventory: MOCK_PRODUCTS,
        kpis: MOCK_KPIS,
        recentOperations: MOCK_OPERATIONS,
        moveHistory: MOCK_MOVE_HISTORY.slice(0, 10), // Limit history to save tokens
        currentUser: MOCK_USER
      });

      const systemInstruction = `
        You are a highly intelligent inventory management assistant for "StockMaster".
        You have access to the following JSON data representing the current state of the company:
        ${contextData}

        Your goal is to answer user questions specifically based on this data.
        - If asked about stock levels, check the 'inventory' array.
        - If asked about financial valuation, checking KPIs or calculate from product unitPrice * stockLevel.
        - If asked about pending orders, check 'recentOperations'.
        - Be concise, professional, and helpful.
        - If the answer requires calculation (e.g., "total value of Electronics"), perform it.
        - Format currency in Indian Rupees (₹).
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [
          { role: 'user', parts: [{ text: userMessage.text }] }
        ],
        config: {
          systemInstruction: systemInstruction,
        },
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response.text || "I'm sorry, I couldn't generate a response."
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I encountered an error connecting to the AI service. Please check your API key or try again later."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Widget Container */}
      <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3 pointer-events-none">
         {/* Label Bubble */}
         {!isOpen && showLabel && (
            <div className="bg-surface border border-border px-4 py-2.5 rounded-2xl shadow-lg mb-2 pointer-events-auto animate-fade-in mr-1 flex items-center gap-2 transform transition-all hover:scale-105 origin-right">
              <p className="text-sm font-medium text-text whitespace-nowrap">Need assistance? Chat with our AI support.</p>
            </div>
         )}

         {/* Floating Action Button */}
         <button
          onClick={() => setIsOpen(true)}
          className={`pointer-events-auto flex items-center justify-center w-14 h-14 rounded-full shadow-lg bg-primary text-white hover:bg-primary-600 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-primary/30 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
          aria-label="Open Chat Assistant"
        >
          <MessageSquare size={26} strokeWidth={2.5} />
        </button>
      </div>

      {/* Chat Window */}
      <div 
        className={`fixed z-50 bg-surface border border-border shadow-2xl transition-all duration-300 ease-in-out flex flex-col overflow-hidden
          ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}
          ${isExpanded 
            ? 'bottom-0 right-0 w-full h-full md:w-[600px] md:h-[80vh] md:bottom-6 md:right-6 md:rounded-2xl' 
            : 'bottom-6 right-6 w-[90vw] h-[500px] max-w-[400px] rounded-2xl'
          }
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-primary text-white">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-white/20 rounded-lg">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm leading-tight">StockMaster AI</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                <span className="text-[10px] font-medium opacity-90">Online</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 hover:bg-white/20 rounded-md transition-colors hidden md:block"
              title={isExpanded ? "Minimize" : "Expand"}
            >
              {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1.5 hover:bg-white/20 rounded-md transition-colors"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-bg scroll-smooth">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[85%] gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-accent text-white'}`}>
                  {msg.role === 'user' ? <UserIcon size={16} /> : <Sparkles size={16} />}
                </div>
                <div 
                  className={`p-3.5 rounded-2xl text-sm shadow-sm leading-relaxed whitespace-pre-line ${
                    msg.role === 'user' 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-surface text-text border border-border rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start w-full">
               <div className="flex gap-2 max-w-[85%]">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center">
                     <Sparkles size={16} />
                  </div>
                  <div className="bg-surface border border-border p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1">
                    <div className="w-2 h-2 bg-muted/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-muted/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-muted/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-surface border-t border-border">
          <form onSubmit={handleSendMessage} className="flex items-end gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about stock, orders, or value..."
              className="flex-1 bg-bg border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder-muted text-text"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-3 bg-primary text-white rounded-xl hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
