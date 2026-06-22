import React, { useState, useRef } from "react";
import { Sparkles, Paperclip, FileText, Mic, ArrowUp, Loader2, Bot, User, X } from "lucide-react";

interface AIAgentBlockProps {
  locale: "hy" | "ru" | "en" | "ar";
}

interface Message {
  role: "user" | "model";
  text: string;
}

export default function AIAgentBlock({ locale }: AIAgentBlockProps) {
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const getLocalizedContent = () => {
    switch (locale) {
      case "hy":
        return {
          title: "Բացահայտեք AI Ռեժիմը",
          subtitle: "Տվեք մանրամասն հարցեր լավագույն պատասխանների համար",
          placeholder: "Հարցրեք ցանկացած բան...",
          suggestions: [
            "Առաջարկեք պրեմիում փաթեթավորում թանկարժեք զարդերի համար",
            "Ո՞րն է տարբերությունը սոֆթ-թաչ և փայլատ լամինացիայի միջև",
            "Խորհուրդ տվեք տուփի չափսեր անհատականացված քափքեյքերի համար"
          ],
          aiName: "AI Գործակալ",
          errorMsg: "Սխալ տեղի ունեցավ: Խնդրում ենք կրկին փորձել:"
        };
      case "ru":
        return {
          title: "Встречайте AI Режим",
          subtitle: "Задавайте детальные вопросы для получения лучших ответов",
          placeholder: "Спросите о чём угодно...",
          suggestions: [
            "Посоветуй премиум упаковку для ювелирного бутика",
            "В чем разница между матовой и софт-тач ламинацией?",
            "Порекомендуй размеры коробки для набора капкейков"
          ],
          aiName: "AI Консультант",
          errorMsg: "Произошла ошибка. Пожалуйста, попробуйте еще раз."
        };
      default:
        return {
          title: "Meet AI Mode",
          subtitle: "Ask detailed questions for better responses",
          placeholder: "Ask anything...",
          suggestions: [
            "Suggest a premium packaging style for high-end boutique jewelry",
            "What is the difference between soft-touch and matte lamination?",
            "Can you recommend box sizes for customized cupcakes sets"
          ],
          aiName: "AI Consultant",
          errorMsg: "An error occurred. Please try again."
        };
    }
  };

  const content = getLocalizedContent();

  const handleSend = async (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    // Add user message to history
    const userMessage: Message = { role: "user", text: trimmed };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setQuery("");
    setIsLoading(true);

    // Scroll chat area
    setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

    try {
      const response = await fetch("/api/gemini/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: messages
        })
      });

      const data = await response.json();
      if (data.success && data.text) {
        setMessages((prev) => [...prev, { role: "model", text: data.text }]);
      } else {
        setMessages((prev) => [...prev, { role: "model", text: content.errorMsg }]);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { role: "model", text: content.errorMsg }]);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion);
  };

  const handleClearHistory = () => {
    setMessages([]);
  };

  return (
    <div className="w-full py-16 px-6 sm:px-10 lg:px-12 max-w-[1240px] mx-auto select-none font-sans" id="ai-agent-meet-block">
      {/* Visual Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[9px] tracking-[0.25em] uppercase font-mono font-black text-emerald-800 bg-[#F4F2EE] shadow-[3px_3px_6px_#D3CDBF,_-3px_-3px_6px_#FFFFFF] rounded-full mb-4.5">
          <Sparkles size={10} className="text-emerald-700 animate-pulse" />
          <span>Intelligent Assistant</span>
        </div>
        <h2 className="font-sans font-black text-4xl sm:text-5xl text-[#3D271B] tracking-tight leading-none uppercase">
          {content.title}
        </h2>
        <p className="text-xs sm:text-sm text-[#3D271B]/60 mt-4 max-w-lg mx-auto leading-relaxed">
          {content.subtitle}
        </p>
      </div>

      {/* Main Container - Frameless & Expansive for supreme readability */}
      <div className="max-w-5xl mx-auto p-2 sm:p-4">
        
        {/* Chat History Box (Displays only when there are messages) */}
        {messages.length > 0 && (
          <div className="bg-[#FAF9F6]/80 rounded-[32px] p-6 mb-8 shadow-[inset_4px_4px_8px_#D3CDBF,_inset_-4px_-4px_8px_#FFFFFF] border border-[#EBE8D5]/30 overflow-hidden animate-fade-in relative">
            <button
              onClick={handleClearHistory}
              className="absolute top-4 right-4 text-[10px] font-mono font-bold uppercase tracking-wider text-red-700 hover:text-red-900 transition-all flex items-center gap-1.5 cursor-pointer bg-[#F4F2EE] px-3.5 py-2 rounded-full shadow-[2px_2px_4px_#D3CDBF,_-2px_-2px_4px_#FFFFFF] hover:shadow-[inset_1px_1px_3px_#D3CDBF,_inset_-1px_-1px_3px_#FFFFFF] border-none"
            >
              <X size={11} className="stroke-[3]" />
              {locale === "hy" ? "Մաքրել" : locale === "ru" ? "Очистить" : "Clear"}
            </button>
            <div className="max-h-[380px] overflow-y-auto pr-2 space-y-5 scrollbar-thin">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-3.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role !== "user" && (
                    <div className="w-9 h-9 rounded-full bg-[#F4F2EE] text-[#3D271B] flex items-center justify-center shadow-[3px_3px_6px_#D3CDBF,_-3px_-3px_6px_#FFFFFF] shrink-0 border border-white/50">
                      <Bot size={16} className="text-[#3B52E8]" />
                    </div>
                  )}
                  <div
                    className={`max-w-[88%] rounded-[24px] px-5 py-3.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[#3D271B] text-white rounded-br-none shadow-[4px_4px_10px_rgba(61,39,27,0.25)]"
                        : "bg-[#F4F2EE] text-[#3D271B] border border-white/40 rounded-bl-none shadow-[3px_3px_7px_#D3CDBF,_-3px_-3px_7px_#FFFFFF] markdown-body"
                    }`}
                  >
                    <p className="whitespace-pre-line font-medium leading-[1.6]">{msg.text}</p>
                  </div>
                  {msg.role === "user" && (
                    <div className="w-9 h-9 rounded-full bg-[#F4F2EE] text-[#3D271B] flex items-center justify-center font-bold text-xs shadow-[3px_3px_6px_#D3CDBF,_-3px_-3px_6px_#FFFFFF] shrink-0 uppercase border border-white/50">
                      <User size={15} className="text-emerald-800" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start items-center">
                  <div className="w-9 h-9 rounded-full bg-[#F4F2EE] text-[#3D271B] flex items-center justify-center shadow-[3px_3px_6px_#D3CDBF,_-3px_-3px_6px_#FFFFFF] shrink-0 border border-white/50 animate-pulse">
                    <Bot size={16} className="text-[#3B52E8]" />
                  </div>
                  <div className="bg-[#F4F2EE] border border-white/40 rounded-[24px] rounded-bl-none px-5 py-3.5 shadow-[3px_3px_7px_#D3CDBF,_-3px_-3px_7px_#FFFFFF] flex items-center gap-2">
                    <Loader2 size={16} className="text-[#3B52E8] animate-spin" />
                    <span className="text-xs font-mono font-bold tracking-wider text-[#3D271B]/60 uppercase">
                      {locale === "hy" ? "Մտածում է..." : locale === "ru" ? "Думает..." : "Thinking..."}
                    </span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </div>
        )}

        {/* Input Bar Container with Soft Neumorphic Inset Groove */}
        <div className="relative rounded-[26px] bg-[#F4F2EE] p-5 shadow-[inset_6px_6px_12px_#D2CBBF,_inset_-6px_-6px_12px_#FFFFFF] border border-[#FAF9F6]/10 mb-8">
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Left Icons helpers (Styled as outset soft buttons) */}
            <div className="flex items-center gap-3 shrink-0">
              <button 
                type="button" 
                className="w-10 h-10 bg-[#F4F2EE] text-[#8C8476] hover:text-[#3D271B] rounded-full flex items-center justify-center shadow-[3px_3px_6px_#D3CDBF,_-3px_-3px_6px_#FFFFFF] hover:shadow-[inset_2px_2px_4px_#D3CDBF,_inset_-2px_-2px_4px_#FFFFFF] transition-all duration-200 cursor-pointer border border-white/40"
                title="Add Notes"
              >
                <FileText size={17} className="stroke-[2.2]" />
              </button>
              <button 
                type="button" 
                className="w-10 h-10 bg-[#F4F2EE] text-[#8C8476] hover:text-[#3D271B] rounded-full flex items-center justify-center shadow-[3px_3px_6px_#D3CDBF,_-3px_-3px_6px_#FFFFFF] hover:shadow-[inset_2px_2px_4px_#D3CDBF,_inset_-2px_-2px_4px_#FFFFFF] transition-all duration-200 cursor-pointer border border-white/40"
                title="Add Attachment"
              >
                <Paperclip size={17} className="stroke-[2.2]" />
              </button>
            </div>

            {/* Main Text Input Area */}
            <input
              type="text"
              className="flex-1 w-full bg-[#FAF9F6]/20 py-2.5 px-1 outline-none border-none text-sm sm:text-base font-extrabold font-sans text-[#3D271B] placeholder-[#8C8476]/70"
              placeholder={content.placeholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend(query);
              }}
              disabled={isLoading}
            />

            {/* Right Icons: Microphone and Neumorphic Send button */}
            <div className="flex items-center gap-3 shrink-0">
              <button 
                type="button" 
                className="w-10 h-10 bg-[#F4F2EE] text-[#8C8476] hover:text-[#3D271B] rounded-full flex items-center justify-center shadow-[3px_3px_6px_#D3CDBF,_-3px_-3px_6px_#FFFFFF] hover:shadow-[inset_2px_2px_4px_#D3CDBF,_inset_-2px_-2px_4px_#FFFFFF] transition-all duration-200 cursor-pointer border border-white/40"
                title="Voice Dictation"
              >
                <Mic size={17} className="stroke-[2.2]" />
              </button>
              
              <button
                type="button"
                onClick={() => handleSend(query)}
                disabled={isLoading || !query.trim()}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border border-white/40 ${
                  query.trim() && !isLoading
                    ? "bg-[#1A3F25] text-white shadow-[4px_4px_8px_#D3CDBF,_-4px_-4px_8px_#FFFFFF] hover:shadow-[inset_3px_3px_5px_rgba(0,0,0,0.3)] cursor-pointer hover:scale-[1.03]"
                    : "bg-[#F4F2EE] text-[#8C8476] cursor-not-allowed opacity-50 shadow-[2px_2px_4px_rgba(180,175,166,0.3)]"
                }`}
              >
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin text-white" />
                ) : (
                  <ArrowUp size={16} className="stroke-[3]" />
                )}
              </button>
            </div>

          </div>
        </div>

        {/* Suggestion tags beneath input styled as magnificent soft Neumorphic buttons */}
        <div className="mt-6 space-y-4">
          {content.suggestions.map((suggestion, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full flex items-center gap-3.5 px-6 py-4 rounded-[22px] text-left bg-[#F4F2EE] text-[#3D271B]/80 hover:text-[#1A3F25] shadow-[6px_6px_12px_#D3CDBF,_-6px_-6px_12px_#FFFFFF] hover:shadow-[inset_3px_3px_6px_#D3CDBF,_inset_-3px_-3px_6px_#FFFFFF] border border-white/30 font-extrabold text-xs sm:text-sm tracking-wide transition-all duration-300 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-full bg-[#FAF9F6]/60 group-hover:bg-[#FAF9F6]/20 flex items-center justify-center transition-colors shadow-[2px_2px_4px_#D3CDBF,_-2px_-2px_4px_#FFFFFF] group-hover:shadow-[inset_1px_1px_2px_#D3CDBF]">
                <Sparkles size={11} className="text-[#8C8476] group-hover:text-[#1A3F25] transition-colors stroke-[2.5]" />
              </div>
              <span className="flex-1 truncate">{suggestion}</span>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
