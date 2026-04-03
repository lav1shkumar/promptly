'use client';

import { Button } from '@/components/ui/button';
import { startDevServer, runCommand, writeFile, readFile, listFiles } from '@/modules/webcontainers/container';
import { useChat } from '@ai-sdk/react';
import { useState, useEffect } from 'react';

export default function Chat() {
  const [localInput, setLocalInput] = useState('');
  
  const chat = useChat({
    onToolCall: async ({ toolCall }) => {
      const { toolName, toolCallId } = toolCall as any;
      const args = (toolCall as any).args || (toolCall as any).input || (toolCall as any).arguments || {};
      
      try {
        if (toolName === 'createOrUpdateFiles' || toolName === 'createOrUpdateFile') {
          // Backward compatibility for both names
          const files = args.files || [{ path: args.path, content: args.content }];
          for (const file of files) {
            await writeFile(file.path, file.content);
          }
          if ((chat as any).addToolResult) (chat as any).addToolResult({ toolCallId, tool: toolName, output: { success: true } });
        }
        
        else if (toolName === 'terminal') {
          const output = await runCommand(args.command);
          if ((chat as any).addToolResult) (chat as any).addToolResult({ toolCallId, tool: toolName, output: { success: true, ...output } });
        }
        
        else if (toolName === 'readFile') {
          const content = await readFile(args.file);
          if ((chat as any).addToolResult) (chat as any).addToolResult({ toolCallId, tool: toolName, output: { success: true, content } });
        }
        
        else if (toolName === 'listFiles') {
          const entries = await listFiles(args.path);
          if ((chat as any).addToolResult) (chat as any).addToolResult({ toolCallId, tool: toolName, output: { success: true, entries } });
        }
      } catch (err: any) {
        if ((chat as any).addToolResult) (chat as any).addToolResult({ toolCallId, tool: toolName, errorText: err.message || String(err), state: 'output-error' } as any);
      }
    }
  });

  const { messages } = chat;
  const reload = (chat as any).reload;
  const append = (chat as any).append;
  const sendMessage = (chat as any).sendMessage || ((msg: any) => append({ role: 'user', content: msg.text || msg.content }));

  // Auto-Loop Handler: Listens for when all tools are fully resolved, and resubmits to proceed seamlessly.
  useEffect(() => {
    const lastMsg = (messages as any[])[messages.length - 1];
    if (lastMsg && lastMsg.role === 'assistant' && lastMsg.parts) {
      const toolParts = lastMsg.parts.filter((p: any) => p.type && p.type.startsWith('tool-'));
      if (toolParts.length > 0) {
        const allComplete = toolParts.every(
          (t: any) => t.state === 'output-available' || t.state === 'output-error'
        );
        if (allComplete) {
          const timer = setTimeout(() => {
            if (reload) reload();
          }, 300);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [messages, reload]);

  const [url, setUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleStartServer = async () => {
        setLoading(true);
        try {
        const serverUrl = await startDevServer();
        setUrl(serverUrl);
        } catch (error) {
        console.error("Failed to start dev server:", error);
        } finally {
        setLoading(false);
        }
    };

  //console.log(messages);

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
        <Button onClick={handleStartServer}>Start dev server</Button>

        {(loading || url) && (
        <div className="w-full max-w-5xl mt-12 border rounded-xl overflow-hidden shadow-lg h-[600px] bg-background flex flex-col">
          <div className="bg-muted p-3 border-b flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5 px-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <span className="text-sm font-mono text-muted-foreground ml-3 truncate max-w-[300px] md:max-w-md select-all">
                {url || "Starting server..."}
              </span>
            </div>
            {loading && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground animate-pulse">
                <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
                Preparing environment...
              </div>
            )}
          </div>
            <div>
              <Button onClick={() => runCommand('echo "export default function Home() { return <h1>Hello World</h1>; }" > app/page.tsx')}>Run Command</Button>
            </div>

          <div className="relative flex-1 bg-white">
            {loading && !url && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm z-10 text-center p-6">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <h3 className="text-lg font-semibold">Booting WebContainer</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  This may take a minute to install dependencies...
                </p>
              </div>
            )}
            {url && (
              <iframe
                src={url}
                className="w-full h-full border-none"
                allow="cross-origin-isolated"
              />
            )}
          </div>
        </div>
        
      )}
      {messages.map(message => (
        <div key={message.id} className="whitespace-pre-wrap">
          {message.role === 'user' ? 'User: ' : 'AI: '}
          {message.parts.map((part, i) => {
            switch (part.type) {
              case 'text':
                return <div key={`${message.id}-${i}`}>{part.text}</div>;
              // We hide the terminal JSON dumps because they clutter the screen.
              // We only show a small badge indicating action is happening.
              case 'tool-terminal':
              case 'tool-createOrUpdateFile':
              case 'tool-createOrUpdateFiles':
              case 'tool-readFile':
              case 'tool-listFiles':
                return (
                  <div key={`${message.id}-${i}`} className="text-xs text-muted-foreground my-1 italic opacity-60">
                    Executing logic...
                  </div>
                );
            }
          })}
        </div>
      ))}

      <form
        onSubmit={e => {
          e.preventDefault();
          sendMessage({ text: localInput });
          setLocalInput('');
        }}
      >
        <input
          className="fixed dark:bg-zinc-900 bottom-0 w-full max-w-md p-2 mb-8 border border-zinc-300 dark:border-zinc-800 rounded shadow-xl"
          value={localInput}
          placeholder="Say something..."
          onChange={e => setLocalInput(e.currentTarget.value)}
        />
      </form>
    </div>
  );
}