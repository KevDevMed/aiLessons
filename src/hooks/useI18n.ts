import { useState, useCallback, useEffect } from 'react';

type Lang = 'en' | 'es';

const dict: Record<Lang, Record<string, string>> = {
  en: {
    'os.title': 'SecondSession',
    'os.lang.toggle': 'ES',
    'app.presentation': 'AI Tools Setup',
    'app.terminal': 'Terminal',
    'app.files': 'File Explorer',
    'app.notepad': 'Notepad',
    'app.calculator': 'Calculator',
    'app.settings': 'Settings',
    'nav.prev': 'Previous',
    'nav.next': 'Next',
    'nav.of': 'of',

    // Slide 1 - Title
    's1.title': 'AI Tools & Agents',
    's1.subtitle': 'How to set up agents and tools for your daily work',

    // Slide 2 - Why Are We Here?
    's2.title': 'Why Are We Here?',
    's2.desc': 'The market we operate in is changing extremely fast due to artificial intelligence. We need everyone on the team to be aware of the impact of these tools and how to integrate them into their daily work.',
    's2.p1.title': 'Rapid Change',
    's2.p1.desc': 'New updates are released daily — sometimes multiple times a day',
    's2.p2.title': 'Competitive Edge',
    's2.p2.desc': 'Teams that adopt AI tools now will outperform those that wait',
    's2.p3.title': 'Everyone Is Affected',
    's2.p3.desc': 'This is not just for developers — every role benefits from AI tools',

    // Slide 3 - Agenda
    's3.title': 'Agenda',
    's3.i1': 'Brave browser: why you should switch',
    's3.i2': 'AI is not just a chat — the agentic revolution',
    's3.i3': 'AI amplifies YOUR knowledge',
    's3.i4': 'Understanding the terminal',
    's3.i5': 'Warp: an AI-powered terminal',
    's3.i6': 'Installing Claude Code & Codex',
    's3.i7': 'The folder context: how agents work on your computer',
    's3.i8': 'Live demos: folders, Excel files, and skills',
    's3.i9': 'Loops, automation, and what comes next (MCPs)',

    // Slide 4 - Brave Browser
    's4.title': 'Step 1: Switch to Brave Browser',
    's4.desc': 'Stop using Google Chrome. Chrome is like a person breathing next to you all the time, watching everything you do and learning from it. Brave is optimized for search, security, and performance.',
    's4.f1.title': 'Less RAM Usage',
    's4.f1.desc': 'Chrome and Edge-based browsers consume too much RAM, slowing down your computer',
    's4.f2.title': 'Built-in Ad Blocker',
    's4.f2.desc': 'No YouTube ads even in incognito — no extensions needed',
    's4.f3.title': 'Privacy & Tor',
    's4.f3.desc': 'Built-in Shields against tracking and fingerprinting, plus Tor windows for full privacy',
    's4.note': 'Tested Opera, Arc, Zen, and Firefox — Brave is the current state of the art for browsers.',

    // Slide 5 - AI Is Not Just a Chat
    's5.title': 'AI Is Not Just a Chat',
    's5.desc': 'If you think AI is only about ChatGPT or Claude chat windows, you are stuck in 2022. AI technology improves literally every day — by noon there is a new update, by evening another one.',
    's5.p1.title': 'Anthropic (Claude)',
    's5.p1.desc': 'Created models designed to be agentic — they can take actions, not just answer',
    's5.p2.title': 'OpenAI (ChatGPT)',
    's5.p2.desc': 'Building AI that can code, browse, and execute tasks autonomously',
    's5.p3.title': 'Google (Gemini)',
    's5.p3.desc': 'Integrating AI across all their products and developer tools',

    // Slide 6 - AI Amplifies YOUR Knowledge
    's6.title': 'AI Amplifies YOUR Knowledge',
    's6.desc': 'Think of AI as a multiplier — but it only activates based on the knowledge YOU have. You can ask "I want money" and get generic answers, or you can ask with deep business context and get PhD-level results.',
    's6.key': 'The most important factor is not the model — it is YOU. Stay updated, keep learning, and feed the AI with quality context to get the best results.',

    // Slide 7 - The Agentic Power
    's7.title': 'The Agentic Power',
    's7.desc': 'Agentic AI means these models can work inside your computer — creating files, running commands, modifying documents, and executing tasks autonomously.',
    's7.p1.title': 'Runs Locally',
    's7.p1.desc': 'The agent works on your machine, reading and writing your files directly',
    's7.p2.title': 'Hardware Note',
    's7.p2.desc': 'AI uses TPUs (Tensor Processing Units). Older machines may be slower — be patient. MacBooks with M-series chips are optimized for this.',
    's7.p3.title': 'Unlimited Potential',
    's7.p3.desc': 'You can literally do anything with your computer through these agents',

    // Slide 8 - Understanding the Terminal
    's8.title': 'Understanding the Terminal',
    's8.desc': 'The terminal is how we give the AI agent permission to work on our computer. Every computer has one — CMD on Windows, Terminal on Mac.',
    's8.s1': '"ls" (Mac/Linux) or "dir" (Windows) — list files and folders',
    's8.s2': '"cd foldername" — enter a folder',
    's8.s3': '"cd .." — go back one folder',
    's8.s4': '"mkdir name" — create a new folder',
    's8.note': 'Don\'t worry if this feels overwhelming at first. The tools we will install make it much easier.',

    // Slide 9 - What is Warp?
    's9.title': 'What is Warp?',
    's9.desc': 'Warp is a wrapper around your system terminal with a built-in AI agent. It comes with free AI credits and works on both Windows and Mac.',
    's9.f1.title': 'AI Agent Built-in',
    's9.f1.desc': 'Press Ctrl+Enter to open the AI panel — ask it anything, even to install tools for you',
    's9.f2.title': 'Free Credits',
    's9.f2.desc': 'Includes free AI credits — more than enough to get started with installations',
    's9.f3.title': 'Smart Autocomplete',
    's9.f3.desc': 'Suggests commands as you type — helps you learn terminal commands naturally',

    // Slide 10 - Installing Warp
    's10.title': 'Installing Warp',
    's10.s1': 'Visit warp.dev and download the installer',
    's10.s2': 'Open the downloaded file and install (drag to Applications on Mac)',
    's10.s3': 'Launch Warp and sign in — you can use your work email',
    's10.s4': 'You are ready to start using the AI agent',

    // Slide 11 - Installing Claude Code
    's11.title': 'Installing Claude Code',
    's11.desc': 'Claude Code is the CLI tool by Anthropic that brings agentic AI directly into your terminal. You can install it two ways:',
    's11.m1.title': 'Method 1: Direct Command',
    's11.m1.desc': 'Copy the install command from the documentation and paste it in your terminal',
    's11.m2.title': 'Method 2: Ask Warp\'s AI Agent',
    's11.m2.desc': 'Just tell the Warp agent: "I need to install Claude Code, can you help me?" — it will handle everything automatically',

    // Slide 12 - Installing Codex
    's12.title': 'Installing Codex',
    's12.desc': 'Codex is OpenAI\'s CLI tool for code generation and assistance. Together with Claude Code, these become your main daily tools.',

    // Slide 13 - The Folder Context
    's13.title': 'The Folder Context',
    's13.desc': 'When you run Claude Code or Codex, the agent works inside the folder you are in. Think of folders as the workspace where your AI worker operates.',
    's13.p1.title': 'Files Stay on Your Computer',
    's13.p1.desc': 'Unlike web-based AI, the agent modifies your actual files — no need to copy-paste results',
    's13.p2.title': 'Any File Type',
    's13.p2.desc': 'Excel, PDFs, images, code — the agent can interact with any type of file',
    's13.p3.title': 'Folder = Context',
    's13.p3.desc': 'Navigate to the right folder before starting the agent — that becomes its workspace',

    // Slide 14 - Configuring Claude Code
    's14.title': 'Configuring Claude Code',
    's14.desc': 'After installation, you need to authenticate and configure permissions.',
    's14.s1': 'Run "claude" in your terminal to start — it will ask you to log in',
    's14.s2': 'Follow the authentication prompts (opens a browser window)',
    's14.s3': 'Say "Yes, I trust this folder" when prompted',
    's14.s4': 'Optional: use --dangerously-skip-permissions to auto-approve all actions',

    // Slide 15 - Demo: Creating Folders
    's15.title': 'Demo: Creating Folders',
    's15.desc': 'With a simple natural language request, the agent creates complex folder structures in seconds.',

    // Slide 16 - Demo: Excel Files with Data
    's16.title': 'Demo: Excel Files with Data',
    's16.desc': 'The agent can create multiple Excel files, add specific headers, populate data, and place them in the right folders — all from a single prompt.',

    // Slide 17 - Creating Skills (Custom Commands)
    's17.title': 'Creating Skills (Custom Commands)',
    's17.desc': 'For tasks you repeat often, create a skill — a reusable command that the agent remembers and can execute anytime with a single slash command.',
    's17.example': 'Example: Tell the agent to create a skill that generates weekly folder structures with Excel files. Then just type /generar-excel to run it.',
    's17.note': 'Skills are shared across sessions and even across different AI tools (Claude Code, Codex).',

    // Slide 18 - Multiple Agents Simultaneously
    's18.title': 'Multiple Agents Simultaneously',
    's18.desc': 'You can run the two best AI models from top tech companies at the same time, in the same folder, doing different tasks.',
    's18.p1.title': 'Claude Code (Anthropic)',
    's18.p1.desc': 'Creating your folder structure and Excel files',
    's18.p2.title': 'Codex (OpenAI)',
    's18.p2.desc': 'Opening web pages, researching, or building something else in parallel',

    // Slide 19 - Loops & Automation
    's19.title': 'Loops & Automation',
    's19.desc': 'Use /loop to schedule recurring tasks. The agent will automatically run your commands at the interval you specify.',
    's19.example': 'Example: /loop 24h /generar-excel — runs the skill every 24 hours automatically.',
    's19.note': 'Sessions last approximately 7 days. The loop runs as long as the session is active. Your computer needs to be on.',

    // Slide 20 - What's Next: MCPs
    's20.title': 'What\'s Next: MCPs',
    's20.desc': 'MCP (Model Context Protocol) is a protocol that lets AI agents connect to external services — Slack, Linear, Telegram, deployment platforms, and even your browser.',
    's20.p1.title': 'Slack Integration',
    's20.p1.desc': 'Read and send messages through the agent',
    's20.p2.title': 'Linear Integration',
    's20.p2.desc': 'Manage tickets and projects from the terminal',
    's20.p3.title': 'Browser Control',
    's20.p3.desc': 'Codex can open and interact with web pages directly',
    's20.note': 'We will cover MCPs in the next session.',

    // Slide 21 - Key Advice
    's21.title': 'Key Advice & Best Practices',
    's21.p1.title': 'Use English for Prompting',
    's21.p1.desc': 'Spanish works, but English produces better results with AI agents — practice your English',
    's21.p2.title': 'Document Your Instructions',
    's21.p2.desc': 'Write down step-by-step what you do daily. Clear instructions = powerful automation',
    's21.p3.title': 'Don\'t Be Afraid to Experiment',
    's21.p3.desc': 'You won\'t break anything. The worst that can happen is getting wrong results — just try again',
    's21.p4.title': 'Start With What You Know',
    's21.p4.desc': 'Convert your daily repetitive tasks into AI commands. That\'s where imagination begins.',

    // Slide 22 - Team Task (Homework)
    's22.title': 'Team Task',
    's22.desc': 'Complete the following steps before the next session:',
    's22.t1': 'Download and install Brave browser from brave.com',
    's22.t2': 'Download and install Warp terminal from warp.dev',
    's22.t3': 'Install Claude Code using Warp or the direct command',
    's22.t4': 'Install Codex using Warp or the direct command',
    's22.t5': 'Run "claude" and complete the authentication process',
    's22.t6': 'Create a custom skill/command for a task you do repeatedly',

    // Slide 23 - Resources
    's23.title': 'Resources',
    's23.brave': 'Brave Browser',
    's23.warp': 'Warp Terminal',
    's23.claude': 'Claude Code Documentation',
    's23.codex': 'Codex CLI',
    's23.desc': 'Bookmark these resources. When in doubt, paste the documentation into your AI agent.',

    // Slide 24 - Thank You + Reflection
    's24.title': 'The Future Is Now',
    's24.p1': 'All of our jobs will evolve. Tracking, email, reports, copy-paste — all of that will become obsolete.',
    's24.p2': 'But this is not the end. The value of our work will shift to new areas created by this context.',
    's24.p3': 'The company no longer needs someone who just knows Excel or can merge PDFs. We need people who understand the business deeply and use AI tools to build solutions.',
    's24.closing': 'This is a race we are already running. Let\'s run it together.',

    // ========== SESSION 2: AI Models & Tracking Demo ==========
    'app.presentation2': 'AI Models & Tracking',

    // Slide 1 - Title
    'c2s1.title': 'AI Models & Tracking Demo',
    'c2s1.subtitle': 'Understanding AI models, pricing, and building a container tracking killer',

    // Slide 2 - Session 1 Recap
    'c2s2.title': 'Session 1 Recap',
    'c2s2.desc': 'Last session we set up the foundation — browser, terminal, AI agents, and skills. Everything from Session 1 is now available in this app for you to review anytime.',
    'c2s2.p1.title': 'Tools Installed',
    'c2s2.p1.desc': 'Brave browser, Warp terminal, Claude Code, and Codex — your AI toolkit is ready',
    'c2s2.p2.title': 'Skills & Automation',
    'c2s2.p2.desc': 'Created custom slash commands and set up loops for recurring tasks',
    'c2s2.p3.title': 'Folder Context',
    'c2s2.p3.desc': 'The agent works inside the folder you navigate to — files stay on your computer',

    // Slide 3 - Agenda
    'c2s3.title': 'Agenda',
    'c2s3.i1': 'Understanding AI models — how they are trained and how to choose them',
    'c2s3.i2': 'The three key performance indices: Intelligence, Code, Agentic',
    'c2s3.i3': 'The Chinese model revolution — 10x cheaper, open source',
    'c2s3.i4': 'Pricing and token economics — input, output, cache',
    'c2s3.i5': 'OpenCode: a multi-model harness for any AI provider',
    'c2s3.i6': 'OpenRouter: unified API access with free models',
    'c2s3.i7': 'MCPs and Chrome DevTools — browser automation',
    'c2s3.i8': 'Live demo: Tracking Killer — container tracking with AI',

    // Slide 4 - Understanding AI Models
    'c2s4.title': 'Understanding AI Models',
    'c2s4.desc': 'Think of AI models as that very literal friend who takes everything at face value — no sarcasm, no shortcuts. This friend was trained by being fed massive amounts of data and then corrected through human feedback until it learned the patterns.',
    'c2s4.key': 'Knowing which model to use for your specific task is crucial — not just for results, but for your budget. The best model for coding is not the same as the best model for creative tasks or agent automation.',

    // Slide 5 - Three Performance Indices
    'c2s5.title': 'Three Performance Indices',
    'c2s5.desc': 'AI models are evaluated across three key dimensions. Understanding these helps you pick the right model for the right job — and avoid overpaying.',
    'c2s5.p1.title': 'Intelligence Index',
    'c2s5.p1.desc': 'General reasoning, problem-solving, and understanding — the "how smart is it" metric',
    'c2s5.p2.title': 'Code Index',
    'c2s5.p2.desc': 'Code generation, debugging, and software development capabilities',
    'c2s5.p3.title': 'Agentic Index',
    'c2s5.p3.desc': 'Task execution, tool use, file manipulation — the "can it do things for me" metric',

    // Slide 6 - Intelligence Index
    'c2s6.title': 'Intelligence Index',
    'c2s6.desc': 'Which model is the smartest? According to Artificial Analysis benchmarks, the answer might surprise you.',
    'c2s6.p1.title': 'Gemini 3.1 Pro Leads',
    'c2s6.p1.desc': 'Google\'s Gemini currently tops the intelligence benchmarks — if you want the smartest model, go to Gemini',
    'c2s6.p2.title': 'Chinese Models Rising',
    'c2s6.p2.desc': 'Models from DeepSeek, Qwen, and others are reaching near-parity with US models on general intelligence',
    'c2s6.p3.title': 'Smart != Best at Everything',
    'c2s6.p3.desc': 'The most intelligent model is not necessarily the best for coding or agentic tasks — specialization matters',

    // Slide 7 - Code Index
    'c2s7.title': 'Code Index',
    'c2s7.desc': 'For building applications and writing code, the rankings shift. The best coder is not always the smartest overall model.',
    'c2s7.p1.title': 'GPT 5.4 Leads',
    'c2s7.p1.desc': 'OpenAI\'s latest model currently produces the best code generation results across benchmarks',
    'c2s7.p2.title': 'Very Close Competition',
    'c2s7.p2.desc': 'Claude, Gemini, and GPT are practically tied — the differences are marginal at the top',
    'c2s7.p3.title': 'Open Source Catching Up',
    'c2s7.p3.desc': 'Chinese open-source models like Qwen and DeepSeek are rapidly closing the gap in code quality',

    // Slide 8 - Agentic Index
    'c2s8.title': 'Agentic Index',
    'c2s8.desc': 'Which model is the best at actually doing tasks? Merging PDFs, creating folders, sending emails — the agentic capabilities that matter for automation.',
    'c2s8.p1.title': 'Claude & GPT Lead',
    'c2s8.p1.desc': 'Anthropic and OpenAI models dominate agentic tasks — they were designed for taking actions, not just answering',
    'c2s8.p2.title': 'Gemini Falls Behind',
    'c2s8.p2.desc': 'Despite leading in intelligence, Gemini struggles with agentic tasks — creating folders, merging files, etc.',
    'c2s8.p3.title': 'Chinese Models Surprise',
    'c2s8.p3.desc': 'Xiaomi, Minimax, Alibaba, and DeepSeek models are reaching state-of-the-art levels in agentic capabilities',

    // Slide 9 - The Chinese Model Revolution
    'c2s9.title': 'The Chinese Model Revolution',
    'c2s9.desc': 'Chinese companies are disrupting the AI market by training models that distill knowledge from GPT, Claude, and Gemini — then releasing them as open source at a fraction of the cost.',
    'c2s9.p1.title': '10x Cheaper',
    'c2s9.p1.desc': 'Chinese models cost roughly 10 times less than their US counterparts for equivalent performance',
    'c2s9.p2.title': 'Open Source',
    'c2s9.p2.desc': 'Models like Qwen, DeepSeek, and Minimax are open source — you can run them locally for free if you have the hardware',
    'c2s9.p3.title': 'Best for Specific Tasks',
    'c2s9.p3.desc': 'Chinese models lead in finance, marketing, and video generation — Minimax 2.7 beats Gemini for image creation',

    // Slide 10 - Pricing & Token Economics
    'c2s10.title': 'Pricing & Token Economics',
    'c2s10.desc': 'AI models charge per token — the smallest unit of text they process. A token is roughly a word or part of a word. There are three types of token costs:',
    'c2s10.p1.title': 'Input Tokens',
    'c2s10.p1.desc': 'What you send to the model — your prompts, files, context. Example: "hello" = ~2 tokens',
    'c2s10.p2.title': 'Output Tokens',
    'c2s10.p2.desc': 'What the model generates — responses, code, files. Usually more expensive than input',
    'c2s10.p3.title': 'Cache Tokens',
    'c2s10.p3.desc': 'Conversation history stored between messages. Long sessions consume more cache tokens over time',

    // Slide 11 - Usage Limits & Plans
    'c2s11.title': 'Usage Limits & Plans',
    'c2s11.desc': 'Both Claude Code and Codex have usage limits that reset every 5 hours, plus weekly caps. Understanding these helps you manage your workflow.',
    'c2s11.s1': 'Run "claude /usage" to check your Claude Code limits and remaining tokens',
    'c2s11.s2': 'Run "codex stats" to check your Codex usage and remaining capacity',
    'c2s11.s3': 'Limits reset every 5 hours — plan heavy tasks around these windows',
    'c2s11.s4': 'The $200/month plan gives ~$5,000 worth of subsidized tokens — 25x value',
    'c2s11.note': 'The $100 Max plan is recommended for serious use. The $20 plan runs out very quickly.',

    // Slide 12 - What is OpenCode?
    'c2s12.title': 'What is OpenCode?',
    'c2s12.desc': 'OpenCode is a multi-model harness — like Claude Code and Codex combined, but it works with ANY AI provider. Claude Code only works with Anthropic. Codex only works with OpenAI. OpenCode lets you use any model you want.',
    'c2s12.p1.title': 'Any Model Provider',
    'c2s12.p1.desc': 'Connect to OpenAI, Anthropic, Google, Chinese models, or any provider with an API',
    'c2s12.p2.title': 'Free Models Available',
    'c2s12.p2.desc': 'Access free models from Zen, Qwen 3.6, NVIDIA NemoTron, and others — zero cost',
    'c2s12.p3.title': 'Same Agentic Power',
    'c2s12.p3.desc': 'Works just like Claude Code or Codex — creates files, runs commands, modifies documents',

    // Slide 13 - Installing OpenCode
    'c2s13.title': 'Installing OpenCode',
    'c2s13.desc': 'Installation is quick through Warp or your terminal. After installing, authenticate with your preferred providers.',
    'c2s13.s1': 'Install OpenCode using the npm command or ask Warp to help',
    'c2s13.s2': 'Run "opencode" in your terminal to start',
    'c2s13.s3': 'Run "opencode auth login" to connect to a provider (OpenRouter, OpenAI, etc.)',
    'c2s13.s4': 'Select your model and start working — type "opencode" in any folder',
    'c2s13.note': 'Note: Anthropic models require a paid API key. Use OpenRouter or free Chinese models instead.',

    // Slide 14 - What is OpenRouter?
    'c2s14.title': 'What is OpenRouter?',
    'c2s14.desc': 'Before OpenRouter, you needed a separate API key for every model provider — Minimax, Alibaba, DeepSeek, etc. OpenRouter unifies all providers into a single API key.',
    'c2s14.p1.title': 'One Key, All Models',
    'c2s14.p1.desc': 'A single API key gives you access to hundreds of models across all major providers',
    'c2s14.p2.title': 'Free Tier Models',
    'c2s14.p2.desc': 'Several models are completely free — Gema 4, NVIDIA models, and more rotate in and out',
    'c2s14.p3.title': 'Usage Categories',
    'c2s14.p3.desc': 'Browse models by category — Finance, Marketing, Video — to find the best fit for your task',

    // Slide 15 - Setting Up OpenRouter
    'c2s15.title': 'Setting Up OpenRouter',
    'c2s15.desc': 'Create your account, generate an API key with spending limits, and connect it to OpenCode.',
    'c2s15.s1': 'Visit openrouter.ai and create an account (personal or work email)',
    'c2s15.s2': 'Go to Settings > Keys and click "Create Key"',
    'c2s15.s3': 'Set a spending limit (e.g., $10/month) — never leave keys without limits!',
    'c2s15.s4': 'Copy the key, run "opencode auth login", select OpenRouter, paste the key',
    'c2s15.note': 'IMPORTANT: Always set spending limits on API keys. Exposed keys can lead to massive unexpected bills.',

    // Slide 16 - Free Models & Categories
    'c2s16.title': 'Free Models & Categories',
    'c2s16.desc': 'OpenRouter and OpenCode both offer free models to experiment with. OpenRouter also categorizes models by use case, showing which ones are best for specific tasks.',
    'c2s16.p1.title': 'Finance',
    'c2s16.p1.desc': 'Top 3 finance models are all Chinese — the first one is even free. Based on real usage data.',
    'c2s16.p2.title': 'Marketing',
    'c2s16.p2.desc': 'Chinese models dominate marketing tasks. Minimax 2.7 leads for image and video creation.',
    'c2s16.p3.title': 'Always Free Options',
    'c2s16.p3.desc': 'Look for "free" tags in OpenCode and OpenRouter. Models like Qwen 3.6 are completely free.',

    // Slide 17 - MCPs: Chrome DevTools
    'c2s17.title': 'MCPs: Chrome DevTools',
    'c2s17.desc': 'MCP (Model Context Protocol) lets AI agents connect to external tools. Chrome DevTools MCP, created by Google, lets any AI model control Google Chrome — navigate pages, click buttons, fill forms, and extract data.',
    'c2s17.p1.title': 'Browser Automation',
    'c2s17.p1.desc': 'The AI can open URLs, navigate websites, and interact with page elements automatically',
    'c2s17.p2.title': 'Data Extraction',
    'c2s17.p2.desc': 'Read content from any webpage, fill forms, and capture information into your files',
    'c2s17.p3.title': 'Limitations',
    'c2s17.p3.desc': 'Some sites use CAPTCHAs and Cloudflare protection that can block automated browsers',

    // Slide 18 - Demo: Tracking Killer
    'c2s18.title': 'Demo: Tracking Killer',
    'c2s18.desc': 'We combined Codex with Chrome DevTools MCP to track shipping containers automatically. One prompt, five container references — the AI opens TrackTrace, searches each container, and collects the data.',
    'c2s18.p1.title': 'The Prompt',
    'c2s18.p1.desc': '"I want to track these containers. Get the ETA, load port, and current location. Use TrackTrace first, then shipping line portals. Create an Excel with the results."',
    'c2s18.p2.title': 'What Happened',
    'c2s18.p2.desc': 'The AI navigated to TrackTrace, entered each container number, clicked through results, and collected tracking data — all without human intervention.',

    // Slide 19 - Demo Results
    'c2s19.title': 'Demo Results',
    'c2s19.desc': 'The AI created an Excel file with container tracking data. It even added notes explaining why certain containers could not be tracked — like expired records or disposed containers.',
    'c2s19.p1.title': 'Data Collected',
    'c2s19.p1.desc': 'Container number, source, origin, destination, ETA, and status — all extracted automatically',
    'c2s19.p2.title': 'Smart Notes',
    'c2s19.p2.desc': 'For containers it could not track, it added explanatory notes: "disposed", "not available", etc.',
    'c2s19.p3.title': 'Room for Improvement',
    'c2s19.p3.desc': 'With better instructions from the tracking team and their domain expertise, results would be far more accurate',

    // Slide 20 - Prompt in English
    'c2s20.title': 'Prompt in English',
    'c2s20.desc': 'AI models are predominantly trained on English data — books, encyclopedias, tweets, repositories. The largest datasets in the world are in English. Prompting in English consistently produces better results.',
    'c2s20.key': 'Start writing your prompts in English. Even if your Spanish is better, the model\'s English is always better. Practice your English while you practice AI — two skills for the price of one.',

    // Slide 21 - Key Advice & Reflections
    'c2s21.title': 'Key Advice & Reflections',
    'c2s21.p1.title': 'Learn, Unlearn, Relearn',
    'c2s21.p1.desc': '"The illiterate of this century are not those who cannot read and write, but those who cannot learn, unlearn, and relearn." — Alvin Toffler',
    'c2s21.p2.title': 'Protect Your API Keys',
    'c2s21.p2.desc': 'Never push API keys to GitHub. Always set spending limits. Exposed keys can generate bills of $90M+ pesos',
    'c2s21.p3.title': 'Creativity Is the New Currency',
    'c2s21.p3.desc': 'Companies no longer ask "what do you know?" They ask "what can you create?" — build things, show your portfolio',
    'c2s21.p4.title': 'Hardware Matters',
    'c2s21.p4.desc': 'MacBooks with M4+ chips are optimized for AI workloads. Even an M5 gets hot running agents. Invest in good hardware.',

    // Slide 22 - Team Task
    'c2s22.title': 'Team Task',
    'c2s22.desc': 'Complete the following steps before the next session:',
    'c2s22.t1': 'Explore Artificial Analysis (artificialanalysis.ai) and compare model benchmarks',
    'c2s22.t2': 'Install OpenCode and connect it to at least one free model provider',
    'c2s22.t3': 'Create an OpenRouter account and generate an API key with a spending limit',
    'c2s22.t4': 'Try a free Chinese model (Qwen, DeepSeek, or Minimax) through OpenCode',
    'c2s22.t5': 'Write one prompt in English to solve a real work task',
    'c2s22.t6': 'Think about a repetitive workflow you could automate with browser automation (MCPs)',

    // Slide 23 - Resources
    'c2s23.title': 'Resources',
    'c2s23.artificial': 'Artificial Analysis — Model Benchmarks',
    'c2s23.opencode': 'OpenCode — Multi-model Harness',
    'c2s23.openrouter': 'OpenRouter — Unified API Access',
    'c2s23.chromemcp': 'Chrome DevTools MCP — Browser Automation',
    'c2s23.desc': 'Bookmark these resources. Compare models before choosing. Use free tiers to experiment without spending.',

    // Slide 24 - The Creative Advantage
    'c2s24.title': 'The Creative Advantage',
    'c2s24.p1': 'The software we use today — Teams, CargoWise, Office 365 — could all be replaced by tools we build ourselves with AI.',
    'c2s24.p2': 'Stock prices of tech companies are falling because anyone can now create their own tools. The moat is disappearing.',
    'c2s24.p3': 'The value is no longer in what you know. It is in what you can imagine and create with the information you have.',
    'c2s24.closing': '"The illiterate of this century are not those who cannot read and write, but those who cannot learn, unlearn, and relearn."',
  },
  es: {
    'os.title': 'SecondSession',
    'os.lang.toggle': 'EN',
    'app.presentation': 'Config. Herramientas IA',
    'app.terminal': 'Terminal',
    'app.files': 'Explorador de Archivos',
    'app.notepad': 'Bloc de notas',
    'app.calculator': 'Calculadora',
    'app.settings': 'Configuracion',
    'nav.prev': 'Anterior',
    'nav.next': 'Siguiente',
    'nav.of': 'de',

    // Slide 1 - Title
    's1.title': 'Herramientas IA y Agentes',
    's1.subtitle': 'Como hacer el setup de los agentes y las herramientas para tu trabajo diario',

    // Slide 2 - Why Are We Here?
    's2.title': 'Por Que Estamos Aqui?',
    's2.desc': 'El mercado en el cual nos desenvolvemos esta cambiando bastante rapido debido a la inteligencia artificial. Necesitamos que todos en el equipo sean conscientes del impacto de estas herramientas y como integrarlas en su diario vivir.',
    's2.p1.title': 'Cambio Rapido',
    's2.p1.desc': 'Nuevas actualizaciones salen todos los dias — a veces varias al dia',
    's2.p2.title': 'Ventaja Competitiva',
    's2.p2.desc': 'Los equipos que adopten IA ahora superaran a los que esperen',
    's2.p3.title': 'Todos Estan Afectados',
    's2.p3.desc': 'Esto no es solo para desarrolladores — cada rol se beneficia de herramientas IA',

    // Slide 3 - Agenda
    's3.title': 'Agenda',
    's3.i1': 'Navegador Brave: por que deberias cambiar',
    's3.i2': 'La IA no es solo un chat — la revolucion agentica',
    's3.i3': 'La IA amplifica TU conocimiento',
    's3.i4': 'Entendiendo la terminal',
    's3.i5': 'Warp: una terminal con IA',
    's3.i6': 'Instalando Claude Code y Codex',
    's3.i7': 'El contexto de carpetas: como los agentes trabajan en tu computador',
    's3.i8': 'Demos en vivo: carpetas, archivos Excel y skills',
    's3.i9': 'Loops, automatizacion y lo que viene (MCPs)',

    // Slide 4 - Brave Browser
    's4.title': 'Paso 1: Cambiate a Brave',
    's4.desc': 'Dejen de usar Google Chrome. Chrome es como una persona que esta todo el tiempo al lado respirandoles, mirando todo lo que hacen y aprendiendo de ustedes. Brave esta optimizado para busqueda, seguridad y rendimiento.',
    's4.f1.title': 'Menos Consumo de RAM',
    's4.f1.desc': 'Chrome y navegadores basados en Edge consumen demasiada RAM, ralentizando el computador',
    's4.f2.title': 'Bloqueador de Anuncios',
    's4.f2.desc': 'Sin anuncios en YouTube ni en incognito — sin extensiones necesarias',
    's4.f3.title': 'Privacidad y Tor',
    's4.f3.desc': 'Shields integrados contra rastreo y fingerprinting, ademas de ventanas Tor para total privacidad',
    's4.note': 'Probe Opera, Arc, Zen y Firefox — Brave es el estado del arte actual en navegadores.',

    // Slide 5 - AI Is Not Just a Chat
    's5.title': 'La IA No Es Solo un Chat',
    's5.desc': 'Si piensan que la IA solo se resume a ChatGPT o la ventana de Claude, estan en el 2022. La tecnologia de IA mejora literalmente todos los dias — al mediodia hay una actualizacion, por la noche otra.',
    's5.p1.title': 'Anthropic (Claude)',
    's5.p1.desc': 'Creo modelos disenados para ser agenticos — pueden tomar acciones, no solo responder',
    's5.p2.title': 'OpenAI (ChatGPT)',
    's5.p2.desc': 'Construyendo IA que puede programar, navegar y ejecutar tareas autonomamente',
    's5.p3.title': 'Google (Gemini)',
    's5.p3.desc': 'Integrando IA en todos sus productos y herramientas para desarrolladores',

    // Slide 6 - AI Amplifies YOUR Knowledge
    's6.title': 'La IA Amplifica TU Conocimiento',
    's6.desc': 'Piensen en la IA como un potenciador — pero ese potenciador solo se activa basado en el conocimiento que USTEDES tienen. Pueden preguntar "quiero plata" y obtener respuestas genericas, o pueden preguntar con contexto profundo y obtener resultados de nivel doctorado.',
    's6.key': 'Lo mas importante no es el modelo — son USTEDES. Mantenganse actualizados, sigan aprendiendo, y alimenten la IA con contexto de calidad para obtener los mejores resultados.',

    // Slide 7 - The Agentic Power
    's7.title': 'El Poder Agentico',
    's7.desc': 'IA agentica significa que estos modelos pueden trabajar dentro de su computador — creando archivos, ejecutando comandos, modificando documentos y ejecutando tareas de manera autonoma.',
    's7.p1.title': 'Corre Localmente',
    's7.p1.desc': 'El agente trabaja en tu maquina, leyendo y escribiendo tus archivos directamente',
    's7.p2.title': 'Nota de Hardware',
    's7.p2.desc': 'La IA usa TPUs (Tensor Processing Units). Maquinas viejas pueden ser mas lentas — tengan paciencia. Las MacBooks con chips M estan optimizadas para esto.',
    's7.p3.title': 'Potencial Ilimitado',
    's7.p3.desc': 'Literalmente pueden hacer cualquier cosa con el computador a traves de estos agentes',

    // Slide 8 - Understanding the Terminal
    's8.title': 'Entendiendo la Terminal',
    's8.desc': 'La terminal es como le damos al agente IA el permiso de trabajar en nuestro computador. Todos los computadores tienen una — CMD en Windows, Terminal en Mac.',
    's8.s1': '"ls" (Mac/Linux) o "dir" (Windows) — listar archivos y carpetas',
    's8.s2': '"cd nombrecarpeta" — entrar a una carpeta',
    's8.s3': '"cd .." — volver una carpeta atras',
    's8.s4': '"mkdir nombre" — crear una nueva carpeta',
    's8.note': 'No se preocupen si se sienten perdidos al principio. Las herramientas que vamos a instalar lo hacen mucho mas facil.',

    // Slide 9 - What is Warp?
    's9.title': 'Que es Warp?',
    's9.desc': 'Warp es un wrapper sobre la terminal del sistema con un agente IA integrado. Viene con creditos gratis de IA y funciona tanto en Windows como en Mac.',
    's9.f1.title': 'Agente IA Integrado',
    's9.f1.desc': 'Presiona Ctrl+Enter para abrir el panel IA — pidele lo que sea, hasta instalar herramientas',
    's9.f2.title': 'Creditos Gratis',
    's9.f2.desc': 'Incluye creditos IA gratis — mas que suficiente para empezar con las instalaciones',
    's9.f3.title': 'Autocompletado Inteligente',
    's9.f3.desc': 'Sugiere comandos mientras escribes — te ayuda a aprender comandos de terminal naturalmente',

    // Slide 10 - Installing Warp
    's10.title': 'Instalando Warp',
    's10.s1': 'Visita warp.dev y descarga el instalador',
    's10.s2': 'Abre el archivo descargado e instala (arrastra a Aplicaciones en Mac)',
    's10.s3': 'Abre Warp e inicia sesion — puedes usar tu correo de trabajo',
    's10.s4': 'Estas listo para empezar a usar el agente IA',

    // Slide 11 - Installing Claude Code
    's11.title': 'Instalando Claude Code',
    's11.desc': 'Claude Code es la herramienta CLI de Anthropic que trae IA agentica directo a tu terminal. Puedes instalarlo de dos maneras:',
    's11.m1.title': 'Metodo 1: Comando Directo',
    's11.m1.desc': 'Copia el comando de instalacion de la documentacion y pegalo en tu terminal',
    's11.m2.title': 'Metodo 2: Pidele al Agente de Warp',
    's11.m2.desc': 'Simplemente dile al agente de Warp: "Necesito instalar Claude Code, puedes ayudarme?" — se encarga de todo automaticamente',

    // Slide 12 - Installing Codex
    's12.title': 'Instalando Codex',
    's12.desc': 'Codex es la herramienta CLI de OpenAI para generacion y asistencia de codigo. Junto con Claude Code, estas se convierten en tus herramientas principales del dia a dia.',

    // Slide 13 - The Folder Context
    's13.title': 'El Contexto de Carpetas',
    's13.desc': 'Cuando corres Claude Code o Codex, el agente trabaja dentro de la carpeta donde estas. Piensen en las carpetas como el espacio de trabajo donde opera su trabajador IA.',
    's13.p1.title': 'Los Archivos Quedan en tu Computador',
    's13.p1.desc': 'A diferencia de la IA web, el agente modifica tus archivos reales — no necesitas copiar y pegar resultados',
    's13.p2.title': 'Cualquier Tipo de Archivo',
    's13.p2.desc': 'Excel, PDFs, imagenes, codigo — el agente puede interactuar con cualquier tipo de archivo',
    's13.p3.title': 'Carpeta = Contexto',
    's13.p3.desc': 'Navega a la carpeta correcta antes de iniciar el agente — esa se convierte en su espacio de trabajo',

    // Slide 14 - Configuring Claude Code
    's14.title': 'Configurando Claude Code',
    's14.desc': 'Despues de la instalacion, necesitas autenticarte y configurar permisos.',
    's14.s1': 'Ejecuta "claude" en tu terminal — te pedira iniciar sesion',
    's14.s2': 'Sigue las indicaciones de autenticacion (abre una ventana del navegador)',
    's14.s3': 'Di "Yes, I trust this folder" cuando lo pregunte',
    's14.s4': 'Opcional: usa --dangerously-skip-permissions para auto-aprobar todas las acciones',

    // Slide 15 - Demo: Creating Folders
    's15.title': 'Demo: Creando Carpetas',
    's15.desc': 'Con una simple solicitud en lenguaje natural, el agente crea estructuras de carpetas complejas en segundos.',

    // Slide 16 - Demo: Excel Files with Data
    's16.title': 'Demo: Archivos Excel con Datos',
    's16.desc': 'El agente puede crear multiples archivos Excel, agregar encabezados especificos, rellenar datos y colocarlos en las carpetas correctas — todo desde un solo prompt.',

    // Slide 17 - Creating Skills
    's17.title': 'Creando Skills (Comandos Personalizados)',
    's17.desc': 'Para tareas que repites frecuentemente, crea un skill — un comando reutilizable que el agente recuerda y puede ejecutar en cualquier momento con un simple slash command.',
    's17.example': 'Ejemplo: Dile al agente que cree un skill que genere la estructura semanal de carpetas con archivos Excel. Luego solo escribe /generar-excel para ejecutarlo.',
    's17.note': 'Los skills se comparten entre sesiones e incluso entre diferentes herramientas IA (Claude Code, Codex).',

    // Slide 18 - Multiple Agents
    's18.title': 'Multiples Agentes Simultaneamente',
    's18.desc': 'Puedes correr los dos mejores modelos de IA de las empresas top de tecnologia al mismo tiempo, en la misma carpeta, haciendo tareas diferentes.',
    's18.p1.title': 'Claude Code (Anthropic)',
    's18.p1.desc': 'Creando tu estructura de carpetas y archivos Excel',
    's18.p2.title': 'Codex (OpenAI)',
    's18.p2.desc': 'Abriendo paginas web, investigando o construyendo algo mas en paralelo',

    // Slide 19 - Loops & Automation
    's19.title': 'Loops y Automatizacion',
    's19.desc': 'Usa /loop para programar tareas recurrentes. El agente ejecutara tus comandos automaticamente en el intervalo que especifiques.',
    's19.example': 'Ejemplo: /loop 24h /generar-excel — ejecuta el skill cada 24 horas automaticamente.',
    's19.note': 'Las sesiones duran aproximadamente 7 dias. El loop corre mientras la sesion este activa. Tu computador debe estar encendido.',

    // Slide 20 - What's Next: MCPs
    's20.title': 'Lo Que Viene: MCPs',
    's20.desc': 'MCP (Model Context Protocol) es un protocolo que permite a los agentes IA conectarse a servicios externos — Slack, Linear, Telegram, plataformas de deploy, e incluso tu navegador.',
    's20.p1.title': 'Integracion con Slack',
    's20.p1.desc': 'Leer y enviar mensajes a traves del agente',
    's20.p2.title': 'Integracion con Linear',
    's20.p2.desc': 'Gestionar tickets y proyectos desde la terminal',
    's20.p3.title': 'Control del Navegador',
    's20.p3.desc': 'Codex puede abrir e interactuar con paginas web directamente',
    's20.note': 'Cubriremos MCPs en la proxima sesion.',

    // Slide 21 - Key Advice
    's21.title': 'Consejos Clave y Mejores Practicas',
    's21.p1.title': 'Usa Ingles para los Prompts',
    's21.p1.desc': 'El espanol funciona, pero el ingles produce mejores resultados con agentes IA — practiquen su ingles',
    's21.p2.title': 'Documenten Sus Instrucciones',
    's21.p2.desc': 'Escriban paso a paso lo que hacen a diario. Instrucciones claras = automatizacion poderosa',
    's21.p3.title': 'No Les De Miedo Experimentar',
    's21.p3.desc': 'No van a explotar nada. Lo peor que puede pasar es que no les de los resultados correctos — simplemente intenten de nuevo',
    's21.p4.title': 'Empiecen Con Lo Que Saben',
    's21.p4.desc': 'Conviertan sus tareas repetitivas diarias en comandos IA. Ahi es donde empieza la imaginacion.',

    // Slide 22 - Team Task
    's22.title': 'Tarea del Equipo',
    's22.desc': 'Completen los siguientes pasos antes de la proxima sesion:',
    's22.t1': 'Descargar e instalar el navegador Brave desde brave.com',
    's22.t2': 'Descargar e instalar la terminal Warp desde warp.dev',
    's22.t3': 'Instalar Claude Code usando Warp o el comando directo',
    's22.t4': 'Instalar Codex usando Warp o el comando directo',
    's22.t5': 'Ejecutar "claude" y completar el proceso de autenticacion',
    's22.t6': 'Crear un skill/comando personalizado para una tarea que hacen repetidamente',

    // Slide 23 - Resources
    's23.title': 'Recursos',
    's23.brave': 'Navegador Brave',
    's23.warp': 'Terminal Warp',
    's23.claude': 'Documentacion de Claude Code',
    's23.codex': 'Codex CLI',
    's23.desc': 'Guarden estos recursos. Cuando tengan dudas, peguen la documentacion en su agente IA.',

    // Slide 24 - Thank You + Reflection
    's24.title': 'El Futuro Es Ahora',
    's24.p1': 'Todos nuestros trabajos van a evolucionar. Tracking, email, reportes, copiar y pegar — todo eso va a quedar obsoleto.',
    's24.p2': 'Pero esto no es el fin del mundo. El valor de nuestros trabajos se va a mover a nuevas areas creadas por este contexto.',
    's24.p3': 'La empresa ya no necesita una persona que simplemente sepa Excel o que simplemente sepa unir un PDF. Necesitamos personas que puedan desarrollar el conocimiento del negocio y que a traves de las herramientas IA puedan crear soluciones.',
    's24.closing': 'Esta es una carrera que ya nos toca correr. Corramos juntos.',

    // ========== SESION 2: Modelos de IA y Demo de Tracking ==========
    'app.presentation2': 'Modelos IA y Tracking',

    // Slide 1 - Titulo
    'c2s1.title': 'Modelos de IA y Demo de Tracking',
    'c2s1.subtitle': 'Entendiendo los modelos de IA, precios y construyendo un tracking killer para contenedores',

    // Slide 2 - Repaso Sesion 1
    'c2s2.title': 'Repaso de la Sesion 1',
    'c2s2.desc': 'En la sesion pasada montamos la base — navegador, terminal, agentes IA y skills. Todo lo de la Sesion 1 ya esta disponible en esta app para que lo repasen cuando quieran.',
    'c2s2.p1.title': 'Herramientas Instaladas',
    'c2s2.p1.desc': 'Brave, Warp, Claude Code y Codex — su kit de herramientas IA esta listo',
    'c2s2.p2.title': 'Skills y Automatizacion',
    'c2s2.p2.desc': 'Creamos comandos personalizados con slash y configuramos loops para tareas recurrentes',
    'c2s2.p3.title': 'Contexto de Carpetas',
    'c2s2.p3.desc': 'El agente trabaja dentro de la carpeta donde navegues — los archivos se quedan en tu computador',

    // Slide 3 - Agenda
    'c2s3.title': 'Agenda',
    'c2s3.i1': 'Entendiendo los modelos de IA — como se entrenan y como escogerlos',
    'c2s3.i2': 'Los tres indices clave: Inteligencia, Codigo, Agentico',
    'c2s3.i3': 'La revolucion de los modelos chinos — 10 veces mas baratos, codigo abierto',
    'c2s3.i4': 'Precios y economia de tokens — input, output, cache',
    'c2s3.i5': 'OpenCode: un harness multi-modelo para cualquier proveedor de IA',
    'c2s3.i6': 'OpenRouter: acceso unificado a APIs con modelos gratis',
    'c2s3.i7': 'MCPs y Chrome DevTools — automatizacion del navegador',
    'c2s3.i8': 'Demo en vivo: Tracking Killer — seguimiento de contenedores con IA',

    // Slide 4 - Entendiendo los Modelos de IA
    'c2s4.title': 'Entendiendo los Modelos de IA',
    'c2s4.desc': 'Piensen en los modelos de IA como ese amigo bien literal que se toma todo al pie de la letra — sin sarcasmo, sin atajos. A ese amigo lo entrenaron dandole cantidades masivas de datos y luego corrigiendolo con feedback humano hasta que aprendio los patrones.',
    'c2s4.key': 'Saber cual modelo usar para cada tarea es crucial — no solo por resultados, sino por el presupuesto. El mejor modelo para codigo no es el mismo que el mejor para tareas creativas o automatizacion agentica.',

    // Slide 5 - Tres Indices de Rendimiento
    'c2s5.title': 'Tres Indices de Rendimiento',
    'c2s5.desc': 'Los modelos de IA se evaluan en tres dimensiones clave. Entenderlas les ayuda a escoger el modelo correcto para cada trabajo — y a no pagar de mas.',
    'c2s5.p1.title': 'Indice de Inteligencia',
    'c2s5.p1.desc': 'Razonamiento general, resolucion de problemas y comprension — la metrica de "que tan inteligente es"',
    'c2s5.p2.title': 'Indice de Codigo',
    'c2s5.p2.desc': 'Generacion de codigo, debugging y capacidades de desarrollo de software',
    'c2s5.p3.title': 'Indice Agentico',
    'c2s5.p3.desc': 'Ejecucion de tareas, uso de herramientas, manipulacion de archivos — la metrica de "puede hacer cosas por mi"',

    // Slide 6 - Indice de Inteligencia
    'c2s6.title': 'Indice de Inteligencia',
    'c2s6.desc': 'Cual modelo es el mas inteligente? Segun los benchmarks de Artificial Analysis, la respuesta puede sorprenderlos.',
    'c2s6.p1.title': 'Gemini 3.1 Pro Lidera',
    'c2s6.p1.desc': 'Gemini de Google encabeza los benchmarks de inteligencia — si quieren el modelo mas inteligente, vayanse a Gemini',
    'c2s6.p2.title': 'Los Modelos Chinos Suben',
    'c2s6.p2.desc': 'Modelos de DeepSeek, Qwen y otros estan llegando casi a la par con los modelos estadounidenses en inteligencia general',
    'c2s6.p3.title': 'Inteligente != Mejor en Todo',
    'c2s6.p3.desc': 'El modelo mas inteligente no necesariamente es el mejor para codigo o tareas agenticas — la especializacion importa',

    // Slide 7 - Indice de Codigo
    'c2s7.title': 'Indice de Codigo',
    'c2s7.desc': 'Para construir aplicaciones y escribir codigo, los rankings cambian. El mejor para codigo no siempre es el modelo mas inteligente en general.',
    'c2s7.p1.title': 'GPT 5.4 Lidera',
    'c2s7.p1.desc': 'El ultimo modelo de OpenAI actualmente produce los mejores resultados de generacion de codigo en los benchmarks',
    'c2s7.p2.title': 'Competencia Muy Cerrada',
    'c2s7.p2.desc': 'Claude, Gemini y GPT estan practicamente empatados — las diferencias son marginales en la cima',
    'c2s7.p3.title': 'El Codigo Abierto Alcanza',
    'c2s7.p3.desc': 'Modelos chinos de codigo abierto como Qwen y DeepSeek estan cerrando la brecha rapidamente en calidad de codigo',

    // Slide 8 - Indice Agentico
    'c2s8.title': 'Indice Agentico',
    'c2s8.desc': 'Cual modelo es el mejor para realmente hacer tareas? Unir PDFs, crear carpetas, mandar correos — las capacidades agenticas que importan para la automatizacion.',
    'c2s8.p1.title': 'Claude y GPT Lideran',
    'c2s8.p1.desc': 'Los modelos de Anthropic y OpenAI dominan las tareas agenticas — fueron disenados para tomar acciones, no solo responder',
    'c2s8.p2.title': 'Gemini Se Queda Atras',
    'c2s8.p2.desc': 'A pesar de liderar en inteligencia, Gemini tiene problemas con tareas agenticas — crear carpetas, unir archivos, etc.',
    'c2s8.p3.title': 'Los Chinos Sorprenden',
    'c2s8.p3.desc': 'Modelos de Xiaomi, Minimax, Alibaba y DeepSeek estan llegando al estado del arte en capacidades agenticas',

    // Slide 9 - La Revolucion de los Modelos Chinos
    'c2s9.title': 'La Revolucion de los Modelos Chinos',
    'c2s9.desc': 'Las empresas chinas estan disrumpiendo el mercado de IA entrenando modelos que destilan conocimiento de GPT, Claude y Gemini — y luego los liberan como codigo abierto a una fraccion del costo.',
    'c2s9.p1.title': '10 Veces Mas Baratos',
    'c2s9.p1.desc': 'Los modelos chinos cuestan aproximadamente 10 veces menos que sus contrapartes estadounidenses por rendimiento equivalente',
    'c2s9.p2.title': 'Codigo Abierto',
    'c2s9.p2.desc': 'Modelos como Qwen, DeepSeek y Minimax son de codigo abierto — pueden correrlos localmente gratis si tienen el hardware',
    'c2s9.p3.title': 'Mejores para Tareas Especificas',
    'c2s9.p3.desc': 'Los modelos chinos lideran en finanzas, marketing y generacion de video — Minimax 2.7 supera a Gemini en creacion de imagenes',

    // Slide 10 - Precios y Economia de Tokens
    'c2s10.title': 'Precios y Economia de Tokens',
    'c2s10.desc': 'Los modelos de IA cobran por token — la unidad minima de texto que procesan. Un token es aproximadamente una palabra o parte de una palabra. Hay tres tipos de costos de tokens:',
    'c2s10.p1.title': 'Tokens de Input',
    'c2s10.p1.desc': 'Lo que le envias al modelo — tus prompts, archivos, contexto. Ejemplo: "hola" = ~2 tokens',
    'c2s10.p2.title': 'Tokens de Output',
    'c2s10.p2.desc': 'Lo que el modelo genera — respuestas, codigo, archivos. Generalmente mas caros que el input',
    'c2s10.p3.title': 'Tokens de Cache',
    'c2s10.p3.desc': 'El historial de conversacion almacenado entre mensajes. Sesiones largas consumen mas tokens de cache',

    // Slide 11 - Limites de Uso y Planes
    'c2s11.title': 'Limites de Uso y Planes',
    'c2s11.desc': 'Tanto Claude Code como Codex tienen limites de uso que se reinician cada 5 horas, mas topes semanales. Entenderlos les ayuda a manejar su flujo de trabajo.',
    'c2s11.s1': 'Ejecuten "claude /usage" para ver los limites de Claude Code y tokens restantes',
    'c2s11.s2': 'Ejecuten "codex stats" para ver el uso de Codex y capacidad restante',
    'c2s11.s3': 'Los limites se reinician cada 5 horas — planifiquen tareas pesadas alrededor de estas ventanas',
    'c2s11.s4': 'El plan de $200/mes da ~$5,000 en tokens subsidiados — 25 veces el valor',
    'c2s11.note': 'El plan Max de $100 es el recomendado para uso serio. El plan de $20 se agota muy rapido.',

    // Slide 12 - Que es OpenCode?
    'c2s12.title': 'Que es OpenCode?',
    'c2s12.desc': 'OpenCode es un harness multi-modelo — como Claude Code y Codex combinados, pero funciona con CUALQUIER proveedor de IA. Claude Code solo funciona con Anthropic. Codex solo funciona con OpenAI. OpenCode te deja usar cualquier modelo que quieras.',
    'c2s12.p1.title': 'Cualquier Proveedor',
    'c2s12.p1.desc': 'Conecta con OpenAI, Anthropic, Google, modelos chinos, o cualquier proveedor con API',
    'c2s12.p2.title': 'Modelos Gratis Disponibles',
    'c2s12.p2.desc': 'Accede a modelos gratis de Zen, Qwen 3.6, NVIDIA NemoTron y otros — costo cero',
    'c2s12.p3.title': 'Mismo Poder Agentico',
    'c2s12.p3.desc': 'Funciona igual que Claude Code o Codex — crea archivos, ejecuta comandos, modifica documentos',

    // Slide 13 - Instalando OpenCode
    'c2s13.title': 'Instalando OpenCode',
    'c2s13.desc': 'La instalacion es rapida a traves de Warp o tu terminal. Despues de instalar, autenticate con tus proveedores preferidos.',
    'c2s13.s1': 'Instala OpenCode usando el comando npm o pidele ayuda a Warp',
    'c2s13.s2': 'Ejecuta "opencode" en tu terminal para iniciar',
    'c2s13.s3': 'Ejecuta "opencode auth login" para conectar a un proveedor (OpenRouter, OpenAI, etc.)',
    'c2s13.s4': 'Selecciona tu modelo y empieza a trabajar — escribe "opencode" en cualquier carpeta',
    'c2s13.note': 'Nota: Los modelos de Anthropic requieren una API key de pago. Usa OpenRouter o modelos chinos gratis.',

    // Slide 14 - Que es OpenRouter?
    'c2s14.title': 'Que es OpenRouter?',
    'c2s14.desc': 'Antes de OpenRouter, necesitabas una API key separada para cada proveedor — Minimax, Alibaba, DeepSeek, etc. OpenRouter unifica todos los proveedores en una sola API key.',
    'c2s14.p1.title': 'Una Llave, Todos los Modelos',
    'c2s14.p1.desc': 'Una sola API key te da acceso a cientos de modelos de todos los proveedores principales',
    'c2s14.p2.title': 'Modelos del Tier Gratis',
    'c2s14.p2.desc': 'Varios modelos son completamente gratis — Gema 4, modelos de NVIDIA y mas rotan de entrada y salida',
    'c2s14.p3.title': 'Categorias de Uso',
    'c2s14.p3.desc': 'Explora modelos por categoria — Finanzas, Marketing, Video — para encontrar el mejor para tu tarea',

    // Slide 15 - Configurando OpenRouter
    'c2s15.title': 'Configurando OpenRouter',
    'c2s15.desc': 'Crea tu cuenta, genera una API key con limites de gasto y conectala a OpenCode.',
    'c2s15.s1': 'Visita openrouter.ai y crea una cuenta (correo personal o de trabajo)',
    'c2s15.s2': 'Ve a Settings > Keys y dale clic a "Create Key"',
    'c2s15.s3': 'Pon un limite de gasto (ej. $10/mes) — nunca dejes llaves sin limites!',
    'c2s15.s4': 'Copia la llave, ejecuta "opencode auth login", selecciona OpenRouter, pega la llave',
    'c2s15.note': 'IMPORTANTE: Siempre pongan limites de gasto en las API keys. Llaves expuestas pueden generar facturas de millones de pesos.',

    // Slide 16 - Modelos Gratis y Categorias
    'c2s16.title': 'Modelos Gratis y Categorias',
    'c2s16.desc': 'Tanto OpenRouter como OpenCode ofrecen modelos gratis para experimentar. OpenRouter ademas categoriza los modelos por caso de uso, mostrando cuales son los mejores para tareas especificas.',
    'c2s16.p1.title': 'Finanzas',
    'c2s16.p1.desc': 'Los 3 mejores modelos para finanzas son chinos — el primero es incluso gratis. Basado en datos reales de uso.',
    'c2s16.p2.title': 'Marketing',
    'c2s16.p2.desc': 'Los modelos chinos dominan las tareas de marketing. Minimax 2.7 lidera en creacion de imagenes y video.',
    'c2s16.p3.title': 'Opciones Siempre Gratis',
    'c2s16.p3.desc': 'Busquen las etiquetas "free" en OpenCode y OpenRouter. Modelos como Qwen 3.6 son completamente gratis.',

    // Slide 17 - MCPs: Chrome DevTools
    'c2s17.title': 'MCPs: Chrome DevTools',
    'c2s17.desc': 'MCP (Model Context Protocol) permite a los agentes IA conectarse a herramientas externas. Chrome DevTools MCP, creado por Google, le permite a cualquier modelo de IA controlar Google Chrome — navegar paginas, hacer clic en botones, llenar formularios y extraer datos.',
    'c2s17.p1.title': 'Automatizacion del Navegador',
    'c2s17.p1.desc': 'La IA puede abrir URLs, navegar sitios web e interactuar con elementos de la pagina automaticamente',
    'c2s17.p2.title': 'Extraccion de Datos',
    'c2s17.p2.desc': 'Lee contenido de cualquier pagina web, llena formularios y captura informacion en tus archivos',
    'c2s17.p3.title': 'Limitaciones',
    'c2s17.p3.desc': 'Algunos sitios usan CAPTCHAs y proteccion de Cloudflare que pueden bloquear navegadores automatizados',

    // Slide 18 - Demo: Tracking Killer
    'c2s18.title': 'Demo: Tracking Killer',
    'c2s18.desc': 'Combinamos Codex con Chrome DevTools MCP para rastrear contenedores automaticamente. Un prompt, cinco referencias de contenedores — la IA abre TrackTrace, busca cada contenedor y recopila los datos.',
    'c2s18.p1.title': 'El Prompt',
    'c2s18.p1.desc': '"Quiero trackear estos contenedores. Dame el ETA, puerto de carga y ubicacion actual. Usa TrackTrace primero, luego los portales de las navieras. Crea un Excel con los resultados."',
    'c2s18.p2.title': 'Lo Que Paso',
    'c2s18.p2.desc': 'La IA navego a TrackTrace, ingreso cada numero de contenedor, hizo clic en los resultados y recopilo datos de tracking — todo sin intervencion humana.',

    // Slide 19 - Resultados de la Demo
    'c2s19.title': 'Resultados de la Demo',
    'c2s19.desc': 'La IA creo un archivo Excel con datos de tracking de contenedores. Incluso agrego notas explicando por que ciertos contenedores no se pudieron rastrear — como registros expirados o contenedores dados de baja.',
    'c2s19.p1.title': 'Datos Recopilados',
    'c2s19.p1.desc': 'Numero de contenedor, fuente, origen, destino, ETA y estado — todo extraido automaticamente',
    'c2s19.p2.title': 'Notas Inteligentes',
    'c2s19.p2.desc': 'Para contenedores que no pudo rastrear, agrego notas explicativas: "dado de baja", "no disponible", etc.',
    'c2s19.p3.title': 'Espacio para Mejorar',
    'c2s19.p3.desc': 'Con mejores instrucciones del equipo de tracking y su conocimiento del dominio, los resultados serian mucho mas precisos',

    // Slide 20 - Hacer Prompts en Ingles
    'c2s20.title': 'Hacer Prompts en Ingles',
    'c2s20.desc': 'Los modelos de IA estan predominantemente entrenados con datos en ingles — libros, enciclopedias, tweets, repositorios. Los datasets mas grandes del mundo estan en ingles. Hacer prompts en ingles produce consistentemente mejores resultados.',
    'c2s20.key': 'Comiencen a escribir sus prompts en ingles. Aunque su espanol sea mejor, el ingles del modelo siempre es mejor. Practiquen su ingles mientras practican IA — dos habilidades por el precio de una.',

    // Slide 21 - Consejos Clave y Reflexiones
    'c2s21.title': 'Consejos Clave y Reflexiones',
    'c2s21.p1.title': 'Aprender, Desaprender, Reaprender',
    'c2s21.p1.desc': '"Los analfabetas de este siglo no son aquellos que no pueden leer y escribir, sino aquellos que no pueden aprender, desaprender y reaprender." — Alvin Toffler',
    'c2s21.p2.title': 'Protejan Sus API Keys',
    'c2s21.p2.desc': 'Nunca suban API keys a GitHub. Siempre pongan limites de gasto. Llaves expuestas pueden generar facturas de 90+ millones de pesos',
    'c2s21.p3.title': 'La Creatividad Es la Nueva Moneda',
    'c2s21.p3.desc': 'Las empresas ya no preguntan "que sabes?" sino "que puedes crear?" — construyan cosas, muestren su portafolio',
    'c2s21.p4.title': 'El Hardware Importa',
    'c2s21.p4.desc': 'MacBooks con chips M4+ estan optimizadas para cargas de IA. Hasta un M5 se calienta corriendo agentes. Inviertan en buen hardware.',

    // Slide 22 - Tarea del Equipo
    'c2s22.title': 'Tarea del Equipo',
    'c2s22.desc': 'Completen los siguientes pasos antes de la proxima sesion:',
    'c2s22.t1': 'Explorar Artificial Analysis (artificialanalysis.ai) y comparar benchmarks de modelos',
    'c2s22.t2': 'Instalar OpenCode y conectarlo a al menos un proveedor de modelos gratis',
    'c2s22.t3': 'Crear una cuenta en OpenRouter y generar una API key con limite de gasto',
    'c2s22.t4': 'Probar un modelo chino gratis (Qwen, DeepSeek o Minimax) a traves de OpenCode',
    'c2s22.t5': 'Escribir un prompt en ingles para resolver una tarea real de trabajo',
    'c2s22.t6': 'Pensar en un flujo repetitivo que podrian automatizar con automatizacion del navegador (MCPs)',

    // Slide 23 - Recursos
    'c2s23.title': 'Recursos',
    'c2s23.artificial': 'Artificial Analysis — Benchmarks de Modelos',
    'c2s23.opencode': 'OpenCode — Harness Multi-modelo',
    'c2s23.openrouter': 'OpenRouter — Acceso Unificado a APIs',
    'c2s23.chromemcp': 'Chrome DevTools MCP — Automatizacion del Navegador',
    'c2s23.desc': 'Guarden estos recursos. Comparen modelos antes de elegir. Usen los tiers gratis para experimentar sin gastar.',

    // Slide 24 - La Ventaja Creativa
    'c2s24.title': 'La Ventaja Creativa',
    'c2s24.p1': 'El software que usamos hoy — Teams, CargoWise, Office 365 — todo podria ser reemplazado por herramientas que construyamos nosotros mismos con IA.',
    'c2s24.p2': 'Las acciones de las empresas de tecnologia estan cayendo porque cualquiera puede crear sus propias herramientas. La barrera esta desapareciendo.',
    'c2s24.p3': 'El valor ya no esta en lo que sabes. Esta en lo que puedes imaginar y crear con la informacion que tienes.',
    'c2s24.closing': '"Los analfabetas de este siglo no son aquellos que no pueden leer y escribir, sino aquellos que no pueden aprender, desaprender y reaprender."',
  },
};

let globalLang: Lang = (localStorage.getItem('ss-lang') as Lang) || 'en';
const listeners = new Set<() => void>();

function notifyListeners() {
  listeners.forEach((fn) => fn());
}

export function t(key: string): string {
  return dict[globalLang]?.[key] || dict['en']?.[key] || key;
}

export function getLang(): Lang {
  return globalLang;
}

export function setLang(lang: Lang) {
  if (lang === globalLang) return;
  globalLang = lang;
  localStorage.setItem('ss-lang', lang);
  notifyListeners();
}

export function toggleLang() {
  setLang(globalLang === 'en' ? 'es' : 'en');
}

export function useI18n() {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const listener = () => forceUpdate((n) => n + 1);
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);

  return { t, lang: globalLang, setLang, toggleLang, getLang };
}
