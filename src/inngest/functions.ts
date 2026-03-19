import { inngest } from "./client";
import { gemini, createAgent } from "@inngest/agent-kit";


const model = gemini({ model: "gemini-3.1-flash-lite-preview" });

export const helloWorld = inngest.createFunction(
  { id: "hello-world", triggers: [{ event: "agent/hello" }] },

  async ({ event, step }) => {
    const helloAgent = createAgent({
      name:"hello-agent",
      description:"A simple agent that says hello",
      model,
      system:"You are a helpful assistant that greets with enthusiasm.",
    }); 

    const {output} = await helloAgent.run("Say hello to the user!");

    return {
      message: "content" in output[0] ? output[0].content : "",
    };
  },
);