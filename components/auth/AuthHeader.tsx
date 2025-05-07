import Image from "next/image";

interface AuthHeaderProps {
  title: string;
}

const AuthHeader = ({ title }: AuthHeaderProps) => {
  return (
    <>
      <div className="flex items-center justify-center">
    <div className="flex items-center gap-2">
          <Image src="/logo-3.png" alt="logo" width={84} height={39} />
          <span className="hidden sm:block text-primary-100 text-2xl sm:text-[38px] font-bold">
          Interviewer
          </span>
        </div>
              
      </div>
      <h3 className="text-center">{title}</h3>
    </>
  );
};

export default AuthHeader;