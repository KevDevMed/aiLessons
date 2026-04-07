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
        icon: '📊',
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
];
