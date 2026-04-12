import { WebContainer } from "@webcontainer/api";

let webcontainerInstance: WebContainer | null = null;
let bootPromise: Promise<WebContainer> | null = null;

export async function getWebContainer() {
  if (webcontainerInstance) return webcontainerInstance;

  bootPromise = (async () => {
    const instance = await WebContainer.boot();
    webcontainerInstance = instance;
    return instance;
  })();

  return bootPromise;
}
