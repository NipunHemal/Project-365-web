import { useEffect, useRef, useState, FormEvent } from 'react';
import api from '@/api/api';
import { ChatMessage, ApiResponse } from '@/types';
import { HiOutlineSparkles, HiOutlinePaperAirplane, HiOutlineUser } from 'react-icons/hi2';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const Assistant = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const endRef = useRef<HTMLDivElement>(null);

    // Load suggested starter questions.
    useEffect(() => {
        api.get<ApiResponse<{ questions: string[] }>>('/ai/suggestions')
            .then((res) => setSuggestions(res.data.data?.questions || []))
            .catch(() => setSuggestions([]));
    }, []);

    // Keep the latest message in view.
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    const send = async (text: string) => {
        const question = text.trim();
        if (!question || isLoading) return;

        setError(null);
        const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: question }];
        setMessages(nextMessages);
        setInput('');
        setIsLoading(true);

        try {
            const res = await api.post<ApiResponse<{ reply: string }>>('/ai/chat', { messages: nextMessages });
            const reply = res.data.data?.reply || 'Sorry, I could not generate a reply.';
            setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
        } catch (err: unknown) {
            const e = err as { response?: { data?: { message?: string } } };
            setError(e.response?.data?.message || 'Failed to reach the assistant.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        send(input);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <HiOutlineSparkles className="h-6 w-6 text-indigo-600" />
                    Finance Assistant
                </h1>
                <p className="text-gray-500 mt-1">Ask about your budget, income, and spending</p>
            </div>

            <Card className="flex flex-col h-[70vh] p-0 overflow-hidden">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.length === 0 && (
                        <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
                            <HiOutlineSparkles className="h-10 w-10 mb-3 text-indigo-300" />
                            <p className="font-medium text-gray-500">Ask me anything about your finances</p>
                            <p className="text-sm mt-1">Your data stays private — I only see a summary of your own transactions.</p>
                        </div>
                    )}

                    {messages.map((m, i) => (
                        <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {m.role === 'assistant' && (
                                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                                    <HiOutlineSparkles className="h-5 w-5" />
                                </div>
                            )}
                            <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${m.role === 'user'
                                ? 'bg-indigo-600 text-white rounded-br-sm'
                                : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                                }`}>
                                {m.content}
                            </div>
                            {m.role === 'user' && (
                                <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center shrink-0">
                                    <HiOutlineUser className="h-5 w-5" />
                                </div>
                            )}
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex gap-3 justify-start">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                                <HiOutlineSparkles className="h-5 w-5" />
                            </div>
                            <div className="bg-gray-100 text-gray-500 rounded-2xl rounded-bl-sm px-4 py-3 text-sm">
                                Thinking…
                            </div>
                        </div>
                    )}

                    <div ref={endRef} />
                </div>

                {/* Suggestions (only before the first message) */}
                {messages.length === 0 && suggestions.length > 0 && (
                    <div className="px-6 pb-3 flex flex-wrap gap-2">
                        {suggestions.map((q) => (
                            <button
                                key={q}
                                onClick={() => send(q)}
                                className="text-sm px-3 py-1.5 rounded-full border border-indigo-200 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 transition-colors"
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                )}

                {error && (
                    <div className="mx-6 mb-2 p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl">{error}</div>
                )}

                {/* Input */}
                <form onSubmit={handleSubmit} className="border-t border-gray-100 p-4 flex gap-3">
                    <input
                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Ask about your budget…"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <Button type="submit" isLoading={isLoading} className="bg-indigo-600 hover:bg-indigo-700">
                        <HiOutlinePaperAirplane className="h-5 w-5" />
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default Assistant;
