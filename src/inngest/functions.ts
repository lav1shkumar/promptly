import { inngest } from "./client";
import { gemini, createAgent, createTool } from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter";
import z from "zod";


const model = gemini({ model: "gemini-3.1-flash-lite-preview" });

export const codeAgentFunction = inngest.createFunction(
  { id: "code-agent", triggers: [{ event: "code-agent/run" }] },

  async ({ event, step }) => {

    const sandboxId = await step.run("get-sandbox-id", async () => {
      const sandbox = await Sandbox.create("lavishxda/v0-clone");
      return sandbox.sandboxId;
    })

    const codeAgent = createAgent({
      name:"code-agent",
      description:"An agent that writes code",
      model,
      system:"You are a helpful assistant that writes code.",
      tools: [
        // terminal
        createTool({
          name: "terminal",
          description: "Run terminal commands",
          parameters: z.object({
            command: z.string(),
          }),
          handler: async ({command}, {step}) => {
            const sandbox = await Sandbox.connect(sandboxId);
            const result = await sandbox.commands.run(command);
            return result;
          }
        })

        // file system
        // read file
      ]
    }); 

    const {output} = await codeAgent.run("Write a simple html code for a website");

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await Sandbox.connect(sandboxId);
      const host = sandbox.getHost(3000);
      return `http://${host}`;
    })

    return {
      message: "content" in output[0] ? output[0].content : "",
    };
  },

);