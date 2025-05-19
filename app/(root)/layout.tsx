import { ReactNode } from 'react'
import { redirect } from "next/navigation";

import { isAuthenticated, getCurrentUser } from "@/lib/actions/auth.action";
import SignOutButton from '@/components/SignOutButton';
import Logo from '@/components/Logo';
import AvatarPicker from '@/components/avatar/AvatarPicker';
import UserMenu from "@/components/UserMenu";
import UserMenuDropdown from '@/components/UserMenuDropdown';
import CreditsButton from '@/components/CreditsButton';
const RootLayout = async ({children }: {children: ReactNode}) => {
  const isUserAuthenticated = await isAuthenticated();
  if (!isUserAuthenticated) redirect("/sign-in");
  
  // Get current user data
  const user = await getCurrentUser();

  // Default avatar path if user doesn't have one set
  const userAvatar = user?.photoURL || "/user-avatar.jpg";

  return (
    <div className="root-layout">
      <nav className='w-full flex justify-between '>
        <Logo link />
        
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
  )
}

export default RootLayout