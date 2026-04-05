'use client'
import { Button } from '@/components/ui/button'
import { CodeView } from '@/components/code-view';
import { WebContainer } from '@webcontainer/api';
import { initWebContainer } from '@/modules/webcontainers/container';
import { downloadZip } from '@/modules/webcontainers/build-zip';
import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic';
import PromptInput from '@/modules/home/components/prompt-input';
import { ArrowLeft, ArrowRight, Download, RotateCw } from 'lucide-react';

const XTerminal = dynamic(() => import("@/components/terminal"), {
  ssr: false,
});


const TestPage = () => {

    const initialFiles = {
  "package.json": {
    file: {
      contents: `{
  "name": "nextjs-webcontainer-template",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "next dev -H 0.0.0.0 -p 3000",
    "build": "next build",
    "start": "next start -H 0.0.0.0 -p 3000"
  },
  "dependencies": {
    "next": "^14.2.5",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.5",
    "lucide-react": "^0.469.0"
  },
  "devDependencies": {
    "@types/node": "^22.10.2",
    "@types/react": "^18.3.18",
    "@types/react-dom": "^18.3.5",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.7.2"
  }
}`
    }
  },

  "next.config.mjs": {
    file: {
      contents: `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true
};

export default nextConfig;
`
    }
  },

  "tsconfig.json": {
    file: {
      contents: `{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["DOM", "DOM.Iterable", "ES2020"],
    "strict": true,
    "noEmit": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}`
    }
  },

  "next-env.d.ts": {
    file: {
      contents: `/// <reference types="next" />
/// <reference types="next/image-types/global" />
`
    }
  },

  "postcss.config.cjs": {
    file: {
      contents: `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`
    }
  },

  "tailwind.config.ts": {
    file: {
      contents: `import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(240 5.9% 90%)",
        input: "hsl(240 5.9% 90%)",
        background: "hsl(0 0% 100%)",
        foreground: "hsl(240 10% 3.9%)"
      }
    }
  },
  plugins: []
};

export default config;
`
    }
  },

  "lib": {
    directory: {
      "utils.ts": {
        file: {
          contents: `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`
        }
      }
    }
  },

  "components": {
    directory: {
      "ui": {
        directory: {

          "button.tsx": {
            file: {
              contents: `import * as React from "react";
import { cn } from "@/lib/utils";

export function Button({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md bg-black text-white px-4 py-2 text-sm font-medium hover:opacity-90",
        className
      )}
      {...props}
    />
  );
}
`
            }
          },

          "card.tsx": {
            file: {
              contents: `import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-white text-black shadow p-6",
        className
      )}
      {...props}
    />
  );
}
`
            }
          },

          "input.tsx": {
            file: {
              contents: `import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex h-10 w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2",
        className
      )}
      {...props}
    />
  );
}
`
            }
          }

        }
      }
    }
  },

  "app": {
    directory: {

      "globals.css": {
        file: {
          contents: `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: Arial, Helvetica, sans-serif;
}
`
        }
      },

      "layout.tsx": {
        file: {
          contents: `import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <script dangerouslySetInnerHTML={{ __html: \`
          window.addEventListener('message', (e) => {
            if (e.data?.type === 'nav') {
              if (e.data.action === 'back') history.back();
              if (e.data.action === 'forward') history.forward();
              if (e.data.action === 'reload') location.reload();
            }
          });
        \` }} />
      </body>
    </html>
  );
}
`
        }
      },

      "page.tsx": {
        file: {
          contents:  `
export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
      
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold tracking-tight">
          Build Something Powerful
        </h1>

        <p className="mt-4 text-gray-400 text-lg">
          A simple AI-powered development environment. Start building, editing, and running code directly in your browser.
        </p>

        <div className="mt-8 flex items-center justify-center gap-4">
          <a
            href="/chat"
            className="px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition"
          >
            Start Chat
          </a>

          <a
            href="https://nextjs.org"
            target="_blank"
            className="px-6 py-3 border border-gray-700 rounded-xl hover:bg-gray-900 transition"
          >
            Learn More
          </a>
        </div>
      </div>

      <div className="absolute bottom-6 text-sm text-gray-500">
        Built with Next.js + AI SDK
      </div>
    </main>
  );
}
      `
        }
      }

    }
  }
    };

    const [webcontainer, setWebcontainer] = useState<WebContainer | null>(null);
    const [files, setFiles] = useState(initialFiles);
    const [devServerUrl, setDevServerUrl] = useState<string | null>(null);
    const [process, setProcess] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const bootWebContainer = async () => {
        const webcontainer = await initWebContainer();
        setWebcontainer(webcontainer);
        console.log("Webcontainer is ready");
    }

    const mountFiles = async () => {
        if (webcontainer) {
            await webcontainer.mount(files);
            console.log("Mounted files");
        }
    }

    const runDevServer = async () => {
        if (webcontainer) {
          const installProcess = await webcontainer.spawn('npm', ['install']);
          setProcess(installProcess);

          const installExitCode = await installProcess.exit;
          if (installExitCode !== 0) {   
              throw new Error('Unable to run npm install');
          }

          const bashProcess = await webcontainer.spawn("bash");
          setProcess(bashProcess);
            
          webcontainer.on('server-ready', (port, url) => {
              console.log("Server ready");
              setDevServerUrl(url);
          });
 
        }
    }

    useEffect(() => {
        if(!webcontainer) bootWebContainer();
    }, []);
    

    useEffect(() => {
        if (webcontainer) {
            mountFiles();
            runDevServer();
        }
    }, [webcontainer]);

    useEffect(() => {
        if (webcontainer) {
            mountFiles();
        }
    }, [files]);

    const handleFileChange = async (path: string, content: string) => {
        if (webcontainer) {
            try {
                const parts = path.split('/');
                let currentPath = '';
                for (let i = 0; i < parts.length - 1; i++) {
                    currentPath += (currentPath ? '/' : '') + parts[i];
                    try {
                        await webcontainer.fs.mkdir(currentPath, { recursive: true });
                    } catch (e) {
                        // ignore
                    }
                }
                await webcontainer.fs.writeFile('/' + path, content);
            } catch (error) {
                console.error("Failed to write file to WebContainer:", error);
            }
        }

        // Keep local React state sync'd so LLM sees correct changes on next request
        setFiles(prevFiles => {
            const newFiles = JSON.parse(JSON.stringify(prevFiles));
            const parts = path.split('/');
            let current = newFiles;
            for (let i = 0; i < parts.length - 1; i++) {
                if (!current[parts[i]]) {
                    current[parts[i]] = { directory: {} };
                }
                current = current[parts[i]].directory;
            }
            const fileName = parts[parts.length - 1];
            if (current[fileName] && current[fileName].file) {
                 current[fileName].file.contents = content;
            } else {
                 current[fileName] = { file: { contents: content } };
            }
            return newFiles;
        });
    };

    const handleClick = async (userPrompt:string) => {
        
        const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userPrompt, files }),
        });

        if (!response.ok) {
            console.error("API error:", response.status, await response.text());
            return;
        }

        const data = await response.text();
        try {
            const newFiles = JSON.parse(data);
            setFiles(newFiles);
        } catch (e) {
            console.error("Failed to parse AI response as JSON:", e, "\nRaw response:", data);
        }
    }


  return (
    <div className='flex flex-col items-center justify-center'>
        <div className='grid grid-cols-3 gap-2 p-10 justify-center h-[90vh] w-full'>
            <div className="grid grid-rows-2 w-full h-full border border-primary rounded-md overflow-hidden p-5">
                <XTerminal process={process} />
                
                <div className='flex flex-col items-center justify-center p-5'>
                    <PromptInput onSubmitMessage={handleClick} />
                </div>
                
            </div>
            

            <div className="flex flex-col col-span-2 w-full h-full border border-primary rounded-md overflow-hidden">
                <div className="flex items-center gap-2 p-2 border-b border-primary bg-accent">
                    <Button 
                        variant={activeTab === 'preview' ? 'primary' : 'outline'} 
                        size="sm" 
                        onClick={() => setActiveTab('preview')}
                    >
                        Preview
                    </Button>
                    <Button 
                        variant={activeTab === 'code' ? 'primary' : 'outline'} 
                        size="sm" 
                        onClick={() => setActiveTab('code')}
                    >
                        Code
                    </Button>
                    <div className="flex items-center gap-1 ml-auto">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => iframeRef.current?.contentWindow?.postMessage({ type: 'nav', action: 'back' }, '*')}
                            title="Back"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => iframeRef.current?.contentWindow?.postMessage({ type: 'nav', action: 'forward' }, '*')}
                            title="Forward"
                        >
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => { if (iframeRef.current) iframeRef.current.src = iframeRef.current.src; }}
                            title="Refresh"
                        >
                        <RotateCw className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => downloadZip(files)}
                        >
                            <Download className="w-4 h-4 mr-1" />
                            Download
                        </Button>
                    </div>
                </div>
                <div className="flex-1 min-h-0 relative">
                    <div className="absolute inset-0" style={{ display: activeTab === 'preview' ? 'block' : 'none' }}>
                        {devServerUrl && <iframe ref={iframeRef} src={devServerUrl} className='h-full w-full'/>}
                        {!devServerUrl && (
                            <div className="flex flex-col items-center justify-center h-full gap-4">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full border-2 border-muted-foreground/20 border-t-primary animate-spin" />
                                </div>
                                <div className="flex flex-col items-center gap-1.5">
                                    <p className="text-sm font-medium text-foreground animate-pulse">
                                        Starting dev server...
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Installing dependencies & booting up
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="absolute inset-0" style={{ display: activeTab === 'code' ? 'block' : 'none' }}>
                        <CodeView files={files} onFileChange={handleFileChange} />
                    </div>
                </div>
            </div>
        </div>
    
    </div>
  )
}

export default TestPage