import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { redirect } from "next/navigation";

import { isAuthenticated } from "@/lib/actions/auth.action";

const AuthLayout = async ({ children }: { children: ReactNode }) => {
  const isUserAuthenticated = await isAuthenticated();
  if (isUserAuthenticated) redirect("/");

  return (
    <div className="auth-layout">
      {/* Top Left Logo */}
      <div className="sm:absolute top-5 left-6">
        <Link href="https://winyourinterview.ai/">
          <Image
            src="/wyi.png" // replace with your logo path
            alt="Company Logo"
            width={200}
            height={100}
            className="object-contain bg-gray-50 rounded-sm"
          />
        </Link>
      </div>

      {/* Centered Form */}
      <div className="flex flex-col items-center justify-center w-full">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
