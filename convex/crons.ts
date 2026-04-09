import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Daily at 09:00 UTC. Using crons.cron() per Convex guidelines (crons.daily
// is explicitly disallowed in convex/_generated/ai/guidelines.md).
crons.cron("fetch ai news", "0 9 * * *", internal.news.fetchAINews, {});

export default crons;
