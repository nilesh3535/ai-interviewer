// app/interview/page.tsx
import InterviewForm from "@/components/InterviewForm";
import { getCurrentUser } from "@/lib/actions/auth.action";


const Page = async () => {
  const user = await getCurrentUser();

  return <InterviewForm user={user} />;
};

export default Page;
