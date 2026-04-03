import { useEffect, useRef } from 'react';
import { initWebContainer } from '@/modules/webcontainers/container';

export function ToolHandler({ part }: { part: any }) {
  const executedRef = useRef(false);

  useEffect(() => {
  if (executedRef.current) return;
  executedRef.current = true;

  async function run() {
    const wc = await initWebContainer();

    if (part.toolName === 'createOrUpdateFiles') {
      for (const file of part.args.files) {
        await wc.fs.writeFile(file.path, file.content);
      }
    }

    if (part.toolName === 'terminal') {
      const proc = await wc.spawn('sh', ['-c', part.args.command]);

      await proc.output.pipeTo(
        new WritableStream({
          write(data) {
            console.log(new TextDecoder().decode(data as any));
          },
        })
      );
    }
  }

  run();
}, [part]);

  return null;
}