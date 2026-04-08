export interface PresentationResource {
  name: string;
  type: 'presentation' | 'document' | 'tool' | 'link';
  icon: string;
  description: string;
  action: string;
}

export interface PresentationFolder {
  id: string;
  name: string;
  icon: string;
  color: string;
  resources: PresentationResource[];
}

export const presentationDocuments: Record<string, string> = {
  'install-checklist': `AI Tools Installation Checklist
================================

BROWSER
[ ] 1. Download and install Brave from brave.com
    - Install and set as default browser
    - Verify ad blocking works on YouTube

TERMINAL
[ ] 2. Download and install Warp from warp.dev
    - Open the downloaded file
    - Drag to Applications (Mac) or run installer (Windows)
    - Launch and sign in (work email is fine)

AI TOOLS
[ ] 3. Install Claude Code
    - Option A: Run in terminal: npm install -g @anthropic-ai/claude-code
    - Option B: Ask Warp AI agent to install it for you
    - Verify: claude --version

[ ] 4. Install Codex
    - Run: npm install -g codex
    - Verify: codex --help

CONFIGURATION
[ ] 5. Configure Claude Code
    - Run: claude
    - Complete browser authentication
    - Trust the working folder
    - Optional: claude --dangerously-skip-permissions

HOMEWORK
[ ] 6. Create a custom skill
    - Think of a repetitive task you do daily
    - Ask the agent to create a skill for it
    - Test it with /your-skill-name`,

  'workshop-notes': `Workshop Notes: AI Tools & Agents - Session 1
===============================================

Key Concepts:
- AI is NOT just a chat (ChatGPT/Claude web) - that mindset is stuck in 2022
- AI is a MULTIPLIER of YOUR knowledge - the better your context, the better the results
- Agentic AI = models that work inside your computer, creating/modifying files directly
- Folders = workspace context for the agent (navigate to the right folder first)
- Files stay on YOUR computer (unlike web-based AI that needs copy-paste)

Tools Covered:
- Brave Browser: replaces Chrome, less RAM, ad blocking, Tor, privacy
- Warp Terminal: AI-powered terminal wrapper with free credits
- Claude Code (Anthropic): agentic CLI that works in your terminal
- Codex (OpenAI): alternative agentic CLI for code and tasks

Key Features Demonstrated:
- Creating folder structures from natural language
- Generating Excel files with specific headers and data
- Skills: reusable custom commands (/generar-excel)
- Multiple agents running simultaneously (Claude Code + Codex)
- Loops: /loop 24h /command for recurring automation
- MCPs: connecting to Slack, Linear, Telegram (next session)

Important Advice:
- Use ENGLISH for prompting (better results than Spanish)
- Document your daily instructions step by step
- Don't be afraid to experiment - you won't break anything
- Start by converting your repetitive tasks into AI commands

Common Issues:
- If npm install fails, try with sudo or fix Node.js permissions
- Authentication tokens expire - re-run 'claude' to refresh
- Use Node.js v18+ for best compatibility
- Older computers may be slower (TPU limitations) - be patient`,

  'quick-reference': `Quick Reference Card
====================

BRAVE BROWSER
  Download: brave.com
  Why: Less RAM, ad blocking, privacy, Tor

WARP TERMINAL
  Download: warp.dev
  AI Panel: Ctrl+Enter
  Key Feature: Free AI credits, smart autocomplete

CLAUDE CODE (Anthropic)
  Install: npm install -g @anthropic-ai/claude-code
  Run: claude
  Skip permissions: claude --dangerously-skip-permissions
  Create skill: "Create a skill that does X"
  Run skill: /skill-name

CODEX (OpenAI)
  Install: npm install -g codex
  Run: codex "your prompt"
  Browser MCP: can open and interact with web pages

TERMINAL BASICS
  List files: ls (Mac) / dir (Windows)
  Enter folder: cd foldername
  Go back: cd ..
  Create folder: mkdir foldername

AUTOMATION
  Create loop: /loop 24h /your-skill
  Session duration: ~7 days
  Requirement: computer must be on

SKILLS CREATED IN SESSION
  /generar-excel: Creates weekly folders with Excel files

NEXT SESSION TOPICS
  - MCPs (Model Context Protocol)
  - Connecting to Slack, Linear, Telegram
  - Browser automation with Codex`,

  // ========== SESSION 2 DOCUMENTS ==========

  's2-workshop-notes': `Workshop Notes: AI Models & Tracking Demo - Session 2
=====================================================

Key Concepts:
- AI models are like literal friends trained through data + human feedback
- Three key indices: Intelligence, Code, Agentic — different models excel at different things
- Chinese models are disrupting the market: 10x cheaper, open source, competitive quality
- Token economics: input (what you send), output (what you get), cache (conversation history)
- Usage limits reset every 5 hours with weekly caps on both Claude Code and Codex

Model Rankings (as of session date):
- Intelligence: Gemini 3.1 Pro leads
- Code: GPT 5.4 leads (very close competition)
- Agentic: Claude & GPT lead, but Chinese models (Xiaomi, Minimax, Alibaba, DeepSeek) are catching up fast

Tools Covered:
- OpenCode: multi-model harness, works with any AI provider (not just Anthropic or OpenAI)
- OpenRouter: unified API key for all model providers, free tier available
- Chrome DevTools MCP: Google's protocol for AI-controlled browser automation

Pricing Context:
- Opus 4.6: ~$150 per 1M tokens (input and output)
- $200/month plan gives ~$5,000 worth of subsidized tokens (25x value)
- Chinese models: roughly 10x cheaper for equivalent performance
- Free options exist: Qwen 3.6, NVIDIA NemoTron, Gema 4 (through OpenRouter)

Important Advice:
- ALWAYS set spending limits on API keys (exposed keys = massive unexpected bills)
- Prompt in English for better results (models trained primarily on English data)
- The value is shifting from what you know to what you can create
- "The illiterate of this century are those who cannot learn, unlearn, and relearn" — Alvin Toffler

Demo Highlights:
- Tracking Killer: AI + Chrome DevTools MCP to automatically track shipping containers
- Entered container numbers on TrackTrace, extracted ETA/location/status
- Created Excel with results including smart notes for unavailable containers
- Limitations: CAPTCHAs and Cloudflare can block automated browsers`,

  's2-quick-reference': `Quick Reference Card - Session 2
=================================

AI MODEL BENCHMARKS
  Artificial Analysis: artificialanalysis.ai
  Intelligence leader: Gemini 3.1 Pro
  Code leader: GPT 5.4
  Agentic leader: Claude / GPT (Chinese models close behind)

USAGE LIMITS
  Claude Code: claude /usage
  Codex: codex stats
  Reset cycle: every 5 hours
  Weekly limit: depends on plan ($20/$100/$200)

OPENCODE
  Install: npm install -g opencode (or ask Warp)
  Run: opencode
  Auth: opencode auth login
  Models: supports all providers (OpenAI, Anthropic, OpenRouter, etc.)

OPENROUTER
  Website: openrouter.ai
  Purpose: one API key for all model providers
  Free models: look for "free" tags
  IMPORTANT: always set spending limits on API keys

CONNECTING OPENROUTER TO OPENCODE
  1. Create account at openrouter.ai
  2. Go to Settings > Keys > Create Key
  3. Set spending limit (e.g., $10/month)
  4. Copy the API key
  5. Run: opencode auth login
  6. Select: OpenRouter
  7. Paste key, press Enter

FREE MODELS TO TRY
  - Qwen 3.6 (through OpenCode/Zen)
  - Gema 4 31B (through OpenRouter)
  - NVIDIA NemoTron (through OpenRouter)
  - Various "free" tagged models rotate in/out

CHROME DEVTOOLS MCP
  Blog: developer.chrome.com (search "Chrome DevTools MCP")
  Purpose: lets AI control Google Chrome
  Works with: Codex, OpenCode (any agent with MCP support)
  Limitations: CAPTCHAs, Cloudflare protection

MODEL CATEGORIES (OpenRouter)
  Finance: Chinese models lead (first one often free)
  Marketing: Chinese models dominate, Minimax 2.7 for images
  Video: Minimax leads (better than Gemini)

TOKEN PRICING EXAMPLE (Opus 4.6)
  Input: ~$150 per 1M tokens
  Output: ~$150 per 1M tokens
  $200/month plan ≈ $5,000 in subsidized value`,

  // ========== SESSION 3 DOCUMENTS ==========

  's3-workshop-notes': `Workshop Notes: Fine-Tuning & Billing Packets Killer - Session 3
==================================================================

Key Concepts:
- Fine-tuning = taking a general model and making it an expert on YOUR specific task
- Open source does NOT mean free — licenses (Apache, MIT) may have revenue clauses
- Chinese labs publish frontier models on GitHub; OpenAI publishes almost nothing
- Local models run on 4-5 GB of RAM with no internet — your laptop is already a private AI
- You can transfer your knowledge to a model and have it "replicate" you
- Automation is liberation, not replacement — it removes boring work, not jobs

Models & Tools Covered:
- GLM-5 (Zhipu AI): available as open-source weights on a public GitHub repo
- Qwen (Alibaba): multiple sizes, runs locally, competitive with GPT
- Minimax: Chinese multimodal model — star of the Billing Packets demo
- Ollama / LM Studio: local runners for open-source models
- Expo + React Native: used to build the Billing Packets mobile app
- Claude Code: the agent that wrote 100% of the app code from English prompts
- Convex / Supabase / BetterAuth: backend-as-a-service options

The Billing Packets Killer Demo:
- Problem: team manually opens 5-15 documents per shipment (PDFs, Excels), classifies them
  (ISF, Commercial Invoice, Customs, Packing List, Main Invoice, HBL, MBL), and extracts
  the same fields over and over (customer, invoice number, booking number, MML)
- Solution: a mobile app where the user picks a folder and taps "Process"
- Under the hood: Minimax reads every file, classifies it, extracts fields into JSON
- Output: an organized folder (renamed + numbered files) plus a summary Excel
- Build time: 3 hours, start to finish, with Claude Code doing all the coding
- Next steps: iterate for a week with real team feedback, then wire up CargoWise (EDI) +
  OneDrive + email rules so the whole pipeline is hands-free

Advice & Reflections:
- Start with what you have — Minimax is cheap, local models are free, Claude Code is the
  builder you already have
- Think beyond the mobile app — web dashboards, CargoWise plugins, or batch API jobs may
  fit some teams better
- Iterate fast: Week 1 = MVP, Week 2 = complaints, Week 3 = fix, Week 4 = indispensable
- Be aware of the dark side: fine-tuned models enable scams, deepfakes, and fake docs.
  The best defense is understanding how they work.
- "You can transfer your entire way of thinking to a model, and that model can replicate you.
  In a way, you become immortal — the things you know stop dying with you."

Common Pitfalls:
- Don't assume open source = free-to-use commercially. Check the license first.
- Don't skip the backend discussion if you need multi-user, history, or permissions.
- Don't try to ship a perfect v1. Iterate with real users of your own team.
- Don't train models on sensitive client data without understanding privacy implications.`,

  's3-quick-reference': `Quick Reference Card - Session 3
=================================

FINE-TUNING BASICS
  What it is: taking a general model and training it on YOUR task
  Input: lots of labeled examples + human feedback
  Output: a specialized model that excels at your specific use case
  Cost: electricity if local, or a few dollars per run on hosted services

OPEN-SOURCE LICENSES
  Apache 2.0: permissive, attribution required
  MIT: very permissive, minimal requirements
  Custom: watch for revenue clauses (e.g., >$20M ARR triggers royalties)
  RULE: always read the LICENSE file before deploying commercially

LOCAL MODELS
  Ollama: easiest runner — ollama.com
  LM Studio: GUI for browsing + running models
  Recommended small models (4-5 GB RAM):
    - qwen2.5-coder:7b
    - gemma3:4b
    - llama3.2:3b
  Once downloaded, runs entirely offline

BILLING PACKETS APP STACK
  Framework: Expo + React Native (mobile, cross-platform)
  AI Model: Minimax (document reading + classification)
  Builder: Claude Code (all code from English prompts)
  Backend (optional): Convex, Supabase, or BetterAuth
  Build time: ~3 hours for working prototype

DOCUMENT TYPES CLASSIFIED
  - Main Invoice
  - Commercial Invoice
  - ISF (Import Security Filing)
  - Customs Clearance
  - Packing List
  - HBL (House Bill of Lading)
  - MBL (Master Bill of Lading)

FIELDS EXTRACTED
  - Customer name
  - Invoice number
  - Booking number
  - MML number
  - HBL / MBL identifiers
  - Confidence score

CARGOWISE INTEGRATION
  Trigger: EDI event when shipment is ready for billing
  Destination: OneDrive / SharePoint folder
  Watcher: app or backend job detects new folder
  Output: processed packet emailed or posted back

EMAIL AUTOMATION OPTIONS
  Outlook Rules: auto-save attachments to folders (no code)
  Power Automate: visual flows across Microsoft 365
  Resend: email API for apps sending finished packets

ITERATION RHYTHM
  Week 1: Ship the ugliest possible MVP
  Week 2: Let the team use it and complain
  Week 3: Fix the top 3 complaints
  Week 4: Watch them refuse to go back`,

  's3-billing-packets-guide': `Billing Packets Killer — Build Guide
=====================================

WHAT WE ARE BUILDING
A mobile app where anyone on the Billing Packets team can point at a folder of shipment
documents and receive a fully organized billing packet in under a minute. The app reads
each document, classifies it, extracts key fields, and assembles a final packet.

THE PAIN POINT
Today, the Billing Packets team manually:
  1. Downloads a shipment's documents from CargoWise
  2. Opens each PDF / Excel to figure out what it is
  3. Renames files with a standard convention
  4. Copies the customer name, invoice number, booking, MML into a template
  5. Assembles the final packet
  6. Sends it to the client

This takes 30-60 minutes per shipment. We want to get it under 5.

THE FLOW
  User → opens app
  User → picks shipment folder (from CargoWise download)
  App → sends each file to Minimax
  Minimax → classifies + extracts fields
  App → assembles organized packet + summary Excel
  User → reviews, fixes anything weird, taps "Send"

THE STACK
  Mobile: Expo + React Native (1 codebase, iOS + Android + Mac simulator)
  Model: Minimax (Chinese multimodal, cheap, great at PDFs + Excels)
  Agent: Claude Code (wrote all the code from English prompts)
  Backend (optional): Convex, Supabase, or BetterAuth for multi-user + history

HIGH-LEVEL IMPLEMENTATION STEPS
  1. npx create-expo-app billing-packets
  2. Ask Claude Code to scaffold the screens: Login → Folder Picker → Processing → Review
  3. Integrate the Minimax API (or swap for Qwen via OpenRouter for cheaper)
  4. Prompt the model with each file + a short taxonomy of the 7 document types
  5. Store extracted JSON in state; render the review screen
  6. On "Send", generate the organized folder + summary Excel
  7. Optional: wire Resend or a backend to email the packet to the client

DOCUMENT TAXONOMY PROMPT (EXAMPLE)
  You are an assistant for a logistics billing team. Classify the attached document as
  exactly one of: main_invoice, commercial_invoice, isf, customs_clearance, packing_list,
  hbl, mbl, unknown. Then extract these fields if present: customer, invoice_number,
  booking_number, mml_number, hbl_number, mbl_number. Return JSON only.

INTEGRATION: CARGOWISE + EDI
  CargoWise triggers EDI events when a shipment is ready for billing. Configure one to
  drop the shipment documents into a OneDrive / SharePoint folder. A backend job (or the
  app) watches that folder and auto-processes anything new. The finished packet goes
  back out via email or gets posted to a shared drive.

INTEGRATION: EMAIL AUTOMATION
  - Outlook rules: auto-save email attachments to specific folders
  - Power Automate: visually wire email → folder → app → reply
  - Resend (or any email API): let the app send the packet with one tap

BACKEND CHOICES
  Convex: TypeScript-first, real-time sync, good DX, great for multi-user apps
  Supabase: Postgres + auth + storage + row-level security
  BetterAuth: auth only, bolted onto any existing backend
  No backend: for a single-user demo, just run locally — simpler to start

SECURITY NOTES
  - Do NOT train models on production customer data without legal sign-off
  - Use storage with encryption at rest + in transit
  - Audit who can access which shipments
  - For sensitive docs, prefer local models (Qwen, Minimax self-hosted)
  - Always set spending limits on any hosted model API key

ITERATION PLAN
  Day 1: scaffold the app, get classification working on 5 sample shipments
  Day 2: extraction + JSON output
  Day 3: packet assembly + Excel generation
  Week 2: real team trial, collect feedback
  Week 3: fix the top 3 complaints
  Week 4: CargoWise + email integration
  Week 5+: it becomes the tool they cannot live without

GOLDEN RULE
  Ship the ugliest possible v1 this week. You learn more from one real user than from
  three weeks of planning.`,

  's2-model-comparison': `AI Model Comparison Guide - Session 2
======================================

TIER 1: US FRONTIER MODELS (Most Expensive)
--------------------------------------------
Claude Opus 4.6 (Anthropic)
  Best at: Agentic tasks, code, complex reasoning
  Pricing: ~$150/1M tokens
  Access: Claude Code CLI, Anthropic API

GPT 5.4 (OpenAI)
  Best at: Code generation, general tasks
  Pricing: High (varies by endpoint)
  Access: Codex CLI, OpenAI API

Gemini 3.1 Pro (Google)
  Best at: Intelligence benchmarks, reasoning
  Pricing: Moderate
  Access: Google AI Studio, API
  Weakness: Agentic tasks (not great at doing things)

TIER 2: CHINESE OPEN-SOURCE MODELS (10x Cheaper)
-------------------------------------------------
Qwen 3.6 (Alibaba)
  Best at: General tasks, free through Zen/OpenCode
  Pricing: FREE (or very low via API)
  Access: OpenCode, OpenRouter

DeepSeek V3 / R1
  Best at: Reasoning, code, approaching US model quality
  Pricing: Very low
  Access: OpenRouter, direct API

Minimax 2.7
  Best at: Image generation, video, marketing content
  Pricing: Low
  Access: OpenRouter
  Note: Better than Gemini for image/video creation

NVIDIA NemoTron
  Best at: General tasks
  Pricing: FREE on OpenRouter
  Access: OpenRouter

WHEN TO USE WHAT
----------------
Need the smartest answer? → Gemini 3.1 Pro
Need the best code? → GPT 5.4 or Claude Opus
Need agentic automation? → Claude Code or Codex
Need it free? → Qwen 3.6, NVIDIA NemoTron, Gema 4
Need finance analysis? → Chinese models (top 3 on OpenRouter)
Need marketing content? → Chinese models + Minimax
Need video generation? → Minimax 2.7
On a budget? → OpenRouter free tier + Chinese models

IMPORTANT NOTES
- Models improve weekly — check artificialanalysis.ai regularly
- Free models rotate — what is free today may not be tomorrow
- Always set spending limits on API keys
- English prompts produce better results than Spanish
- The best model depends on YOUR specific task, not overall rankings`,
};

export const presentationFolders: PresentationFolder[] = [
  {
    id: 'ai-tools-setup',
    name: 'AI Tools Setup',
    icon: '🤖',
    color: '#0078D4',
    resources: [
      {
        name: 'AI Tools Setup Presentation',
        type: 'presentation',
        icon: '🧠',
        description: '24 slides covering Brave, AI concepts, Warp, Claude Code, Codex, Skills, Loops, and MCPs',
        action: 'launch:presentation',
      },
      {
        name: 'Installation Checklist',
        type: 'document',
        icon: '📋',
        description: 'Step-by-step installation guide for all tools',
        action: 'open-notepad:install-checklist',
      },
      {
        name: 'Workshop Notes',
        type: 'document',
        icon: '📝',
        description: 'Key concepts, tools, features, and advice from the session',
        action: 'open-notepad:workshop-notes',
      },
      {
        name: 'Quick Reference Card',
        type: 'document',
        icon: '📄',
        description: 'Commands, shortcuts, and tools at a glance',
        action: 'open-notepad:quick-reference',
      },
      {
        name: 'Terminal',
        type: 'tool',
        icon: '💻',
        description: 'Practice commands in the terminal',
        action: 'launch:terminal',
      },
      {
        name: 'Session Recording',
        type: 'tool',
        icon: '🎬',
        description: 'Herramientas - AI: Setup de agentes y herramientas',
        action: 'open-media:session-1-recording',
      },
    ],
  },
  {
    id: 'ai-models-tracking',
    name: 'AI Models & Tracking',
    icon: '🧠',
    color: '#7B2FF7',
    resources: [
      {
        name: 'AI Models & Tracking Presentation',
        type: 'presentation',
        icon: '🧠',
        description: '24 slides covering AI models, pricing, OpenCode, OpenRouter, MCPs, and tracking demo',
        action: 'launch:presentation2',
      },
      {
        name: 'Workshop Notes',
        type: 'document',
        icon: '📝',
        description: 'Key concepts, model rankings, tools, and advice from Session 2',
        action: 'open-notepad:s2-workshop-notes',
      },
      {
        name: 'Quick Reference Card',
        type: 'document',
        icon: '📄',
        description: 'Commands, model info, and setup steps at a glance',
        action: 'open-notepad:s2-quick-reference',
      },
      {
        name: 'Model Comparison Guide',
        type: 'document',
        icon: '📋',
        description: 'Detailed comparison of AI models: US frontier vs Chinese open-source',
        action: 'open-notepad:s2-model-comparison',
      },
      {
        name: 'Terminal',
        type: 'tool',
        icon: '💻',
        description: 'Practice commands in the terminal',
        action: 'launch:terminal',
      },
      {
        name: 'Session Recording',
        type: 'tool',
        icon: '🎬',
        description: 'Modelos de AI y Tracking Killer Demo',
        action: 'open-media:session-2-recording',
      },
    ],
  },
  {
    id: 'billing-packets-killer',
    name: 'Billing Packets Killer',
    icon: '📦',
    color: '#B569FF',
    resources: [
      {
        name: 'Billing Packets Killer Presentation',
        type: 'presentation',
        icon: '🧠',
        description: '24 slides covering fine-tuning, open-source models, and the Billing Packets mobile app demo',
        action: 'launch:presentation3',
      },
      {
        name: 'Workshop Notes',
        type: 'document',
        icon: '📝',
        description: 'Key concepts, models, tools, and advice from Session 3',
        action: 'open-notepad:s3-workshop-notes',
      },
      {
        name: 'Quick Reference Card',
        type: 'document',
        icon: '📄',
        description: 'Commands, licenses, document types, and stack at a glance',
        action: 'open-notepad:s3-quick-reference',
      },
      {
        name: 'Billing Packets Build Guide',
        type: 'document',
        icon: '📋',
        description: 'Step-by-step guide to building the Billing Packets Killer app',
        action: 'open-notepad:s3-billing-packets-guide',
      },
      {
        name: 'Terminal',
        type: 'tool',
        icon: '💻',
        description: 'Practice commands in the terminal',
        action: 'launch:terminal',
      },
      {
        name: 'Session Recording',
        type: 'tool',
        icon: '🎬',
        description: 'Fine-Tuning, Open-Source Models y Billing Packets Killer Demo',
        action: 'open-media:session-3-recording',
      },
    ],
  },
];
