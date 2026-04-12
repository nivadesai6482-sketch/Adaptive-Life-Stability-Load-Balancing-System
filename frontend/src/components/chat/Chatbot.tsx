import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Sparkles, MinusCircle } from 'lucide-react';
import { useStabilityStore } from '../../store/stabilityStore';
import { useTaskStore } from '../../store/taskStore';
import { calculateLSI } from '../../utils/stabilityCalculator';
import { predictBurnoutRisk } from '../../utils/burnoutPredictor';
import { getBotResponse } from '../../utils/chatbotLogic';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

export const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const { currentScores, healthData } = useStabilityStore();
    const { tasks } = useTaskStore();

    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: "Hey, I'm here. What's on your mind?",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);

    // Diagnostic effects removed for human-centric focus

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen, isTyping]);

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;

        // Calculate current system state for logic
        const lsiScore = calculateLSI(currentScores);
        const cognitiveLoad = tasks.reduce((acc, task) => {
            if (task.status === 'completed') return acc;
            const weights = { high: 25, medium: 15, low: 5 };
            return acc + (weights[task.priority] || 5);
        }, 0);

        const burnoutRisk = predictBurnoutRisk({
            lifeStabilityIndex: lsiScore,
            cognitiveLoad: cognitiveLoad,
            sleepHours: healthData?.sleepHours || 8,
            heartRate: healthData?.heartRate || 70
        });

        const userMessage: Message = {
            id: Date.now().toString(),
            text: input,
            sender: 'user',
            timestamp: new Date()
        };

        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        const currentInput = input;
        setInput('');
        setIsTyping(true);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://backend:5000/api'}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    message: currentInput,
                    history: newMessages.map(m => ({
                        role: m.sender === 'user' ? 'user' : 'assistant',
                        content: m.text
                    })),
                    systemContext: {
                        lsi: lsiScore,
                        burnoutRisk,
                        energy: currentScores.Energy,
                        cognitiveLoad,
                        domains: currentScores,
                        tasks: tasks.map(t => ({ title: t.title, priority: t.priority, status: t.status }))
                    }
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'AI Link Failed');
            }

            const data = await response.json();
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: data.reply,
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMessage]);
        } catch (err) {
            // Use a warm, human-centric fallback if the AI link is interrupted
            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: err instanceof Error ? err.message : "I'm so sorry, but I'm having a little trouble connecting to my thoughts right now. I'm still right here with you, though. Could we try again in a moment?",
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            {/* Floating Toggle Button (Visible only when chat is closed) */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 p-4 bg-indigo-600 text-white rounded-2xl shadow-2xl hover:bg-indigo-500 transition-all active:scale-95 group z-40"
                >
                    <MessageSquare className="h-6 w-6 group-hover:scale-110 transition-transform" />
                    <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl border border-slate-800">
                        Open AI Assistant
                    </span>
                </button>
            )}

            {/* ChatGPT Style Modal Interface */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="w-full max-w-4xl h-[85vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden relative border-t-indigo-500/30">

                        {/* Header */}
                        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">
                                    <Bot className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-100 tracking-tight text-lg">Hey, I'm here for you 💬</h3>
                                    <div className="flex items-center gap-2">
                                        <span className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Always here to listen</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto px-4 py-8 space-y-8 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                            <div className="max-w-3xl mx-auto space-y-8">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 fade-in duration-500`}
                                    >
                                        <div className={`flex gap-4 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-lg ${msg.sender === 'user'
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-slate-800 text-slate-400'
                                                }`}>
                                                {msg.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                                            </div>
                                            <div className={`flex flex-col gap-1.5 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                                <div className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed font-medium shadow-sm ${msg.sender === 'user'
                                                    ? 'bg-indigo-600 text-white rounded-tr-none'
                                                    : 'bg-slate-800/50 text-slate-200 border border-slate-700/50 rounded-tl-none'
                                                    }`}>
                                                    <div className="whitespace-pre-wrap">{msg.text}</div>
                                                </div>
                                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-1">
                                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {isTyping && (
                                    <div className="flex justify-start animate-in fade-in duration-300">
                                        <div className="flex gap-4 items-center">
                                            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                                                <Bot className="h-4 w-4 text-slate-400" />
                                            </div>
                                            <div className="flex gap-1 px-4 py-3 bg-slate-800/50 rounded-2xl border border-slate-700/50">
                                                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                                <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="p-6 bg-slate-900 border-t border-slate-800">
                            <div className="max-w-3xl mx-auto relative group">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Talk to me... what's on your mind?"
                                    className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl pl-5 pr-14 py-4 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-sm font-bold shadow-inner"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={isTyping || !input.trim()}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed group-hover:scale-105 active:scale-95"
                                >
                                    <Send className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="mt-4 flex items-center justify-center gap-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                <span className="flex items-center gap-1.5"><Sparkles className="h-3 w-3 text-indigo-500" /> A supportive space</span>
                                <span className="h-1 w-1 bg-slate-700 rounded-full"></span>
                                <span>Always on your side</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
