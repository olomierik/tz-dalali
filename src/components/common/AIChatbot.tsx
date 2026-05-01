import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, X, Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  suggestions?: string[];
}

const QUICK_ACTIONS = [
  { label: '🏠 3 bedroom house in Dar es Salaam', query: '3 bedroom house in Dar es Salaam' },
  { label: '💰 Properties under $100k', query: 'properties under 100000 USD' },
  { label: '🏖️ Villa in Zanzibar', query: 'villa in Zanzibar' },
  { label: '📍 Commercial in Nairobi', query: 'commercial property in Nairobi' },
];

const SUGGESTED_REPLIES = [
  { label: '🏠 Show me houses', action: 'houses' },
  { label: '💰 Price range', action: 'price' },
  { label: '📍 Near beaches', action: 'beach' },
  { label: '✅ Verified only', action: 'verified' },
];

export function AIChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI property assistant. I can help you find the perfect property using natural language. Try asking me something like "3 bedroom villa in Dar es Salaam under $200k" or "apartments near the beach".',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { lang } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response with context-aware replies
    setTimeout(() => {
      const response = generateAIResponse(messageText);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: response.content,
          suggestions: response.suggestions,
        },
      ]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const generateAIResponse = (query: string): { content: string; suggestions?: string[] } => {
    const q = query.toLowerCase();

    if (q.includes('villa') || q.includes('dar es salaam') || q.includes('zanzibar')) {
      return {
        content: lang === 'en'
          ? `I found some beautiful villas matching your criteria!\n\nBased on your search, here are the top matches:\n• Luxury Beach Villa in Zanzibar - $450,000\n• Modern Villa in Dar es Salaam - $320,000\n• Garden Villa in Arusha - $280,000\n\nWould you like me to show you these properties or adjust the search criteria?`
          : `我找到了一些符合您条件的美丽别墅！\n\n根据您的搜索，以下是最佳匹配：\n• 桑给巴尔海滩豪华别墅 - $450,000\n• 达累斯萨拉姆现代别墅 - $320,000\n• 阿鲁沙花园别墅 - $280,000\n\n您想查看这些房产还是调整搜索条件？`,
        suggestions: ['Show me these villas', 'Adjust criteria', 'Compare prices'],
      };
    }

    if (q.includes('apartment') || q.includes('studio')) {
      return {
        content: lang === 'en'
          ? `I found several apartments that might interest you!\n\n• Modern 2BR Apartment in Nairobi CBD - $85,000\n• Luxury Studio in Dar es Salaam - $45,000\n• Waterfront 3BR in Mombasa - $120,000\n\nShall I filter these by your preferred location or budget range?`
          : `我找到了一些可能让您感兴趣的公寓！\n\n• 内罗毕市中心现代2室公寓 - $85,000\n• 达累斯萨拉姆豪华单间 - $45,000\n• 蒙巴萨海滨3室 - $120,000\n\n要我按您偏好的位置或预算范围筛选吗？`,
        suggestions: ['Filter by price', 'Show on map', 'Save search'],
      };
    }

    if (q.includes('commercial') || q.includes('office') || q.includes('shop')) {
      return {
        content: lang === 'en'
          ? `Looking for commercial property? Great choice!\n\nI found:\n• Office Space in Nairobi CBD - $200,000\n• Retail Shop in Mombasa - $95,000\n• Warehouse in Tanzania - $150,000\n\nWould you like detailed information on any of these, or shall I search for something specific like "retail space under $100k"?`
          : `在寻找商业地产？不错的选择！\n\n我找到：\n• 内罗毕市中心办公楼 - $200,000\n• 蒙巴萨零售店 - $95,000\n• 坦桑尼亚仓库 - $150,000\n\n您想要了解这些房产的详细信息吗，或者我可以搜索如"10万美元以下的零售空间"这样的具体需求吗？`,
        suggestions: ['More details', 'Calculate ROI', 'Contact agent'],
      };
    }

    if (q.includes('under') || q.includes('budget') || q.includes('cheap') || /\d/.test(q)) {
      return {
        content: lang === 'en'
          ? `I'll search for properties within your budget!\n\nLet me refine the search based on your price range. I found properties starting from $30,000 for land plots to $150,000 for apartments and houses.\n\nWhat type of property are you looking for within this budget?`
          : `我将搜索您预算范围内的房产！\n\n根据您的价格范围，我找到了从$30,000起的土地到$150,000的公寓和别墅。\n\n在这个预算内您想要什么类型的房产？`,
        suggestions: ['Show me land', 'Show me apartments', 'Show me houses'],
      };
    }

    if (q.includes('land') || q.includes('plot')) {
      return {
        content: lang === 'en'
          ? `Land plots are a great investment! Here are some options:\n\n• 1/4 acre plot in Kilimanjaro - $25,000\n• 1 acre in Arusha - $40,000\n• Beachfront plot in Zanzibar - $180,000\n\nWould you like more details on any of these, or shall I search for plots in a specific area?`
          : `土地是很好的投资！以下是一些选择：\n\n• 乞力马扎罗1/4英亩土地 - $25,000\n• 阿鲁沙1英亩 - $40,000\n• 桑给巴尔海滨土地 - $180,000\n\n您想要了解这些的详细信息吗，或者我可以搜索特定区域的土地吗？`,
        suggestions: ['More details', 'Search by region', 'Investment info'],
      };
    }

    // Default response
    return {
      content: lang === 'en'
        ? `I understand you're looking for property. Let me help you find the best options.\n\nI can search by:\n• Location (city, country, or area)\n• Property type (house, apartment, villa, land, commercial)\n• Price range\n• Number of bedrooms/bathrooms\n\nJust describe what you're looking for in natural language, and I'll find the perfect match!`
        : `我理解您在寻找房产。让我帮您找到最佳选择。\n\n我可以按以下方式搜索：\n• 位置（城市、国家或地区）\n• 房产类型（别墅、公寓、土地、商业）\n• 价格范围\n• 卧室/浴室数量\n\n只需用自然语言描述您的需求，我会为您找到完美匹配！`,
      suggestions: ['Search by location', 'Search by type', 'Search by price'],
    };
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (suggestion === 'Show me these villas') {
      navigate('/listings?property_type=villa&country=tanzania');
    } else if (suggestion === 'Show me houses') {
      navigate('/listings?property_type=house');
    } else if (suggestion === 'Filter by price') {
      handleSend('properties between $100k and $300k');
    } else {
      handleSend(suggestion);
    }
    setOpen(false);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'ai-chatbot-btn',
          open && 'hidden'
        )}
        aria-label="Open AI Chat"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-booking-yellow rounded-full animate-pulse" />
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[32rem] max-h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-bounce-in border border-gray-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-booking-blue text-white">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">
                  {lang === 'en' ? 'AI Property Assistant' : 'AI房产助手'}
                </h3>
                <p className="text-xs text-white/80">
                  {lang === 'en' ? 'Powered by TzDalali AI' : '由 TzDalali AI 驱动'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex gap-2 animate-slide-up',
                  message.role === 'user' && 'flex-row-reverse'
                )}
              >
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                    message.role === 'assistant' ? 'bg-booking-blue text-white' : 'bg-gray-100 text-gray-600'
                  )}
                >
                  {message.role === 'assistant' ? (
                    <Bot className="h-4 w-4" />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                </div>
                <div
                  className={cn(
                    'max-w-[75%] rounded-2xl px-4 py-2.5 text-sm',
                    message.role === 'assistant'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-booking-blue text-white'
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  {message.suggestions && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {message.suggestions.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => handleSuggestionClick(s)}
                          className="text-xs px-2.5 py-1 bg-white border border-gray-200 rounded-full hover:border-booking-blue hover:text-booking-blue transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 animate-slide-up">
                <div className="w-8 h-8 rounded-full bg-booking-blue text-white flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-gray-100 rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            {/* Quick actions */}
            {messages.length === 1 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 font-medium">
                  {lang === 'en' ? 'Quick searches:' : '快速搜索：'}
                </p>
                <div className="flex flex-col gap-1.5">
                  {QUICK_ACTIONS.slice(0, 3).map((action, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(action.query)}
                      className="text-left text-sm px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <div className="flex gap-2">
              <Input
                placeholder={lang === 'en' ? 'Ask about properties...' : '询问房产...'}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 h-10"
              />
              <Button
                size="icon"
                className="h-10 w-10 bg-booking-blue hover:bg-booking-blue-light"
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-[10px] text-gray-400 text-center mt-2">
              {lang === 'en'
                ? 'AI may make mistakes. Verify information independently.'
                : 'AI可能会犯错，请独立验证信息。'}
            </p>
          </div>
        </div>
      )}
    </>
  );
}