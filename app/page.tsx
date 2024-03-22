import { ArrowRight} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
export default function Home() {
  return (
    <main >
      <div className="flex flex-col lg:flex-row items-center bg-[#1E1919] dark:bg-slate-800">
        <div className="p-10 flex flex-col bg-[#2B2929] dark:bg-slate-800 text-white space-y-7 lg:w-[56%] ">
          <h1 className="text-4xl font-bold">
            Welcome to Dropbox. <br/>
            <br/>
            Storing everything for you and your business needs. All in one place
         </h1>

         <p className="pb-20">
          Enhance your personal storage with Dropbox, offering a simple and 
          efficient way to upload, organize and access files from anywhere. 
          Securely store important documents and media, and experience the 
          convenience of easy file management and sharing in one centralized
          Solution 
         </p>

          <Link href="/dashboard" className="flex cursor-pointer bg-blue-500 p-5 w-fit">
            Try it for free!
            <ArrowRight className="ml-10"/>
          </Link>
        </div>

        <div className=" bg-[#1E1919] dark:bg-slate-800 h-full lg:w-[44%] p-10 ">
            
          <Image className="rounded-md w-fit h-full " src="/images/drop.webp" alt="drop" width={1000} height={1000}/>
        </div>
      </div>
      {/* <p className=' text-center font-bold text-xl pt-5'> Powered by Next.js, Tailwind, Prisma</p> */}
    </main>
  );
}
