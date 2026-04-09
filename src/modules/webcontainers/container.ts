import { WebContainer } from '@webcontainer/api';

let webcontainerInstance: WebContainer | undefined = undefined;
let bootPromise: Promise<WebContainer> | null = null;

const files = {
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
      <body>{children}</body>
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

export async function initWebContainer() {
  if (webcontainerInstance) return webcontainerInstance;
  if (!bootPromise) {
    bootPromise = WebContainer.boot().then((instance) => {
      webcontainerInstance = instance;
      return instance;
    });
  }
  return bootPromise;
}

export async function startDevServer(): Promise<string> {
  const webcontainerInstance = await initWebContainer();
  await webcontainerInstance.mount(files);

  console.log('Installing dependencies...');
  const installProcess = await webcontainerInstance.spawn('npm', ['install']);
  installProcess.output.pipeTo(new WritableStream({
    write(data) {
      console.log(data);
    }
  }));

  const installExitCode = await installProcess.exit;

  if (installExitCode !== 0) {
    throw new Error('npm install failed');
  }

  console.log('Starting dev server...');
  await webcontainerInstance.spawn('npm', ['run', 'dev']);

  return new Promise<string>((resolve) => {
    webcontainerInstance!.on('server-ready', (port, url) => {
      console.log('Server ready at:', url);
      resolve(url);
    });
  });
}

export async function readFile(path: string) {
  const webcontainerInstance = await initWebContainer();
  return await webcontainerInstance.fs.readFile(path, 'utf-8');
}

export async function writeFile(path: string, content: string) {
  const webcontainerInstance = await initWebContainer();
  
  const parts = path.split('/').filter(Boolean);
  if (parts.length > 1) {
    let currentPath = '';
    for (let i = 0; i < parts.length - 1; i++) {
        currentPath += (currentPath.endsWith('/') ? '' : '/') + parts[i];
        try {
            await webcontainerInstance.fs.mkdir(currentPath, { recursive: true });
        } catch (e) {
            // will do it later
        }
    }
  }

  await webcontainerInstance.fs.writeFile(path, content);
}

export async function writeFiles(files: { path: string, content: string }[]) {
  for (const file of files) {
    await writeFile(file.path, file.content);
  }
}

export async function listFiles(path: string) {
  const webcontainerInstance = await initWebContainer();
  const files = await webcontainerInstance.fs.readdir(path, { withFileTypes: true });
  return files.map(f => ({ name: f.name, isDirectory: f.isDirectory() }));
}

export async function runCommand(command: string) {
  const webcontainerInstance = await initWebContainer();
  const process = await webcontainerInstance.spawn('jsh', ['-c', command]);

  let stdout = '';
  process.output.pipeTo(new WritableStream({
    write(data) {
      console.log(data);
      stdout += data;
    }
  }));

  const exitCode = await process.exit;

  return {
    exitCode,
    stdout,
  };
}