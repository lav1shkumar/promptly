import { UserButton } from "@clerk/nextjs";

export default function Page() {
  return  (  
  <div className="flex flex-col justify-center items-center h-screen">
        <h1 className="text-center text-3xl font-bold">Home</h1>
        <UserButton/>
    </div>  
  )
}
