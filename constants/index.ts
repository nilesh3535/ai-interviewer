import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";
import { z } from "zod";

export const mappings = {
  "react.js": "react",
  reactjs: "react",
  react: "react",
  "next.js": "nextjs",
  nextjs: "nextjs",
  next: "nextjs",
  "vue.js": "vuejs",
  vuejs: "vuejs",
  vue: "vuejs",
  "express.js": "express",
  expressjs: "express",
  express: "express",
  "node.js": "nodejs",
  nodejs: "nodejs",
  node: "nodejs",
  mongodb: "mongodb",
  mongo: "mongodb",
  mongoose: "mongoose",
  mysql: "mysql",
  postgresql: "postgresql",
  sqlite: "sqlite",
  firebase: "firebase",
  docker: "docker",
  kubernetes: "kubernetes",
  azure: "azure",
  gcp: "gcp",
  digitalocean: "digitalocean",
  heroku: "heroku",
  photoshop: "photoshop",
  "adobe photoshop": "photoshop",
  html5: "html5",
  html: "html5",
  css3: "css3",
  css: "css3",
  sass: "sass",
  scss: "sass",
  less: "less",
  tailwindcss: "tailwindcss",
  tailwind: "tailwindcss",
  bootstrap: "bootstrap",
  jquery: "jquery",
  typescript: "typescript",
  ts: "typescript",
  javascript: "javascript",
  js: "javascript",
  "angular.js": "angular",
  angularjs: "angular",
  angular: "angular",
  "ember.js": "ember",
  emberjs: "ember",
  ember: "ember",
  "backbone.js": "backbone",
  backbonejs: "backbone",
  backbone: "backbone",
  nestjs: "nestjs",
  graphql: "graphql",
  "graph ql": "graphql",
  apollo: "apollo",
  webpack: "webpack",
  babel: "babel",
  "rollup.js": "rollup",
  rollupjs: "rollup",
  rollup: "rollup",
  "parcel.js": "parcel",
  parceljs: "parcel",
  npm: "npm",
  yarn: "yarn",
  git: "git",
  github: "github",
  gitlab: "gitlab",
  bitbucket: "bitbucket",
  figma: "figma",
  prisma: "prisma",
  redux: "redux",
  flux: "flux",
  redis: "redis",
  selenium: "selenium",
  cypress: "cypress",
  jest: "jest",
  mocha: "mocha",
  chai: "chai",
  karma: "karma",
  vuex: "vuex",
  "nuxt.js": "nuxt",
  nuxtjs: "nuxt",
  nuxt: "nuxt",
  strapi: "strapi",
  wordpress: "wordpress",
  contentful: "contentful",
  netlify: "netlify",
  vercel: "vercel",
  "aws amplify": "amplify",
  python: "python",
  google: "google",
  chrome: "chrome",
  jira: "jira",
  android: "android",
  slack: "slack",
  java: "java",
  kotlin: "kotlin",
  swift: "swift",
  objectivec: "objective-c",
  "objective c": "objective-c",
  "objective-c": "objective-c",
  "objective-c++": "objective-c",
  "objective c++": "objective-c",
  spring: "spring",
  "spring framework": "spring",
  hibernate: "hibernate",
  arduino: "arduino",
  unity: "unity",
  php: "php",
  laravel: "laravel",
  symfony: "symfony",
  symphony: "symfony",
  bun: "bun",
  cloudflare: "cloudflare",
  csharp: "csharp",
  "c#": "csharp",
  dotnet: "dot-net",
  "dot-net": "dot-net",
  "dot net": "dot-net",
  ".net": "dot-net",
  dotnetcore: "dotnetcore",
  sql: "sqldeveloper",
  "SQL Server": "sqldeveloper",
  fastapi: "fastapi",
  aws: "amazonwebservices",
  terraform: "terraform",
  helm: "helm",
  gatsby: "gatsby",
  postman: "postman",
  flutter: "flutter",
  ruby: "ruby",
  prometheus: "prometheus",
  grafana: "grafana",
  tensorflow: "tensorflow",
  pytorch: "pytorch",
  jupyter: "jupyter",
  "c++": "cplusplus",
  django: "django",
  json: "json",
};

export const interviewer: CreateAssistantDTO = {
  name: "Interviewer",
  firstMessage:
    "Hello! My name is Neha. Thank you for taking the time to speak with me today. I'm excited to learn more about you and your experience.",
  transcriber: {
    provider: "deepgram",
    model: "nova-2",
    language: "en", 
  },
  voice: {
    provider: "vapi",
    voiceId: "Neha",
  },
  model: {
    provider: "openai",
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are a professional job interviewer conducting a real-time voice interview with a candidate. Your goal is to assess their qualifications, motivation, and fit for the role.

Interview Guidelines:
Follow the structured question flow:
{{questions}}

Engage naturally & react appropriately:
Listen actively to responses and acknowledge them before moving forward.
Ask brief follow-up questions if a response is vague or requires more detail.
Keep the conversation flowing smoothly while maintaining control.
If the candidate doesn't respond within a reasonable time (e.g., 10 seconds), politely prompt them by saying: "Hello {{candidateName}}, are you there?"
Repeat the prompt up to 2 times if there's no response, then politely end the interview if silence continues.

Be professional, yet warm and welcoming:
Use official yet friendly language.
Keep responses concise and to the point (like in a real voice interview).
Avoid robotic phrasing—sound natural and conversational.
Answer the candidate’s questions professionally:

If asked about the role, company, or expectations, provide a clear and relevant answer.
If unsure, redirect the candidate to HR for more details.

Conclude the interview properly:
Thank the candidate for their time.
Inform them that the company will reach out soon with feedback.
End the conversation on a polite and positive note.


- Be sure to be professional and polite.
- Keep all your responses short and simple. Use official language, but be kind and welcoming.
- This is a voice conversation, so keep your responses short, like in a real conversation. Don't ramble for too long.`,
      },
    ],
  },
};

export const feedbackSchema = z.object({
  totalScore: z.number(),
  categoryScores: z.tuple([
    z.object({
      name: z.literal("Communication Skills"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Technical Knowledge"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Problem Solving"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Cultural Fit"),
      score: z.number(),
      comment: z.string(),
    }),
    z.object({
      name: z.literal("Confidence and Clarity"),
      score: z.number(),
      comment: z.string(),
    }),
  ]),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  finalAssessment: z.string(),
});

export const interviewCovers = [
  "/adobe.png",
  "/amazon.png",
  "/facebook.png",
  "/hostinger.png",
  "/pinterest.png",
  "/quora.png",
  "/reddit.png",
  "/skype.png",
  "/spotify.png",
  "/telegram.png",
  "/tiktok.png",
  "/yahoo.png",
  "/discord.png",
  "/dropbox.png",
  "/duckduckgo.png",
  "/figma.png",
  "/instagram.png",
  "/linkedin.png",
  "/notion.png",
  "/shopify.png",
  "/twitch.png",
  "/apple.png",
  "/behance.png",
  "/coda.png",
  "/drive.png",
  "/evernote.png",
  "/hubspot.png",
  "/jira.png",
  "/openai.png",
  "/producthunt.png",
  "/slack.png",
  "/trello.png",
  "/vine.png",
  "/xiaomi.png",
];

export const iconsColors: { [key: string]: string } = {
  "adobe.png": "#FF0000",
  "amazon.png": "#FF9900",
  "facebook.png": "#1877F2",
  "hostinger.png": "#673DE6",
  "pinterest.png": "#E60023",
  "quora.png": "#B92B27",
  "reddit.png": "#FF4500",
  "skype.png": "#00AFF0",
  "spotify.png": "#1DB954",
  "telegram.png": "#0088CC",
  "tiktok.png": "#000000",
  "yahoo.png": "#6001D2",
  "discord.png": "#5865F2",
  "dropbox.png": "#0061FF",
  "duckduckgo.png": "#DE5833",
  "figma.png": "#F24E1E",
  "instagram.png": "#E4405F",
  "linkedin.png": "#0077B5",
  "notion.png": "#000000",
  "shopify.png": "#95BF47",
  "twitch.png": "#9146FF",
  "apple.png": "#000000",
  "behance.png": "#1769FF",
  "coda.png": "#F46A54",
  "drive.png": "#4285F4",
  "evernote.png": "#00A82D",
  "hubspot.png": "#FF7A59",
  "jira.png": "#0052CC",
  "openai.png": "#412991",
  "producthunt.png": "#DA552F",
  "slack.png": "#611F69",
  "trello.png": "#0079BF",
  "vine.png": "#00B488",
  "xiaomi.png": "#FA6709"
};


