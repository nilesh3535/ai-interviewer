import Image from "next/image";

const Page = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* <main className="flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-16 py-8"> */}
      <main className="flex-grow flex px-4 sm:px-6 lg:px-16 py-5">
        <Image
          src="/wuc.jpg" // replace with your logo path
          alt="WUC"
          width={200}
          height={100}
          className="object-contain bg-gray-50 rounded-sm"
        />
      </main>
    </div>
  );
};

export default Page;
