import { Sandbox } from "@e2b/code-interpreter";
import dotenv from "dotenv";
dotenv.config();

async function checkSandbox() {
  try {
    
    const sandbox = await Sandbox.create("lavishxda/v0-clone");

    const host = sandbox.getHost(3000);
    console.log(`https://${host}`);

    // console.log("Checking processes...");
    // const ps = await sandbox.commands.run("ps aux");
    // console.log(ps.stdout);

    // console.log("Checking for npm logs...");
    // const npmLogs = await sandbox.commands.run("ls -la /home/user/.npm/_logs/ || echo no logs");
    // console.log(npmLogs.stdout);

    // console.log("Checking nextjs logs / output...");
    // // The main process started by CMD ["npm", "run", "dev"] might have its outputs captured somewhere?
    // // Let's also check if we can start it manually to see the error.
    // const testDev = await sandbox.commands.run("npm run dev", { cwd: "/home/user/app", background: true });
    
    // // let's read the background process output
    // await new Promise(resolve => setTimeout(resolve, 3000));
    
    // console.log("Trying next dev manually...");
    // const nextDev = await sandbox.commands.run("npx next dev", { cwd: "/home/user/app", timeoutMs: 5000 });
    // console.log(nextDev.stdout);
    // console.log(nextDev.stderr);
    
  } catch(e) {
    console.error(e);
  }
}

checkSandbox();
