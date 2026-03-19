"use server"

import { inngest } from "@/inngest/client";

export const invokeAgent = async () => {
    await inngest.send({name:"agent/hello",data:{}});
}