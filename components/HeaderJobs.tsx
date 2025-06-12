import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { toast } from 'sonner'

export default function HeaderJobs() {
  return (
      <nav className="navbar px-4 sm:px-20" role="navigation" aria-label="Main navigation">
        <div className="flex-1 flex items-center">
         {/* nextjs image */}
         <Link href="/jobs" className="btn btn-ghost">
         <Image src="/jb.png" alt="AI Avatar" width={110} height={110} className="object-cover" />
        </Link>
        </div>
        <div className="flex-none gap-4 flex items-center">
          <div className="hidden sm:flex gap-4">
             
           <Link href="/" className="btn btn-ghost">
            <p>AI Mock Interview</p>
          </Link>

          <button className="btn btn-ghost" onClick={()=>{
            toast.info("AI Resume Builder is under development. Please check back later!", {
             duration: 2000,
              position: "top-center",
            }
            )
          }}>
            <p >AI Resume Builder</p>
          </button>
          </div>

        </div>
      </nav>
  )
}
