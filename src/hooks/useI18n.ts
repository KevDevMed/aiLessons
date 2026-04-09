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

    // ========== SESSION 3 — Fine-Tuning & Billing Packets Killer ==========

    // Slide 1 - Title
    'c3s1.title': 'Fine-Tuning & Billing Packets Killer',
    'c3s1.subtitle': 'From open-source models to a working mobile app — built in three hours',

    // Slide 2 - Session 2 Recap
    'c3s2.title': 'Where We Left Off',
    'c3s2.desc': 'Last session we compared AI models, set up OpenCode + OpenRouter, and built a container-tracking demo with Chrome DevTools MCP. Today we take the next step: teaching a model to do YOUR job.',
    'c3s2.p1.title': 'Model Rankings',
    'c3s2.p1.desc': 'We learned how to compare intelligence, code, and agentic benchmarks',
    'c3s2.p2.title': 'OpenRouter + OpenCode',
    'c3s2.p2.desc': 'One API key, any provider — Chinese models at 10x cheaper',
    'c3s2.p3.title': 'Tracking Demo',
    'c3s2.p3.desc': 'Codex + Chrome DevTools MCP automated container tracking end-to-end',

    // Slide 3 - Agenda
    'c3s3.title': 'Today\'s Agenda',
    'c3s3.i1': 'What is fine-tuning and why it matters',
    'c3s3.i2': 'Open-source does not mean free — licenses explained',
    'c3s3.i3': 'Running models locally on your own hardware',
    'c3s3.i4': 'The dark side: scams, deepfakes, and why awareness wins',
    'c3s3.i5': 'The Billing Packets problem we want to solve',
    'c3s3.i6': 'Live demo: a mobile app with Expo, React Native and Minimax',
    'c3s3.i7': 'Connecting it all: CargoWise, EDI, email automation',
    'c3s3.i8': 'Your homework: find YOUR first automation target',

    // Slide 4 - What is Fine-Tuning?
    'c3s4.title': 'What Is Fine-Tuning?',
    'c3s4.desc': 'Fine-tuning is the process of taking a general-purpose model and teaching it to become an expert at a very specific task. You feed it thousands of examples, mark what is right and what is wrong, and the model gradually parameterizes itself to your domain.',
    'c3s4.key': 'Imagine taking a smart generalist and training them for 10,000 hours on billing packets specifically — eventually they start naming HBLs, MBLs and ISFs faster than any human on your team. That is what fine-tuning does to a model.',

    // Slide 5 - Open-Source ≠ Free
    'c3s5.title': 'Open-Source Does NOT Mean Free',
    'c3s5.desc': 'Open-source means the model weights and training code are published publicly. That is powerful — but "open" comes with licenses. Read them before you deploy a model into a commercial product.',
    'c3s5.p1.title': 'Apache 2.0',
    'c3s5.p1.desc': 'Permissive — you can use the model commercially, but you must include attribution and the license text',
    'c3s5.p2.title': 'MIT',
    'c3s5.p2.desc': 'Even simpler — commercial use allowed, minimal requirements, very liberal',
    'c3s5.p3.title': 'Revenue Clauses',
    'c3s5.p3.desc': 'Some licenses demand revenue-sharing above a threshold (e.g., $20M ARR). Always check before shipping',

    // Slide 6 - Chinese Open-Source Revolution
    'c3s6.title': 'The Chinese Open-Source Revolution',
    'c3s6.desc': 'OpenAI has "open" in the name but publishes nothing. Meanwhile, Chinese labs put frontier-grade models on GitHub and let anyone download them. That completely changes the economics of AI for the rest of us.',
    'c3s6.p1.title': 'GLM (Zhipu AI)',
    'c3s6.p1.desc': 'GLM-5 is on a public GitHub repo. Download it, run it, fine-tune it — you only pay for the electricity',
    'c3s6.p2.title': 'Qwen (Alibaba)',
    'c3s6.p2.desc': 'Multiple sizes — from 3B for laptops up to 72B for GPU clusters. Competitive with GPT',
    'c3s6.p3.title': 'Minimax',
    'c3s6.p3.desc': 'Strong multimodal model for reading PDFs, images, and tables — exactly what we need for billing',

    // Slide 7 - Running Models Locally
    'c3s7.title': 'Running Models On Your Laptop',
    'c3s7.desc': 'You do not need a supercomputer anymore. Modern quantized models run on 4-5 GB of RAM. Once a model is downloaded, it runs entirely on your machine — no internet, no external API calls, no data leaving your computer.',
    'c3s7.s1': 'Install Ollama or LM Studio from their website',
    'c3s7.s2': 'Browse models tagged "small" or "quantized" (look for 4GB, 5GB, 7GB sizes)',
    'c3s7.s3': 'Download a model — it\'s just a file, like a movie',
    'c3s7.s4': 'Run it. The first token proves your laptop is now a private AI',

    // Slide 8 - Power of Fine-Tuning
    'c3s8.title': 'The Power of Parameterization',
    'c3s8.desc': 'Once you understand fine-tuning, the world looks different. You are no longer limited to what a model knows out of the box — you can transfer YOUR knowledge, YOUR process, YOUR judgment into a model and run it forever.',
    'c3s8.quote': '"You can transfer your entire way of thinking to a model, and that model can replicate you. In a way, you become immortal — the things you know stop dying with you."',

    // Slide 9 - The Dark Side
    'c3s9.title': 'The Dark Side of Fine-Tuning',
    'c3s9.desc': 'The same power that builds a Billing Packets Killer can also build scams, deepfakes, and fake documents. If you understand the tools, you are better equipped to defend yourself and your team.',
    'c3s9.p1.title': 'Fraud & Scams',
    'c3s9.p1.desc': 'Bad actors already use fine-tuned voice and text models to impersonate coworkers and relatives',
    'c3s9.p2.title': 'Fake Documents',
    'c3s9.p2.desc': 'Fine-tuned models can generate convincing fake invoices, IDs, and shipping paperwork',
    'c3s9.p3.title': 'Your Defense: Awareness',
    'c3s9.p3.desc': 'The more you understand how these tools work, the harder it is for anyone to trick you with them',
    'c3s9.note': 'Stay informed. Teach your family to verify unexpected calls. Awareness is 90% of the defense.',

    // Slide 10 - The Billing Packets Problem
    'c3s10.title': 'The Billing Packets Problem',
    'c3s10.desc': 'Every shipment generates a pile of documents — commercial invoice, ISF, customs clearance, packing list, main invoice — and the Billing Packets team has to open each one, classify it, extract key fields, and assemble a final packet. It is slow, repetitive, and error-prone.',
    'c3s10.p1.title': 'Mixed File Types',
    'c3s10.p1.desc': 'PDFs, Excels, scanned images — each needs different handling',
    'c3s10.p2.title': 'Manual Classification',
    'c3s10.p2.desc': 'Humans decide what each document is, then rename and sort it by hand',
    'c3s10.p3.title': 'Data Entry Fatigue',
    'c3s10.p3.desc': 'Same fields — customer, invoice number, booking, MML — typed again and again',

    // Slide 11 - The Vision: A Mobile App
    'c3s11.title': 'The Vision: A Mobile App',
    'c3s11.desc': 'What if anyone on the Billing Packets team could open a phone app, point it at a shipment folder, and receive a fully organized billing packet in one minute? Here is how the flow works:',
    'c3s11.s1': 'Open the app — log in as Camilo, Geraldine, Brian, whoever',
    'c3s11.s2': 'Pick the shipment folder (downloaded from CargoWise)',
    'c3s11.s3': 'Hit "Process" — Minimax reads every document',
    'c3s11.s4': 'Review the auto-generated packet, fix anything weird, ship it',
    'c3s11.note': 'A mobile app is not the only form factor — a web dashboard or a CargoWise plugin would work the same way.',

    // Slide 12 - Tech Stack
    'c3s12.title': 'The Tech Stack',
    'c3s12.desc': 'Three ingredients got us from idea to working prototype in three hours. None of them require deep specialized knowledge — Claude Code did most of the heavy lifting from plain-English prompts.',
    'c3s12.p1.title': 'Expo + React Native',
    'c3s12.p1.desc': 'Cross-platform mobile framework — one codebase runs on iOS, Android, and a simulator on Mac',
    'c3s12.p2.title': 'Minimax (the brain)',
    'c3s12.p2.desc': 'Chinese multimodal model — reads PDFs and Excels, extracts fields, classifies document types',
    'c3s12.p3.title': 'Claude Code (the builder)',
    'c3s12.p3.desc': 'The agent that wrote the code, wired the APIs, and ran it in the simulator — from English prompts',

    // Slide 13 - Workflow Part 1
    'c3s13.title': 'Workflow: Feeding the Beast',
    'c3s13.desc': 'The user experience is intentionally boring — that is the goal. You want the team to not even notice the AI is doing the work.',
    'c3s13.s1': 'User picks a shipment folder with 5-15 documents',
    'c3s13.s2': 'App shows a preview list: file names, sizes, icons',
    'c3s13.s3': 'User taps "Process" — the files are uploaded to Minimax',
    'c3s13.s4': 'A progress bar and a log stream show what the model is doing live',

    // Slide 14 - Minimax Reads Documents
    'c3s14.title': 'Minimax Reads Every Document',
    'c3s14.desc': 'Minimax is where the magic happens. It understands what a PDF says, what columns an Excel has, and what kind of document is in front of it. Watch the log and you can literally see it think in real time.',

    // Slide 15 - Classification
    'c3s15.title': 'Automatic Classification',
    'c3s15.desc': 'With just a handful of examples, Minimax learns to distinguish the six document types that matter for billing. No checkboxes, no folders, no manual sorting.',
    'c3s15.p1.title': 'Invoices',
    'c3s15.p1.desc': 'Main Invoice, Commercial Invoice — the model tells them apart by structure and fields',
    'c3s15.p2.title': 'Customs & ISF',
    'c3s15.p2.desc': 'ISF, customs clearance forms — detected by headers, phrasing, and layout',
    'c3s15.p3.title': 'Logistics',
    'c3s15.p3.desc': 'HBL, MBL, packing lists — recognized by standard field patterns',

    // Slide 16 - Data Extraction
    'c3s16.title': 'Data Extraction',
    'c3s16.desc': 'After classification, the model pulls the fields that matter: customer name, invoice number, booking number, MML number, HBL, MBL. Everything lands in a clean JSON object with a confidence score.',

    // Slide 17 - Output: Packet + Excel
    'c3s17.title': 'The Final Packet',
    'c3s17.desc': 'The app assembles everything into a single billing packet: a folder named after the booking number, with the documents renamed in the right order, plus a summary Excel.',
    'c3s17.p1.title': 'Organized Folder',
    'c3s17.p1.desc': 'Numbered and renamed files in the exact order the Billing Packets team expects',
    'c3s17.p2.title': 'Summary Excel',
    'c3s17.p2.desc': 'Every extracted field in one clean sheet — ready for downstream tools or email',

    // Slide 18 - Backend Options
    'c3s18.title': 'Backend: Convex, Supabase, or Nothing',
    'c3s18.desc': 'If you want the app to be multi-user, save history, or enforce permissions, you need a backend. Good news: today\'s "Backend as a Service" options are stupidly easy — one prompt and Claude Code wires them up.',
    'c3s18.p1.title': 'Convex',
    'c3s18.p1.desc': 'Real-time database + auth + file storage with great TypeScript integration',
    'c3s18.p2.title': 'Supabase',
    'c3s18.p2.desc': 'Postgres under the hood, with auth, storage, and row-level security built in',
    'c3s18.p3.title': 'BetterAuth',
    'c3s18.p3.desc': 'When you just need auth bolted onto an existing backend — clean, modern, open-source',
    'c3s18.note': 'For the demo we skipped the backend entirely — the app ran against a local folder to keep it simple.',

    // Slide 19 - CargoWise + EDI
    'c3s19.title': 'Integrating with CargoWise',
    'c3s19.desc': 'You do not need humans to drop files into the app. CargoWise already uses EDI for automatic events — hook into those triggers and documents can flow in without anyone lifting a finger.',
    'c3s19.s1': 'Configure a CargoWise trigger when a shipment is ready for billing',
    'c3s19.s2': 'The trigger dumps the documents into a OneDrive / SharePoint folder',
    'c3s19.s3': 'The app (or a backend job) watches the folder and auto-processes new shipments',
    'c3s19.s4': 'The finished packet is emailed or posted back — zero manual steps',

    // Slide 20 - Email & Automation
    'c3s20.title': 'Email, Power Automate, Rules',
    'c3s20.desc': 'The final piece is getting the packet where it needs to go. You do not have to build anything fancy — the tools your company already pays for will do it for you.',
    'c3s20.p1.title': 'Outlook Rules',
    'c3s20.p1.desc': 'Auto-save attachments from specific senders to specific folders — zero code',
    'c3s20.p2.title': 'Power Automate',
    'c3s20.p2.desc': 'Route files, trigger flows, notify teams, and move data between systems visually',
    'c3s20.p3.title': 'Resend / Email API',
    'c3s20.p3.desc': 'When you want your app to send the finished packet automatically with one tap',

    // Slide 21 - Built in 3 Hours
    'c3s21.title': 'Built in Three Hours',
    'c3s21.desc': 'Everything you just saw — the mobile app, the classification, the extraction, the organized packet — took three hours to build. Not because the problem is easy, but because the agent does the grunt work while you focus on WHAT to build.',
    'c3s21.key': 'Iterate, iterate, iterate. The first version will not be perfect. Week 1: MVP. Week 2: your team tries it and complains. Week 3: you fix it. Week 4: they cannot imagine going back.',

    // Slide 22 - Automation as Liberation
    'c3s22.title': 'Automation Is Liberation, Not Replacement',
    'c3s22.p1.title': 'The Boring Work Disappears',
    'c3s22.p1.desc': 'Repetitive data entry, renaming files, extracting the same fields — gone',
    'c3s22.p2.title': 'The Creative Work Stays',
    'c3s22.p2.desc': 'Judging edge cases, handling exceptions, improving the system — still human',
    'c3s22.p3.title': 'You Are Still Needed',
    'c3s22.p3.desc': 'The model does not understand context. It classifies. You decide.',
    'c3s22.p4.title': 'Your Role Grows',
    'c3s22.p4.desc': 'From data-entry clerk to process designer — and that is a promotion, not a threat',

    // Slide 23 - Your Team Task
    'c3s23.title': 'Your Team Task',
    'c3s23.desc': 'This week, look at your own workflow. Find ONE repetitive thing you do every day and try to automate it — even if it is small.',
    'c3s23.t1': 'Identify one repetitive task you do every day',
    'c3s23.t2': 'Write it down step-by-step in plain English',
    'c3s23.t3': 'Ask Claude Code or Codex to build a first version',
    'c3s23.t4': 'Run it once, find what\'s wrong, fix it',
    'c3s23.t5': 'Show it to one teammate and get feedback',
    'c3s23.t6': 'Share it in the group chat — we all learn faster together',

    // Slide 24 - Infinite Possibilities
    'c3s24.title': 'Infinite Possibilities',
    'c3s24.p1': 'The Billing Packets Killer is just one example. Every repetitive, document-heavy process in VOC / Harp Audit is an opportunity.',
    'c3s24.p2': 'You do not need to be a developer. You need curiosity, a problem you want to solve, and the willingness to iterate.',
    'c3s24.p3': 'Start this week. Pick one task. Build something. Even if it is ugly, even if it breaks — ship it and iterate.',
    'c3s24.closing': '"I built the Billing Packets Killer in three hours. Imagine what YOU can build if you start today."',

    // ========== SESSION 4: MENTAL MAPS & LOOPS ==========

    // Slide 1 - Title
    'c4s1.title': 'Mental Maps & Loops',
    'c4s1.subtitle': 'From Excalidraw diagrams to running automations — the thinking tool behind every good skill',

    // Slide 2 - Session 3 Recap
    'c4s2.title': 'Where We Left Off',
    'c4s2.desc': 'Last session we built the Billing Packets Killer — a mobile app that reads shipment documents and assembles a billing packet in minutes. Today we go one level deeper: how to THINK about an automation before we write a single prompt.',
    'c4s2.p1.title': 'Fine-Tuning',
    'c4s2.p1.desc': 'We saw how to specialize a general model on a domain with examples and feedback',
    'c4s2.p2.title': 'Open-Source Reality',
    'c4s2.p2.desc': 'Chinese frontier models on GitHub — cheap, fast, and good enough for production',
    'c4s2.p3.title': 'Billing Packets App',
    'c4s2.p3.desc': 'Three hours from idea to working prototype with Expo + Minimax + Claude Code',

    // Slide 3 - Agenda
    'c4s3.title': 'Today\'s Agenda',
    'c4s3.i1': 'The problem with prompting straight from your head',
    'c4s3.i2': 'Excalidraw — a whiteboard the AI can read',
    'c4s3.i3': 'Translating a diagram into a structured prompt',
    'c4s3.i4': 'Demo 1: building /mejor-chiste, a 4-step comedy pipeline',
    'c4s3.i5': 'The delegation pattern — different models for different roles',
    'c4s3.i6': '/loop — turning a skill into a recurring automation',
    'c4s3.i7': 'Demo 2: the arKiller loop — monitoring AR every few hours',
    'c4s3.i8': 'Your homework: map ONE workflow and loop it',

    // Slide 4 - The Thinking Problem
    'c4s4.title': 'The Thinking Problem',
    'c4s4.desc': 'You cannot prompt what you cannot see. When you try to write a prompt straight from your head, you forget steps, skip decisions, and end up with a vague wall of text. The model does its best, but the output is as blurry as the thinking behind it.',
    'c4s4.key': 'A diagram forces you to name every box and every arrow. Once you can see the whole flow, the prompt practically writes itself — because the structure is already there.',

    // Slide 5 - Excalidraw: Your Whiteboard for AI
    'c4s5.title': 'Excalidraw: Your Whiteboard for AI',
    'c4s5.desc': 'Excalidraw is a free, browser-based whiteboard. No install, no login, works on any device. You sketch boxes, arrows, and labels the way you would on paper — then use the diagram as the skeleton of your prompt.',
    'c4s5.p1.title': 'Free & Instant',
    'c4s5.p1.desc': 'Open excalidraw.com and start drawing. No account needed, no data sent anywhere.',
    'c4s5.p2.title': 'Copy-Pasteable',
    'c4s5.p2.desc': 'Export as PNG, SVG, or plain text. Paste into the chat and the model understands it.',
    'c4s5.p3.title': 'Forces Clarity',
    'c4s5.p3.desc': 'If you cannot draw a step, you cannot prompt it. The blank boxes expose the gaps in your thinking.',

    // Slide 6 - From Diagram to Prompt
    'c4s6.title': 'From Diagram to Prompt',
    'c4s6.desc': 'Every well-built skill starts the same way. Draw the flow first, then translate each box into a prompt instruction. Each arrow becomes a dependency, each label becomes a parameter.',
    'c4s6.s1': 'Open Excalidraw and draw the end-to-end flow as boxes and arrows',
    'c4s6.s2': 'Label each box with the action it performs and what it produces',
    'c4s6.s3': 'Paste the diagram into Claude Code and ask it to draft a skill from the flow',
    'c4s6.s4': 'Review, test, iterate — the diagram becomes the spec, the skill becomes the result',

    // Slide 7 - Demo 1: /mejor-chiste
    'c4s7.title': 'Demo 1 — /mejor-chiste',
    'c4s7.desc': 'A 4-step comedy pipeline. Instead of asking one model to write a joke, we delegate to different models for different roles: a generator, a critic, a rewriter, and a judge. The winning joke is appended to a training log we review every morning.',

    // Slide 8 - The Delegation Pattern
    'c4s8.title': 'The Delegation Pattern',
    'c4s8.desc': 'The same principle that makes teams work also applies to AI. Pick the right model for each role. Cheap and fast for brainstorming, careful and structured for critique, expensive and thoughtful for final decisions.',
    'c4s8.p1.title': 'Haiku — The Generator',
    'c4s8.p1.desc': 'Fast, cheap, creative. Perfect for brainstorming raw ideas and rewriting with feedback.',
    'c4s8.p2.title': 'Sonnet — The Critic',
    'c4s8.p2.desc': 'Balanced reasoning. Diagnoses what is wrong without overthinking it. The reviewer role.',
    'c4s8.p3.title': 'Opus — The Judge',
    'c4s8.p3.desc': 'Expensive but deep. Use it sparingly for the highest-stakes decision in the pipeline.',

    // Slide 9 - /loop
    'c4s9.title': '/loop — Recurring Automation',
    'c4s9.desc': 'A skill is a one-shot action. A loop is a skill that runs on a schedule. Once you have a working skill, wrap it in /loop with an interval and it keeps running by itself — as long as your computer stays awake and the session is alive.',

    // Slide 10 - Demo 2: arKiller Loop
    'c4s10.title': 'Demo 2 — The arKiller Loop',
    'c4s10.desc': 'arKiller is the accounts-receivable dashboard on my Desktop. Running it manually once a week is painful — so I turned its daily checks into a loop. Every few hours, the agent reads the latest AR snapshot, updates the board, and flags what needs attention.',
    'c4s10.s1': 'Read the latest Excel aging snapshot from the data folder',
    'c4s10.s2': 'Compare against the previous snapshot and flag any account that aged into a new bucket',
    'c4s10.s3': 'Post the new statuses and open tasks to the arKiller board',
    'c4s10.s4': 'Append a summary line to the log so I can scan the history at a glance',

    // Slide 11 - Your Homework
    'c4s11.title': 'Your Homework',
    'c4s11.desc': 'Pick one workflow you do every day. Open Excalidraw. Draw the boxes. Translate it into a skill. Then wrap it in a loop and let it run while you sleep.',
    'c4s11.t1': 'Pick ONE repetitive task — the smallest one you can think of',
    'c4s11.t2': 'Open excalidraw.com and draw the flow as boxes and arrows',
    'c4s11.t3': 'Paste the diagram into Claude Code and ask for a skill',
    'c4s11.t4': 'Test it once. Fix what is wrong. Test again.',
    'c4s11.t5': 'Wrap it in /loop with an interval that makes sense for your task',

    // Slide 12 - Closing
    'c4s12.title': 'You Already Know Enough',
    'c4s12.desc': 'The hardest part is not the prompting. It is seeing the workflow clearly enough to describe it. Every box you draw is a step you used to do without thinking — and every step you used to do without thinking is now one more thing the machine can do for you.',
    'c4s12.closing': '"If you can draw it, you can prompt it. If you can prompt it, you can loop it. If you can loop it, you own your time back."',

    // Session Feedback Widget
    'feedback.title': 'Your Feedback',
    'feedback.subtitle': 'Help me improve',
    'feedback.progress': 'Question {current} of {total}',
    'feedback.loading': 'Loading…',
    'feedback.thanks': 'Thanks!',
    'feedback.thanksMessage': 'Your feedback shapes how I teach.',
    'feedback.q1': 'How clear is the overall content?',
    'feedback.q1.o1': 'Very clear',
    'feedback.q1.o2': 'Clear',
    'feedback.q1.o3': 'Neutral',
    'feedback.q1.o4': 'Unclear',
    'feedback.q1.o5': 'Very unclear',
    'feedback.q2': 'How is the overall pacing?',
    'feedback.q2.o1': 'Too slow',
    'feedback.q2.o2': 'A bit slow',
    'feedback.q2.o3': 'Just right',
    'feedback.q2.o4': 'A bit fast',
    'feedback.q2.o5': 'Too fast',
    'feedback.q3': 'How engaging is the teaching style?',
    'feedback.q3.o1': 'Very engaging',
    'feedback.q3.o2': 'Engaging',
    'feedback.q3.o3': 'Neutral',
    'feedback.q3.o4': 'Not very',
    'feedback.q3.o5': 'Boring',
    'feedback.q4': 'How useful is the material for your work?',
    'feedback.q4.o1': 'Extremely',
    'feedback.q4.o2': 'Very',
    'feedback.q4.o3': 'Somewhat',
    'feedback.q4.o4': 'Not very',
    'feedback.q4.o5': 'Not at all',
    'feedback.q5': 'Would you recommend these sessions?',
    'feedback.q5.o1': 'Definitely',
    'feedback.q5.o2': 'Probably',
    'feedback.q5.o3': 'Maybe',
    'feedback.q5.o4': 'Probably not',
    'feedback.q5.o5': 'Definitely not',
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

    // ========== SESION 3 — Fine-Tuning y Billing Packets Killer ==========

    // Slide 1 - Title
    'c3s1.title': 'Fine-Tuning y Billing Packets Killer',
    'c3s1.subtitle': 'De modelos open source a una app movil funcionando — hecha en tres horas',

    // Slide 2 - Session 2 Recap
    'c3s2.title': 'Donde Quedamos',
    'c3s2.desc': 'La sesion pasada comparamos modelos, montamos OpenCode y OpenRouter, e hicimos una demo de tracking de contenedores con Chrome DevTools MCP. Hoy damos el siguiente paso: entrenar un modelo para que haga TU trabajo.',
    'c3s2.p1.title': 'Ranking de Modelos',
    'c3s2.p1.desc': 'Aprendimos a comparar benchmarks de inteligencia, codigo y agentico',
    'c3s2.p2.title': 'OpenRouter + OpenCode',
    'c3s2.p2.desc': 'Una sola API key, cualquier proveedor — modelos chinos 10 veces mas baratos',
    'c3s2.p3.title': 'Demo de Tracking',
    'c3s2.p3.desc': 'Codex + Chrome DevTools MCP automatizaron el tracking de contenedores de punta a punta',

    // Slide 3 - Agenda
    'c3s3.title': 'Agenda de Hoy',
    'c3s3.i1': 'Que es fine-tuning y por que importa',
    'c3s3.i2': 'Open source NO significa gratis — las licencias explicadas',
    'c3s3.i3': 'Correr modelos localmente en tu propio hardware',
    'c3s3.i4': 'El lado oscuro: estafas, deepfakes y por que la consciencia gana',
    'c3s3.i5': 'El problema de Billing Packets que queremos resolver',
    'c3s3.i6': 'Demo en vivo: app movil con Expo, React Native y Minimax',
    'c3s3.i7': 'Conectando todo: CargoWise, EDI, automatizacion de correo',
    'c3s3.i8': 'Tu tarea: encuentra TU primer objetivo de automatizacion',

    // Slide 4 - What is Fine-Tuning?
    'c3s4.title': 'Que Es Fine-Tuning?',
    'c3s4.desc': 'Fine-tuning es el proceso de tomar un modelo de proposito general y entrenarlo para que sea experto en una tarea muy especifica. Le das miles de ejemplos, marcas que esta bien y que esta mal, y el modelo se va parametrizando a tu dominio.',
    'c3s4.key': 'Imaginate tomar a un generalista inteligente y entrenarlo durante 10,000 horas solo con billing packets — al final termina reconociendo HBLs, MBLs e ISFs mas rapido que cualquier persona del equipo. Eso es lo que hace el fine-tuning a un modelo.',

    // Slide 5 - Open-Source ≠ Free
    'c3s5.title': 'Open Source NO Significa Gratis',
    'c3s5.desc': 'Open source significa que los pesos del modelo y el codigo de entrenamiento son publicos. Eso es poderoso — pero "open" viene con licencias. Leelas antes de meter un modelo en un producto comercial.',
    'c3s5.p1.title': 'Apache 2.0',
    'c3s5.p1.desc': 'Permisiva — puedes usarla comercialmente, pero debes incluir atribucion y el texto de la licencia',
    'c3s5.p2.title': 'MIT',
    'c3s5.p2.desc': 'Aun mas simple — uso comercial permitido, requisitos minimos, muy liberal',
    'c3s5.p3.title': 'Clausulas de Revenue',
    'c3s5.p3.desc': 'Algunas licencias exigen compartir ingresos por encima de un umbral (ej: $20M ARR). Siempre verifica antes de lanzar',

    // Slide 6 - Chinese Open-Source Revolution
    'c3s6.title': 'La Revolucion Open Source China',
    'c3s6.desc': 'OpenAI tiene "open" en el nombre pero no publica nada. Mientras tanto, los laboratorios chinos suben modelos de nivel frontera a GitHub y dejan que cualquiera los descargue. Eso cambia completamente la economia de la IA para el resto de nosotros.',
    'c3s6.p1.title': 'GLM (Zhipu AI)',
    'c3s6.p1.desc': 'GLM-5 esta en un repo publico de GitHub. Lo descargas, lo corres, le haces fine-tuning — solo pagas la electricidad',
    'c3s6.p2.title': 'Qwen (Alibaba)',
    'c3s6.p2.desc': 'Varios tamanos — desde 3B para laptops hasta 72B para clusters GPU. Compite con GPT',
    'c3s6.p3.title': 'Minimax',
    'c3s6.p3.desc': 'Fuerte modelo multimodal para leer PDFs, imagenes y tablas — exactamente lo que necesitamos para billing',

    // Slide 7 - Running Models Locally
    'c3s7.title': 'Corriendo Modelos En Tu Laptop',
    'c3s7.desc': 'Ya no necesitas una supercomputadora. Los modelos cuantizados modernos corren con 4 o 5 GB de RAM. Una vez que descargas el modelo, corre totalmente en tu maquina — sin internet, sin APIs externas, sin que tus datos salgan del computador.',
    'c3s7.s1': 'Instala Ollama o LM Studio desde su pagina',
    'c3s7.s2': 'Busca modelos con tag "small" o "quantized" (ve los tamanos 4GB, 5GB, 7GB)',
    'c3s7.s3': 'Descarga un modelo — es solo un archivo, como una pelicula',
    'c3s7.s4': 'Corrélo. El primer token te muestra que tu laptop ya es una IA privada',

    // Slide 8 - Power of Fine-Tuning
    'c3s8.title': 'El Poder de la Parametrizacion',
    'c3s8.desc': 'Cuando entiendes fine-tuning, el mundo se ve distinto. Ya no estas limitado a lo que el modelo sabe de fabrica — puedes transferir TU conocimiento, TU proceso, TU criterio a un modelo y dejarlo correr para siempre.',
    'c3s8.quote': '"Puedes pasar todo tu nivel de pensamiento hacia un modelo, y ese modelo te puede replicar. De alguna forma, te vuelves inmortal — lo que sabes deja de morir contigo."',

    // Slide 9 - The Dark Side
    'c3s9.title': 'El Lado Oscuro del Fine-Tuning',
    'c3s9.desc': 'El mismo poder que construye un Billing Packets Killer tambien puede construir estafas, deepfakes y documentos falsos. Si entiendes las herramientas, estas mejor preparado para defender a ti y a tu equipo.',
    'c3s9.p1.title': 'Fraude y Estafas',
    'c3s9.p1.desc': 'Los malos actores ya usan modelos de voz y texto fine-tuneados para suplantar companeros y familiares',
    'c3s9.p2.title': 'Documentos Falsos',
    'c3s9.p2.desc': 'Modelos fine-tuneados pueden generar facturas, IDs y papeleo de embarque falsos muy convincentes',
    'c3s9.p3.title': 'Tu Defensa: Consciencia',
    'c3s9.p3.desc': 'Entre mas entiendas como funcionan estas herramientas, mas dificil es que alguien te enganie con ellas',
    'c3s9.note': 'Mantente informado. Ensenale a tu familia a verificar llamadas inesperadas. La consciencia es el 90% de la defensa.',

    // Slide 10 - The Billing Packets Problem
    'c3s10.title': 'El Problema de Billing Packets',
    'c3s10.desc': 'Cada embarque genera una pila de documentos — commercial invoice, ISF, customs clearance, packing list, main invoice — y el equipo de Billing Packets tiene que abrir cada uno, clasificarlo, extraer campos clave y armar el packet final. Es lento, repetitivo y propenso a errores.',
    'c3s10.p1.title': 'Tipos de Archivo Mezclados',
    'c3s10.p1.desc': 'PDFs, Excels, imagenes escaneadas — cada uno necesita un manejo distinto',
    'c3s10.p2.title': 'Clasificacion Manual',
    'c3s10.p2.desc': 'Un humano decide que es cada documento, lo renombra y lo organiza a mano',
    'c3s10.p3.title': 'Fatiga de Data Entry',
    'c3s10.p3.desc': 'Los mismos campos — cliente, numero de factura, booking, MML — escritos una y otra vez',

    // Slide 11 - The Vision: A Mobile App
    'c3s11.title': 'La Vision: Una App Movil',
    'c3s11.desc': 'Y si cualquiera del equipo de Billing Packets pudiera abrir una app en el celular, apuntarla a una carpeta de un embarque, y recibir un packet organizado en un minuto? Asi funciona el flujo:',
    'c3s11.s1': 'Abrir la app — iniciar sesion como Camilo, Geraldine, Brian, el que sea',
    'c3s11.s2': 'Escoger la carpeta del embarque (descargada de CargoWise)',
    'c3s11.s3': 'Darle a "Procesar" — Minimax lee todos los documentos',
    'c3s11.s4': 'Revisar el packet auto-generado, arreglar lo raro, y enviarlo',
    'c3s11.note': 'Una app movil no es el unico formato — un dashboard web o un plugin de CargoWise funcionarian igual.',

    // Slide 12 - Tech Stack
    'c3s12.title': 'El Stack Tecnico',
    'c3s12.desc': 'Tres ingredientes nos llevaron de la idea a un prototipo funcionando en tres horas. Ninguno requiere conocimiento tecnico profundo — Claude Code hizo casi todo el trabajo pesado desde prompts en ingles simple.',
    'c3s12.p1.title': 'Expo + React Native',
    'c3s12.p1.desc': 'Framework movil multiplataforma — un solo codigo corre en iOS, Android, y un simulador en Mac',
    'c3s12.p2.title': 'Minimax (el cerebro)',
    'c3s12.p2.desc': 'Modelo multimodal chino — lee PDFs y Excels, extrae campos, clasifica tipos de documento',
    'c3s12.p3.title': 'Claude Code (el constructor)',
    'c3s12.p3.desc': 'El agente que escribio el codigo, conecto las APIs y lo corrio en el simulador — desde prompts en ingles',

    // Slide 13 - Workflow Part 1
    'c3s13.title': 'Flujo: Alimentando la Bestia',
    'c3s13.desc': 'La experiencia del usuario es intencionalmente aburrida — ese es el objetivo. Queremos que el equipo ni se de cuenta de que hay IA haciendo el trabajo.',
    'c3s13.s1': 'El usuario escoge una carpeta de embarque con 5 a 15 documentos',
    'c3s13.s2': 'La app muestra una lista: nombres de archivo, tamanos, iconos',
    'c3s13.s3': 'El usuario toca "Procesar" — los archivos suben a Minimax',
    'c3s13.s4': 'Una barra de progreso y un log muestran lo que el modelo esta haciendo en vivo',

    // Slide 14 - Minimax Reads Documents
    'c3s14.title': 'Minimax Lee Cada Documento',
    'c3s14.desc': 'Aqui esta la magia. Minimax entiende lo que dice un PDF, que columnas tiene un Excel, y que tipo de documento tiene al frente. Si ves el log, literalmente puedes ver al modelo pensar en tiempo real.',

    // Slide 15 - Classification
    'c3s15.title': 'Clasificacion Automatica',
    'c3s15.desc': 'Con solo un punado de ejemplos, Minimax aprende a distinguir los seis tipos de documento que importan para billing. Sin checkboxes, sin carpetas, sin organizar a mano.',
    'c3s15.p1.title': 'Facturas',
    'c3s15.p1.desc': 'Main Invoice, Commercial Invoice — el modelo las distingue por estructura y campos',
    'c3s15.p2.title': 'Customs e ISF',
    'c3s15.p2.desc': 'ISF, formularios de customs — detectados por los headers, la redaccion y el layout',
    'c3s15.p3.title': 'Logistica',
    'c3s15.p3.desc': 'HBL, MBL, packing lists — reconocidos por patrones estandar de campos',

    // Slide 16 - Data Extraction
    'c3s16.title': 'Extraccion de Datos',
    'c3s16.desc': 'Despues de clasificar, el modelo saca los campos que importan: nombre del cliente, numero de factura, numero de booking, numero de MML, HBL, MBL. Todo llega a un JSON limpio con un score de confianza.',

    // Slide 17 - Output: Packet + Excel
    'c3s17.title': 'El Packet Final',
    'c3s17.desc': 'La app arma todo en un solo billing packet: una carpeta nombrada con el booking number, con los documentos renombrados en el orden correcto, mas un Excel de resumen.',
    'c3s17.p1.title': 'Carpeta Organizada',
    'c3s17.p1.desc': 'Archivos numerados y renombrados en el orden exacto que espera el equipo de Billing Packets',
    'c3s17.p2.title': 'Excel de Resumen',
    'c3s17.p2.desc': 'Cada campo extraido en una sola hoja limpia — lista para herramientas o correo',

    // Slide 18 - Backend Options
    'c3s18.title': 'Backend: Convex, Supabase o Nada',
    'c3s18.desc': 'Si quieres que la app sea multi-usuario, guarde historial o aplique permisos, necesitas un backend. Buenas noticias: los "Backend as a Service" de hoy son ridiculamente faciles — un solo prompt y Claude Code los conecta.',
    'c3s18.p1.title': 'Convex',
    'c3s18.p1.desc': 'Base de datos en tiempo real + auth + storage de archivos con gran integracion de TypeScript',
    'c3s18.p2.title': 'Supabase',
    'c3s18.p2.desc': 'Postgres por debajo, con auth, storage y seguridad a nivel de fila incluidos',
    'c3s18.p3.title': 'BetterAuth',
    'c3s18.p3.desc': 'Cuando solo necesitas auth encima de un backend existente — limpio, moderno, open source',
    'c3s18.note': 'En la demo nos saltamos el backend por completo — la app corrio contra una carpeta local para mantenerlo simple.',

    // Slide 19 - CargoWise + EDI
    'c3s19.title': 'Integrando con CargoWise',
    'c3s19.desc': 'No necesitas humanos soltando archivos en la app. CargoWise ya usa EDI para eventos automaticos — engancha esos triggers y los documentos pueden entrar solos sin que nadie mueva un dedo.',
    'c3s19.s1': 'Configura un trigger en CargoWise cuando un embarque este listo para billing',
    'c3s19.s2': 'El trigger deja los documentos en una carpeta de OneDrive / SharePoint',
    'c3s19.s3': 'La app (o un job en el backend) vigila la carpeta y procesa nuevos embarques',
    'c3s19.s4': 'El packet terminado se envia por correo o se publica de vuelta — cero pasos manuales',

    // Slide 20 - Email & Automation
    'c3s20.title': 'Correo, Power Automate, Reglas',
    'c3s20.desc': 'La ultima pieza es llevar el packet a donde tiene que ir. No tienes que construir nada sofisticado — las herramientas que tu empresa ya paga lo hacen por ti.',
    'c3s20.p1.title': 'Reglas de Outlook',
    'c3s20.p1.desc': 'Guarda adjuntos de remitentes especificos en carpetas especificas — sin escribir codigo',
    'c3s20.p2.title': 'Power Automate',
    'c3s20.p2.desc': 'Rutea archivos, dispara flujos, notifica equipos y mueve datos entre sistemas visualmente',
    'c3s20.p3.title': 'Resend / Email API',
    'c3s20.p3.desc': 'Cuando quieres que tu app mande el packet terminado automaticamente con un toque',

    // Slide 21 - Built in 3 Hours
    'c3s21.title': 'Hecho en Tres Horas',
    'c3s21.desc': 'Todo lo que acabas de ver — la app movil, la clasificacion, la extraccion, el packet organizado — tomo tres horas. No porque el problema sea facil, sino porque el agente hace el trabajo pesado mientras tu te enfocas en QUE construir.',
    'c3s21.key': 'Iterar, iterar, iterar. La primera version no va a ser perfecta. Semana 1: MVP. Semana 2: tu equipo la prueba y se queja. Semana 3: la arreglas. Semana 4: no se imaginan vivir sin ella.',

    // Slide 22 - Automation as Liberation
    'c3s22.title': 'La Automatizacion Es Liberacion, No Reemplazo',
    'c3s22.p1.title': 'El Trabajo Aburrido Desaparece',
    'c3s22.p1.desc': 'Data entry repetitivo, renombrar archivos, extraer los mismos campos — se va',
    'c3s22.p2.title': 'El Trabajo Creativo Se Queda',
    'c3s22.p2.desc': 'Juzgar casos raros, manejar excepciones, mejorar el sistema — sigue siendo humano',
    'c3s22.p3.title': 'Seguimos Necesitandote',
    'c3s22.p3.desc': 'El modelo no entiende contexto. Clasifica. Tu decides.',
    'c3s22.p4.title': 'Tu Rol Crece',
    'c3s22.p4.desc': 'De data entry a disenador de procesos — y eso es un ascenso, no una amenaza',

    // Slide 23 - Your Team Task
    'c3s23.title': 'Tu Tarea del Equipo',
    'c3s23.desc': 'Esta semana, mira tu propio flujo de trabajo. Encuentra UNA cosa repetitiva que hagas todos los dias e intenta automatizarla — aunque sea pequena.',
    'c3s23.t1': 'Identifica una tarea repetitiva que hagas todos los dias',
    'c3s23.t2': 'Escribela paso a paso en espanol simple',
    'c3s23.t3': 'Pidele a Claude Code o Codex que arme una primera version',
    'c3s23.t4': 'Correla una vez, encuentra que esta mal y arreglala',
    'c3s23.t5': 'Muestrasela a un companero y recibe feedback',
    'c3s23.t6': 'Compartela en el chat — aprendemos mas rapido en equipo',

    // Slide 24 - Infinite Possibilities
    'c3s24.title': 'Posibilidades Infinitas',
    'c3s24.p1': 'El Billing Packets Killer es solo un ejemplo. Cada proceso repetitivo lleno de documentos en VOC / Harp Audit es una oportunidad.',
    'c3s24.p2': 'No necesitas ser desarrollador. Necesitas curiosidad, un problema que quieras resolver y la voluntad de iterar.',
    'c3s24.p3': 'Empieza esta semana. Escoge una tarea. Construye algo. Aunque sea feo, aunque se rompa — sacalo e itera.',
    'c3s24.closing': '"Hice el Billing Packets Killer en tres horas. Imaginate lo que TU puedes construir si empiezas hoy."',

    // ========== SESSION 4: MAPAS MENTALES Y LOOPS ==========

    // Slide 1 - Title
    'c4s1.title': 'Mapas Mentales y Loops',
    'c4s1.subtitle': 'Desde diagramas de Excalidraw hasta automatizaciones corriendo — la herramienta de pensamiento detras de cada buena skill',

    // Slide 2 - Session 3 Recap
    'c4s2.title': 'Donde Lo Dejamos',
    'c4s2.desc': 'La sesion pasada construimos el Billing Packets Killer — una app movil que lee documentos de embarque y arma el paquete de facturacion en minutos. Hoy vamos un nivel mas profundo: como PENSAR una automatizacion antes de escribir un solo prompt.',
    'c4s2.p1.title': 'Fine-Tuning',
    'c4s2.p1.desc': 'Vimos como especializar un modelo general en un dominio con ejemplos y feedback',
    'c4s2.p2.title': 'Realidad Open-Source',
    'c4s2.p2.desc': 'Modelos chinos de frontera en GitHub — baratos, rapidos y suficientemente buenos para produccion',
    'c4s2.p3.title': 'Billing Packets App',
    'c4s2.p3.desc': 'Tres horas de la idea a prototipo funcional con Expo + Minimax + Claude Code',

    // Slide 3 - Agenda
    'c4s3.title': 'Agenda de Hoy',
    'c4s3.i1': 'El problema de promptear directo desde la cabeza',
    'c4s3.i2': 'Excalidraw — un pizarron que la IA puede leer',
    'c4s3.i3': 'Traducir un diagrama en un prompt estructurado',
    'c4s3.i4': 'Demo 1: construir /mejor-chiste, un pipeline de comedia de 4 pasos',
    'c4s3.i5': 'El patron de delegacion — modelos distintos para roles distintos',
    'c4s3.i6': '/loop — convertir una skill en una automatizacion recurrente',
    'c4s3.i7': 'Demo 2: el loop de arKiller — monitorear AR cada pocas horas',
    'c4s3.i8': 'Tu tarea: mapea UN flujo y ponelo en loop',

    // Slide 4 - The Thinking Problem
    'c4s4.title': 'El Problema del Pensamiento',
    'c4s4.desc': 'No podes promptear lo que no podes ver. Cuando tratas de escribir un prompt directo desde la cabeza, te olvidas pasos, saltas decisiones y terminas con un muro de texto vago. El modelo hace lo mejor que puede, pero la salida es tan borrosa como el pensamiento detras.',
    'c4s4.key': 'Un diagrama te obliga a nombrar cada caja y cada flecha. Una vez que ves el flujo completo, el prompt practicamente se escribe solo — porque la estructura ya esta ahi.',

    // Slide 5 - Excalidraw: Your Whiteboard for AI
    'c4s5.title': 'Excalidraw: Tu Pizarron para IA',
    'c4s5.desc': 'Excalidraw es un pizarron gratuito que corre en el navegador. Sin instalacion, sin login, funciona en cualquier dispositivo. Dibujas cajas, flechas y etiquetas como si fuera papel — y despues usas el diagrama como esqueleto del prompt.',
    'c4s5.p1.title': 'Gratis e Instantaneo',
    'c4s5.p1.desc': 'Abre excalidraw.com y empieza a dibujar. Sin cuenta, sin datos enviados a ningun lado.',
    'c4s5.p2.title': 'Copia-Pegable',
    'c4s5.p2.desc': 'Exporta como PNG, SVG o texto plano. Lo pegas en el chat y el modelo lo entiende.',
    'c4s5.p3.title': 'Fuerza Claridad',
    'c4s5.p3.desc': 'Si no podes dibujar un paso, no podes promptearlo. Las cajas vacias exponen los huecos en tu pensamiento.',

    // Slide 6 - From Diagram to Prompt
    'c4s6.title': 'Del Diagrama al Prompt',
    'c4s6.desc': 'Cada skill bien construida empieza igual. Dibuja el flujo primero, despues traduce cada caja en una instruccion del prompt. Cada flecha es una dependencia, cada etiqueta es un parametro.',
    'c4s6.s1': 'Abre Excalidraw y dibuja el flujo de principio a fin con cajas y flechas',
    'c4s6.s2': 'Etiqueta cada caja con la accion que ejecuta y lo que produce',
    'c4s6.s3': 'Pega el diagrama en Claude Code y pedile que arme una skill desde el flujo',
    'c4s6.s4': 'Revisa, prueba, itera — el diagrama es la especificacion, la skill es el resultado',

    // Slide 7 - Demo 1: /mejor-chiste
    'c4s7.title': 'Demo 1 — /mejor-chiste',
    'c4s7.desc': 'Un pipeline de comedia de 4 pasos. En lugar de pedirle a un solo modelo que escriba un chiste, delegamos a modelos distintos para roles distintos: un generador, un critico, un reescritor y un juez. El chiste ganador se agrega a un log de entrenamiento que reviso cada manana.',

    // Slide 8 - The Delegation Pattern
    'c4s8.title': 'El Patron de Delegacion',
    'c4s8.desc': 'El mismo principio que hace funcionar a un equipo tambien aplica a la IA. Escoge el modelo correcto para cada rol. Barato y rapido para tormenta de ideas, cuidadoso y estructurado para critica, caro y reflexivo para decisiones finales.',
    'c4s8.p1.title': 'Haiku — El Generador',
    'c4s8.p1.desc': 'Rapido, barato, creativo. Perfecto para tormenta de ideas en crudo y reescribir con feedback.',
    'c4s8.p2.title': 'Sonnet — El Critico',
    'c4s8.p2.desc': 'Razonamiento balanceado. Diagnostica que esta mal sin pensarlo de mas. El rol de revisor.',
    'c4s8.p3.title': 'Opus — El Juez',
    'c4s8.p3.desc': 'Caro pero profundo. Usalo con moderacion para la decision mas importante del pipeline.',

    // Slide 9 - /loop
    'c4s9.title': '/loop — Automatizacion Recurrente',
    'c4s9.desc': 'Una skill es una accion de una sola vez. Un loop es una skill que corre en un horario. Una vez que tenes una skill que funciona, envolvela en /loop con un intervalo y se ejecuta sola — mientras la computadora este despierta y la sesion viva.',

    // Slide 10 - Demo 2: arKiller Loop
    'c4s10.title': 'Demo 2 — El Loop de arKiller',
    'c4s10.desc': 'arKiller es el dashboard de cuentas por cobrar en mi Desktop. Correrlo manualmente una vez por semana es doloroso — asi que converti los chequeos diarios en un loop. Cada pocas horas, el agente lee el ultimo snapshot de AR, actualiza el board y marca lo que necesita atencion.',
    'c4s10.s1': 'Lee el ultimo snapshot de aging en Excel desde la carpeta de datos',
    'c4s10.s2': 'Compara contra el snapshot anterior y marca cualquier cuenta que avanzo a un bucket nuevo',
    'c4s10.s3': 'Publica los estados nuevos y las tareas abiertas en el board de arKiller',
    'c4s10.s4': 'Agrega una linea de resumen al log para escanear la historia de un vistazo',

    // Slide 11 - Your Homework
    'c4s11.title': 'Tu Tarea',
    'c4s11.desc': 'Escoge un flujo que hagas todos los dias. Abre Excalidraw. Dibuja las cajas. Traducilo en una skill. Despues envolvela en un loop y dejala correr mientras dormis.',
    'c4s11.t1': 'Escoge UNA tarea repetitiva — la mas chica que se te ocurra',
    'c4s11.t2': 'Abre excalidraw.com y dibuja el flujo como cajas y flechas',
    'c4s11.t3': 'Pega el diagrama en Claude Code y pedi una skill',
    'c4s11.t4': 'Probala una vez. Arregla lo que esta mal. Probala de nuevo.',
    'c4s11.t5': 'Envolvela en /loop con un intervalo que tenga sentido para tu tarea',

    // Slide 12 - Closing
    'c4s12.title': 'Ya Sabes Suficiente',
    'c4s12.desc': 'La parte mas dificil no es el prompting. Es ver el flujo con suficiente claridad para describirlo. Cada caja que dibujas es un paso que antes hacias sin pensar — y cada paso que hacias sin pensar es una cosa mas que la maquina puede hacer por vos.',
    'c4s12.closing': '"Si lo podes dibujar, lo podes promptear. Si lo podes promptear, lo podes poner en loop. Si lo podes poner en loop, recuperas tu tiempo."',

    // Session Feedback Widget
    'feedback.title': 'Tu Feedback',
    'feedback.subtitle': 'Ayudame a mejorar',
    'feedback.progress': 'Pregunta {current} de {total}',
    'feedback.loading': 'Cargando…',
    'feedback.thanks': 'Gracias!',
    'feedback.thanksMessage': 'Tu feedback da forma a como ensenio.',
    'feedback.q1': 'Que tan claro es el contenido en general?',
    'feedback.q1.o1': 'Muy claro',
    'feedback.q1.o2': 'Claro',
    'feedback.q1.o3': 'Neutral',
    'feedback.q1.o4': 'Poco claro',
    'feedback.q1.o5': 'Nada claro',
    'feedback.q2': 'Como es el ritmo en general?',
    'feedback.q2.o1': 'Muy lento',
    'feedback.q2.o2': 'Algo lento',
    'feedback.q2.o3': 'Justo',
    'feedback.q2.o4': 'Algo rapido',
    'feedback.q2.o5': 'Muy rapido',
    'feedback.q3': 'Que tan entretenido es el estilo de ensenianza?',
    'feedback.q3.o1': 'Muy entretenido',
    'feedback.q3.o2': 'Entretenido',
    'feedback.q3.o3': 'Neutral',
    'feedback.q3.o4': 'Poco',
    'feedback.q3.o5': 'Aburrido',
    'feedback.q4': 'Que tan util es el material para tu trabajo?',
    'feedback.q4.o1': 'Muchisimo',
    'feedback.q4.o2': 'Mucho',
    'feedback.q4.o3': 'Algo',
    'feedback.q4.o4': 'Poco',
    'feedback.q4.o5': 'Nada',
    'feedback.q5': 'Recomendarias estas sesiones?',
    'feedback.q5.o1': 'Sin duda',
    'feedback.q5.o2': 'Probablemente',
    'feedback.q5.o3': 'Tal vez',
    'feedback.q5.o4': 'Probablemente no',
    'feedback.q5.o5': 'Para nada',
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
