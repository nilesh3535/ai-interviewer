import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

interface LogoProps {
  link?: boolean;
  className?: string;
}

export const Logo = ({ link = false, className }: LogoProps) => {
  const content = (
    <div className={clsx("flex items-center gap-2", className)}>
      <Image src="/logo-4.png" alt="logo" width={84} height={39} />
      <span className="hidden sm:block text-primary-100 text-2xl sm:text-[38px] font-bold">
      Interviewer
      </span>
    </div>
  );

  return link ? <Link href="/">{content}</Link> : content;
};

export default Logo