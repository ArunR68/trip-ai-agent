import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Compass, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import type { ChatMessage, TripPlan } from '../types';
import { sendChatMessage } from '../services/api';

interface AiChatSectionProps {
  onPlanGenerated: (plan: TripPlan) => void;
  initialPrompt?: string;
}

export const AiChatSection: React.FC<AiChatSectionProps> = ({ onPlanGenerated, initialPrompt }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content:
        'Hello! I am **TourAI**, your personal AI Travel Agent & Smart Trip Planner. Tell me where you are starting from, your budget, travel duration, and the kind of vibe you enjoy!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedQuestions: [
        '“I have ₹5000 and 2 days. I’m in Coimbatore. I like nature places. Suggest a trip.”',
        '“Suggest a budget trip from Chennai for 3 days.”',
        '“I want beaches and adventure places under ₹10,000.”',
        '“Plan a family trip for 4 people from Bangalore.”',
      ],
    },
  ]);
  const [input, setInput] = useState(initialPrompt || '');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (userText: string) => {
    const textToSend = userText.trim();
    if (!textToSend || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const historyPayload = messages.map((m) => ({ role: m.role, content: m.content }));
      const response = await sendChatMessage(textToSend, historyPayload);

      const assistantMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedQuestions: response.suggestedQuestions,
        tripPlan: response.tripPlan,
        extractedQuery: response.extractedQuery,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (response.tripPlan) {
        onPlanGenerated(response.tripPlan);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          role: 'assistant',
          content: `I ran into a temporary connection issue (${err?.message || 'Server error'}). Let me help you formulate your request! Please mention your starting city, budget, and days.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          suggestedQuestions: [
            '“I have ₹5000 and 2 days in Coimbatore. Suggest nature trip.”',
            '“Budget trip from Chennai under ₹8000 for 3 days.”',
          ],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      id="ai-travel-chat"
      className="bg-white rounded-3xl border border-slate-200/80 shadow-md flex flex-col overflow-hidden max-w-4xl mx-auto h-[620px]"
    >
      {/* Chat Header */}
      <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              TourAI Interactive Travel Agent
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </h3>
            <p className="text-xs text-slate-400">
              Conversational trip planning • Budget aware • Live weather & routes
            </p>
          </div>
        </div>

        <button
          onClick={() =>
            setMessages([
              {
                id: 'welcome-reset',
                role: 'assistant',
                content: 'Chat cleared! Where would you like to travel next? Share your starting location, budget, or days.',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                suggestedQuestions: [
                  '“I have ₹5000 and 2 days. I’m in Coimbatore. I like nature places. Suggest a trip.”',
                  '“Suggest a budget trip from Chennai for 3 days.”',
                ],
              },
            ])
          }
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10"
          title="Reset conversation"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-slate-50/50">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  isUser
                    ? 'bg-slate-800 text-white'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[85%] sm:max-w-[75%] space-y-2`}>
                <div
                  className={`rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                    isUser
                      ? 'bg-slate-900 text-white rounded-tr-none'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content}</div>

                  {/* If this message generated a trip plan */}
                  {msg.tripPlan && (
                    <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                      <div className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4" />
                        <span>Plan for {msg.tripPlan.destination} generated!</span>
                      </div>
                      <button
                        onClick={() => msg.tripPlan && onPlanGenerated(msg.tripPlan)}
                        className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-xs transition-colors"
                      >
                        <span>View Itinerary Below</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Suggested prompt chips */}
                {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.suggestedQuestions.map((sq, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(sq.replace(/^[“”"']|[“”"']$/g, ''))}
                        className="text-[11px] font-medium text-slate-600 hover:text-emerald-800 bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 px-3 py-1.5 rounded-full transition-all text-left shadow-2xs"
                      >
                        {sq}
                      </button>
                    ))}
                  </div>
                )}

                <span className="text-[10px] text-slate-400 block px-1">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {/* Loading / Thinking bubble */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-none p-4 shadow-xs flex items-center gap-2.5 text-xs text-slate-500">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
              <span>TourAI is analyzing transit routes, calculating budgets & crafting your plan...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Bar */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex items-center gap-2"
        >
          <input
            id="chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. “I have ₹5000 and 2 days. I'm in Coimbatore. Suggest a trip.”"
            className="flex-1 bg-slate-50 border border-slate-200 focus:border-emerald-500 focus:bg-white focus:outline-none rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-800 transition-all placeholder:text-slate-400"
            disabled={isLoading}
          />
          <button
            id="chat-send-btn"
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold px-4 sm:px-5 py-3 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 transition-colors shrink-0 shadow-sm"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
