import { useEffect, useRef, useState } from "react";
import { User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

const ChatWindow = ({ projectId, refreshTrigger }: { projectId: string, refreshTrigger?: number }) => {
    const [messages, setMessages] = useState<any[]>([]);
    const scrollRef = useRef<HTMLDivElement>(null);

    const getMessages = async () => {
        try {
            const response = await fetch("/api/messages/getmessages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ projectId }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch messages");
            }

            const data = await response.json();
            setMessages(data.messages || []);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getMessages();
    }, [projectId, refreshTrigger]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div className="flex flex-col h-full">
            <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth scrollbar-thin scrollbar-thumb-muted-foreground/20"
            >
                {messages.length === 0 ? (
                    <div className="shrink-0 h-full flex flex-col items-center justify-center text-muted-foreground opacity-50 space-y-2">
                        <Bot className="w-8 h-8" />
                        <p className="text-sm font-medium">No messages yet. Start a conversation!</p>
                    </div>
                ) : (
                    messages.map((message: any, index: number) => (
                        <div
                            key={index}
                            className={cn(
                                "flex items-start gap-3 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2",
                                message.role === "USER" ? "flex-row-reverse" : "flex-row"
                            )}
                        >
                            <div className={cn(
                                "shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
                                message.role === "USER" ? "bg-primary text-primary-foreground" : "bg-muted border border-border"
                            )}>
                                {message.role === "USER" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                            </div>
                            <div
                                className={cn(
                                    "max-w-[80%] rounded-2xl px-4 py-2.5 shadow-sm text-sm leading-relaxed",
                                    message.role === "USER" 
                                        ? "bg-primary text-primary-foreground rounded-tr-none" 
                                        : "bg-muted/80 text-foreground border border-border rounded-tl-none"
                                )}
                            >
                                {message.content}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ChatWindow;