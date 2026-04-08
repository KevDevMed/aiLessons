import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.daily(
  "fetch ai news",
  { hourUTC: 9, minuteUTC: 0 },
  internal.news.fetchAINews,
);

export default crons;
