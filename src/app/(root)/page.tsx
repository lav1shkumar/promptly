import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import ProjectForm from "@/modules/home/components/project-form";

export default function Page() {

  return  (  
  <div className="flex justify-center items-center w-full px-4 py-8">
    <div className="w-full max-w-5xl">
      <section className="space-y-8 flex flex-col items-center">
        <div className="flex flex-col items-center">
          <Image src="/logo.svg" alt="Logo" width={100} height={100} className="dark:invert md:block hidden"/>
        </div>
        <h1 className="text-4xl md:text-6xl text-center font-bold">Build something with❤️</h1>

        <p className="text-center text-muted-foreground text-lg md:text-xl">Create and deploy AI agents with ease</p>

        <div className="max-w-3xl w-full">
          <ProjectForm/>
        </div>
      </section>
    </div>        
  </div>  
  )
}
