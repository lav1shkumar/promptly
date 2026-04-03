"use client";

import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ProjectForm from "@/modules/home/components/project-form";
import { startDevServer, writeFile, runCommand } from "@/modules/webcontainers/container";
import { useChat } from "@ai-sdk/react";


export default function Page() {
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


  return (
    <div className="flex flex-col justify-center items-center w-full px-4 py-8">
      <div className="w-full max-w-5xl">
        <section className="space-y-8 flex flex-col items-center">
          <div className="flex flex-col items-center">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={100}
              height={100}
              className="dark:invert md:block hidden"
            />
          </div>
          <h1 className="text-4xl md:text-6xl text-center font-bold">
            Build something with❤️
          </h1>

          <p className="text-center text-muted-foreground text-lg md:text-xl">
            Create and deploy AI agents with ease
          </p>

          <div className="max-w-3xl w-full flex flex-col items-center gap-4">
            <ProjectForm />
            <Button 
              onClick={handleStartServer} 
              disabled={loading}
              className="w-full max-w-xs"
            >
              {loading ? "Starting dev server..." : "Start dev server"}
            </Button>
          </div>
        </section>
      </div>

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
              <Button onClick={() => writeFile("app/page.tsx", "export default function Home() { return <h1>Hello World</h1>; }")}>Write files</Button>
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
    </div>
  );
}
