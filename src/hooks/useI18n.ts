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
