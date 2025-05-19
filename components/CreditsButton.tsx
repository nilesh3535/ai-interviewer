'use client';


import { useRouter } from 'next/navigation';

export default function CreditsButton({ packs = 0 }: { packs: number }) {
  const router = useRouter();

  return (
    <div
      
      className="mt-[-5] text-[#fdcc03] flex flex-row text-md bg-transparent transition rounded"
    >
      Interviews Remaining: <p className="badge-text ml-2 text-[#fdcc03] text-md">
        {packs.toString()=="" ? "0":packs}
      </p>
     <p className='mx-2'>|</p> 
     <button
      onClick={() => router.push('/packs')}
      className="text-white flex flex-row text-md bg-transparent transition cursor-pointer hover:text-green-400"
     >
      <u>Buy More</u>
      </button> 
    </div>
  );
}
