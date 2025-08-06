import { ReactNode } from 'react'
import { redirect } from "next/navigation";

import { isAuthenticated, getCurrentUser } from "@/lib/actions/auth.action";
import SignOutButton from '@/components/SignOutButton';
import Logo from '@/components/Logo';
import AvatarPicker from '@/components/avatar/AvatarPicker';
import UserMenu from "@/components/UserMenu";
import UserMenuDropdown from '@/components/UserMenuDropdown';
import CreditsButton from '@/components/CreditsButton';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';
const RootLayout = async ({children }: {children: ReactNode}) => {
    const isUserAuthenticated = await isAuthenticated();
    if (!isUserAuthenticated) redirect("/sign-in");
  
  // Get current user data
  const user = await getCurrentUser();

  // Default avatar path if user doesn't have one set
  const userAvatar = user?.photoURL || "/user-avatar.jpg";

//       <div className="navbar flex mx-auto justify-between max-w-7xl py-2 px-16 " role="navigation" aria-label="Main navigation">
//         <div className="">
//          {/* nextjs image */}
//          <a href="https://winyourinterview.ai/" className="">
//         <Image
//                     src="/wyi.png" // replace with your logo path
//                     alt="Company Logo"
//                     width={200}
//                     height={100}
//                     className="object-contain bg-gray-50 rounded-sm"
//                   />
//         </a>
//         </div>
//         <div className="flex-none gap-4 flex items-center">
//           <div className="flex gap-4">
         
         
//  <Link href="/jobs/resume-checker" className="hidden sm:btn btn-ghost">
//             <p>ATS Resume Checker</p>
//           </Link>
//        <Link href="/jobs" className="hidden sm:btn btn-ghost">
//             <p>Find Jobs</p>
//           </Link>     
        
           
          
          
       
//           </div>

//         </div>
//       </div>
  return (<>
   
    <div className="root-layout">
      {/*  */}
   
      {/*  */}
      <nav className='w-full flex items-center justify-between '>
        {/* <Logo link /> */}
        <a href="https://winyourinterview.ai/" className="">
        <Image
                    src="/wyi.png" // replace with your logo path
                    alt="Company Logo"
                    width={200}
                    height={100}
                    className="object-contain bg-gray-50 rounded-sm shadow-lg shadow-gray-700"
                  />
        </a>
        {/*  */}
        <div className="bg-[#171532] flex-none gap-4 flex items-center rounded-sm px-2" style={{height:50}}>
         
         
          <a href="https://app.winyourinterview.ai/jobs/resume-checker" target='_blank' className="hidden sm:btn btn-ghost ">
            <p>ATS Resume Checker</p>
          </a>
          <p className='text-gray-50'>|</p>
          <a href="https://app.winyourinterview.ai/jobs/resume-builder" target='_blank' className="hidden sm:btn btn-ghost ">
            <p>ATS Resume Builder</p>
          </a>
          <p className='text-gray-50'>|</p>
       <a href="https://app.winyourinterview.ai/jobs" target='_blank' className="hidden sm:btn btn-ghost">
            <p>Find Jobs</p>
          </a>     
     
          </div>
        {/* User profile section */}
        <div className='flex flex-col items-center rounded-2xl border border-gray-200 pl-10 p-3 bg-[#272727]'>
        {user && (
          <div className="flex items-center gap-3">
            <div className='flex flex-col items-end'>
            <span className="text-light-100 text-lg  font-medium">{user.name}</span>
            <CreditsButton packs={user?.packs||0} />
            </div>
            {/* <UserMenu user={user} /> */}
            <UserMenuDropdown user={user} /> 
            
          </div>
        )}
        <div className=''>
          
        
         <div></div>
        </div>
        </div>
      </nav>

      {children}
    </div>
    </>
  )
}

export default RootLayout