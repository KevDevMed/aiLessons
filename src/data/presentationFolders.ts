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
];
