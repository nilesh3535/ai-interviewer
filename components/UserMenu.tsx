// components/UserMenu.tsx
"use client";

import { Menu } from "@headlessui/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { signOut } from "@/lib/actions/auth.action";

export default function UserMenu({ user }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
  
    const handleRedirect = (path: string) => {
      router.push(path);
    };
  
    const handleSignOut = async () => {
      try {
        setIsLoading(true);
        await signOut();
        toast.success("Signed out successfully");
        router.push("/sign-in");
      } catch (error) {
        console.error("Error signing out:", error);
        toast.error("Failed to sign out");
      } finally {
        // setIsLoading(false);
      }
    };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className="p-1 rounded-full border-1 border-white hover:ring-2 ring-white transition duration-200">
    <Image
        src={user.photoURL || "/user-avatar.jpg"}
        alt="avatar"
        width={36}
        height={36}
        className="rounded-full"
    />
    </Menu.Button>

    <Menu.Items className="absolute right-0 mt-2 w-48 max-h-60 overflow-auto bg-white dark:bg-gray-800 rounded-md shadow-lg ring-1 ring-black/5 focus:outline-none z-50">
        <Menu.Item>
          {({ active }) => (
            <button
              onClick={() => handleRedirect("/profile")}
              className={`${
                active ? "bg-gray-100 dark:bg-gray-700" : ""
              } group flex w-full items-center px-4 py-2 text-sm text-left text-gray-900 dark:text-white`}
            >
              Edit Profile
            </button>
          )}
        </Menu.Item>

        <Menu.Item>
          {({ active }) => (
            <button
              onClick={() => handleRedirect("/credits")}
              className={`${
                active ? "bg-gray-100 dark:bg-gray-700" : ""
              } group flex w-full items-center px-4 py-2 text-sm text-left text-gray-900 dark:text-white`}
            >
              Credits
            </button>
          )}
        </Menu.Item>

        <Menu.Item>
          {({ active }) => (
            <button
              onClick={() => handleRedirect("/transactions")}
              className={`${
                active ? "bg-gray-100 dark:bg-gray-700" : ""
              } group flex w-full items-center px-4 py-2 text-sm text-left text-gray-900 dark:text-white`}
            >
              Transactions
            </button>
          )}
        </Menu.Item>

        <Menu.Item>
          {({ active }) => (
            <button
              onClick={handleSignOut}
              disabled={isLoading}
              className={`${
                active ? "bg-red-100 dark:bg-red-800" : ""
              } group flex w-full items-center px-4 py-2 text-sm text-left text-red-600 dark:text-red-400`}
            >
              {isLoading ? "Signing out..." : "Sign Out"}
            </button>
          )}
        </Menu.Item>
      </Menu.Items>
    </Menu>
  );
}
