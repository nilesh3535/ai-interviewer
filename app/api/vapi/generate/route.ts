import { generateText } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

export async function POST(request: Request) {
  const { type, role, level, techstack, amount, userid } = await request.json();
//  prompt: `Prepare questions for a job interview.
//         The job role is ${role}.
//         The job experience level is ${level}.
//         The tech stack used in the job is: ${techstack}.
//         The focus between behavioural and technical questions should lean towards: ${type}.
//         The amount of questions required is: ${amount}.
//         Please return only the questions, without any additional text.
//         The questions are going to be read by a voice assistant so do not use "/" or "*" or any other special characters which might break the voice assistant.
//         Return the questions formatted like this:
//         ["Question 1", "Question 2", "Question 3"]
        
//         Thank you!
  try {
   const { text: questions } = await generateText({
  model: google("gemini-2.0-flash-001"),
  prompt: `You are an expert technical interviewer.

Generate a list of job interview questions tailored to the following role:
- Role: ${role}
- Experience Level: ${level}
- Tech Stack: ${techstack}
- Focus: ${type} (e.g. mostly technical or mostly behavioral)
- Number of Questions: ${amount}

Requirements:
- If the focus is technical, include scenario-based and practical questions specifically involving the listed tech stack.
- If the focus is behavioral, ask questions around decision-making, teamwork, problem-solving, leadership, etc., tailored to the job level.
- Ensure the questions match the expected seniority level (e.g., don't ask basic syntax to senior developers).
- Use only standard characters (no slashes, asterisks, quotes, or symbols that may break a voice assistant).
- Output **only** an array of questions in this exact format:
["Question 1", "Question 2", ..., "Question ${amount}"]
- Do not include explanations, greetings, or formatting outside the array.

Start now.
`
});

    const interview = {
      role: role, // role of the interview
      amount: amount, // amount of questions
      type: type, // type of interview (behavioural, technical, mixed)
      level: level, // level of the interview (entry level, junior, mid, senior, expert)
      techstack: techstack.split(","),// tech stack used in the interview
      questions: JSON.parse(questions), // parse the questions from gemini
      userId: userid,// user id of the user who created the interview
      finalized: true,// whether the interview is finalized or not
      coverImage: getRandomInterviewCover(),// random cover image for the interview
      createdAt: new Date().toISOString(), // created at date
    };

    await db.collection("interviews").add(interview);// store in firebase db

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error:", error);
    return Response.json({ success: false, error: error }, { status: 500 });
  }
}

export async function GET() {
  return Response.json({ success: true, data: "Thank you!" }, { status: 200 });
}