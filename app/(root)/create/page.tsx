// app/interview/page.tsx
import InterviewForm from "@/components/InterviewForm";
import { getAllRoles, getAllSkills, getCurrentUser } from "@/lib/actions/auth.action";

const Page = async () => {
  const user = await getCurrentUser();
  const roles=await getAllRoles();
  const skills=await getAllSkills();
  // console.log(skills)
  return <InterviewForm user={user} roles={roles} skills={skills} />;
};

export default Page;
