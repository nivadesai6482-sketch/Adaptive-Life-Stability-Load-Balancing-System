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
    const { currentScores, healthData } = useStabilityStore();
    const { tasks } = useTaskStore();

    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'System Link Established. I am your ALS-LBS Assistant. I have successfully synchronized with your real-time stability telemetry.',
            sender: 'bot',
            timestamp: new Date()
        }
    ]);

    useEffect(() => {
        if (isOpen && messages.length === 1) {
            const lsi = calculateLSI(currentScores);
            const cognitiveLoad = tasks.reduce((acc, task) => {
                if (task.status === 'completed') return acc;
                const weights = { high: 25, medium: 15, low: 5 };
                return acc + (weights[task.priority] || 5);
            }, 0);

            const burnoutRisk = predictBurnoutRisk({
                lifeStabilityIndex: lsi,
                cognitiveLoad: cognitiveLoad,
                sleepHours: healthData?.sleepHours || 8,
                heartRate: healthData?.heartRate || 70
            });

            const diagnosticMsg: Message = {
                id: '2',
                text: `STATUS UPDATE:\n• Life Stability Index: ${lsi.toFixed(1)}\n• Burnout Risk: ${burnoutRisk}\n• Cognitive Load: ${cognitiveLoad}\n\nHow should we optimize your load balancing today?`,
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, diagnosticMsg]);
        }
    }, [isOpen, messages.length, currentScores, healthData, tasks]);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = () => {
        if (!input.trim()) return;

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

        setMessages(prev => [...prev, userMessage]);
        const currentInput = input;
        setInput('');

        // Process using Intelligent Backend (OpenAI)
        setTimeout(async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/chat`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        message: currentInput,
                        systemContext: {
                            lsi: lsiScore,
                            burnoutRisk,
                            energy: currentScores.Energy,
                            cognitiveLoad,
                            domains: currentScores
                        }
                    })
                });

                if (!response.ok) throw new Error('AI Link Failed');

                const data = await response.json();
                const botMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    text: data.response,
                    sender: 'bot',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, botMessage]);
            } catch (err) {
                // FALLBACK to local heuristics if AI fails or key is missing
                const fallbackResponse = getBotResponse(currentInput, {
                    lsi: lsiScore,
                    burnoutRisk,
                    energy: currentScores.Energy,
                    cognitiveLoad,
                    domains: currentScores
                });

                const botMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    text: fallbackResponse,
                    sender: 'bot',
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, botMessage]);
            }
        }, 500);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-80 sm:w-96 h-[500px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">

                    {/* Header */}
                    <div className="bg-indigo-600 p-4 flex items-center justify-between text-white shadow-lg">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-lg">
                                <Bot className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="font-black text-sm tracking-tight">System Assistant</p>
                                <div className="flex items-center gap-1.5">
                                    <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                                    <span className="text-[10px] font-bold text-indigo-100 uppercase tracking-widest">Neural Link Active</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <MinusCircle className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-500`}
                            >
                                <div className={`max-w-[80%] flex items-start gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`p-1.5 rounded-lg shrink-0 ${msg.sender === 'user' ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                                        {msg.sender === 'user' ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                                    </div>
                                    <div className={`p-3 rounded-2xl text-sm font-medium ${msg.sender === 'user'
                                        ? 'bg-indigo-600 text-white rounded-tr-none'
                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                        <div className="relative flex items-center gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask about your stability..."
                                className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white font-bold focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            />
                            <button
                                onClick={handleSend}
                                className="p-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-90"
                            >
                                <Send className="h-4 w-4" />
                            </button>
                        </div>
                        <p className="mt-2 text-[8px] text-center text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-1">
                            <Sparkles className="h-2 w-2" /> Powered by ALS-LLM v2.4
                        </p>
                    </div>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-4 rounded-2xl shadow-2xl transition-all duration-300 active:scale-90 flex items-center gap-2 group ${isOpen
                    ? 'bg-slate-800 text-white'
                    : 'bg-indigo-600 text-white hover:bg-indigo-500'
                    }`}
            >
                {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6 group-hover:scale-110 transition-transform" />}
                {!isOpen && <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-bold text-sm whitespace-nowrap">Assistant</span>}
            </button>
        </div>
    );
};
