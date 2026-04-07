/* === Internationalization (EN/ES) === */

const I18N = {
  _lang: 'en',
  _listeners: [],

  _dict: {
    en: {
      // OS
      'os.title': 'SecondSession',
      'os.lang.toggle': 'ES',

      // Apps
      'app.presentation': 'AI Tools Setup',
      'app.browser': 'Resources',
      'app.terminal': 'Terminal',
      'app.files': 'Files',

      // Presentation nav
      'nav.prev': 'Previous',
      'nav.next': 'Next',
      'nav.of': 'of',

      // Slide 1 - Title
      's1.title': 'Setting Up AI Coding Tools',
      's1.subtitle': 'A practical guide for your development team',

      // Slide 2 - Agenda
      's2.title': 'Agenda',
      's2.i1': 'Download and set up Warp terminal',
      's2.i2': 'Install Claude Code',
      's2.i3': 'Install Codex',
      's2.i4': 'Install Gemini CLI',
      's2.i5': 'Brave browser and security tools',
      's2.i6': 'Configure and log into Claude Code',
      's2.i7': 'Using documentation for automated setup',
      's2.i8': 'Practical examples and reusable commands',

      // Slide 3 - What is Warp
      's3.title': 'What is Warp?',
      's3.desc': 'Warp is a modern, AI-powered terminal that acts as an agent to help you install tools, run commands, and automate workflows. It understands natural language and can execute complex tasks on your behalf.',
      's3.f1.title': 'AI Agent',
      's3.f1.desc': 'Ask it to install software, and it handles the rest',
      's3.f2.title': 'Block Output',
      's3.f2.desc': 'Organized command output in visual blocks',
      's3.f3.title': 'Modern UI',
      's3.f3.desc': 'Intuitive interface with autocomplete and search',

      // Slide 4 - Installing Warp
      's4.title': 'Installing Warp',
      's4.s1': 'Visit warp.dev and download the installer',
      's4.s2': 'Open the downloaded file and drag to Applications',
      's4.s3': 'Launch Warp and sign in with your account',
      's4.s4': 'You are ready to start using the AI agent',

      // Slide 5 - Claude Code
      's5.title': 'Installing Claude Code',
      's5.desc': 'Claude Code is a CLI tool that brings Claude AI directly into your terminal. It can read your codebase, create files, run commands, and help you build software.',
      's5.alt': 'You can also paste the official documentation into Warp and let the agent install it automatically.',

      // Slide 6 - Codex
      's6.title': 'Installing Codex',
      's6.desc': 'Codex is OpenAI\'s CLI tool for code generation and assistance. It integrates directly into your development workflow from the terminal.',

      // Slide 7 - Gemini CLI
      's7.title': 'Installing Gemini CLI',
      's7.desc': 'Gemini CLI brings Google\'s AI model to your terminal. Use it for code generation, analysis, and automation tasks.',

      // Slide 8 - Brave & Security
      's8.title': 'Brave Browser & Security Tools',
      's8.desc': 'Brave is a privacy-focused browser with built-in ad blocking, tracker protection, and optional Tor windows. Essential for secure browsing while developing.',
      's8.f1.title': 'Built-in Ad Blocker',
      's8.f1.desc': 'No extensions needed for ad and tracker blocking',
      's8.f2.title': 'Privacy First',
      's8.f2.desc': 'Shields protect against fingerprinting and tracking',
      's8.f3.title': 'Tor Windows',
      's8.f3.desc': 'Private browsing through the Tor network built in',

      // Slide 9 - Setup Claude Code
      's9.title': 'Setting Up Claude Code',
      's9.desc': 'After installation, you need to authenticate and configure Claude Code to start using it.',
      's9.s1': 'Run "claude" in your terminal to start the setup',
      's9.s2': 'Follow the authentication prompts to log in',
      's9.s3': 'Select your preferred model and configuration',
      's9.s4': 'Start using Claude Code in any project directory',

      // Slide 10 - Auto Install
      's10.title': 'Using Documentation for Automated Setup',
      's10.desc': 'One of the most powerful workflows: copy the official documentation and paste it directly into the AI agent. The agent reads the instructions and executes every step automatically, without your intervention.',
      's10.example': 'Example: Paste the Claude Code installation docs into Warp. The agent reads each step and runs the commands for you.',

      // Slide 11 - Folders
      's11.title': 'Example: Creating Folders',
      's11.desc': 'AI agents can create complex project structures from a simple natural language request. No need to remember exact mkdir commands.',

      // Slide 12 - Excel
      's12.title': 'Example: Creating and Modifying Excel Files',
      's12.desc': 'The AI agent can create spreadsheets, add columns, populate data, and modify existing Excel files. It selects the right libraries and writes the code automatically.',

      // Slide 13 - Commands
      's13.title': 'Creating Reusable Commands',
      's13.desc': 'For tasks you repeat often, create shell aliases or scripts. The AI agent can help you build these so you run them with a single short command.',
      's13.example': 'Save repetitive workflows as aliases in your shell configuration. Run complex sequences with a single command.',

      // Slide 14 - Team Task
      's14.title': 'Team Task',
      's14.desc': 'Complete the following steps to set up your development environment:',
      's14.t1': 'Download and install Warp from warp.dev',
      's14.t2': 'Install Codex: npm install -g codex',
      's14.t3': 'Install Claude Code: npm install -g @anthropic-ai/claude-code',
      's14.t4': 'Run "claude" and complete the authentication',
      's14.t5': 'Create a test project folder with src, tests, and docs subfolders',
      's14.t6': 'Use the AI agent to create a sample Excel file in the project',

      // Slide 15 - Resources
      's15.title': 'Resources',
      's15.warp': 'Warp Terminal',
      's15.claude': 'Claude Code Documentation',
      's15.codex': 'Codex CLI',
      's15.gemini': 'Gemini CLI',
      's15.brave': 'Brave Browser',
      's15.desc': 'Bookmark these resources. When in doubt, paste the documentation into your AI agent and let it guide you.',

      // Slide 16 - End
      's16.title': 'Thank You',
      's16.subtitle': 'Start building with AI tools today',
    },

    es: {
      // OS
      'os.title': 'SecondSession',
      'os.lang.toggle': 'EN',

      // Apps
      'app.presentation': 'Config. Herramientas IA',
      'app.browser': 'Recursos',
      'app.terminal': 'Terminal',
      'app.files': 'Archivos',

      // Presentation nav
      'nav.prev': 'Anterior',
      'nav.next': 'Siguiente',
      'nav.of': 'de',

      // Slide 1 - Title
      's1.title': 'Configurando Herramientas de Codigo IA',
      's1.subtitle': 'Una guia practica para tu equipo de desarrollo',

      // Slide 2 - Agenda
      's2.title': 'Agenda',
      's2.i1': 'Descargar y configurar la terminal Warp',
      's2.i2': 'Instalar Claude Code',
      's2.i3': 'Instalar Codex',
      's2.i4': 'Instalar Gemini CLI',
      's2.i5': 'Navegador Brave y herramientas de seguridad',
      's2.i6': 'Configurar e iniciar sesion en Claude Code',
      's2.i7': 'Usar documentacion para instalacion automatica',
      's2.i8': 'Ejemplos practicos y comandos reutilizables',

      // Slide 3 - What is Warp
      's3.title': 'Que es Warp?',
      's3.desc': 'Warp es una terminal moderna con inteligencia artificial que actua como agente para ayudarte a instalar herramientas, ejecutar comandos y automatizar flujos de trabajo. Entiende lenguaje natural y puede ejecutar tareas complejas por ti.',
      's3.f1.title': 'Agente IA',
      's3.f1.desc': 'Pidele que instale software y se encarga del resto',
      's3.f2.title': 'Salida en Bloques',
      's3.f2.desc': 'Resultados de comandos organizados visualmente',
      's3.f3.title': 'Interfaz Moderna',
      's3.f3.desc': 'Interfaz intuitiva con autocompletado y busqueda',

      // Slide 4 - Installing Warp
      's4.title': 'Instalando Warp',
      's4.s1': 'Visita warp.dev y descarga el instalador',
      's4.s2': 'Abre el archivo descargado y arrastra a Aplicaciones',
      's4.s3': 'Abre Warp e inicia sesion con tu cuenta',
      's4.s4': 'Estas listo para empezar a usar el agente IA',

      // Slide 5 - Claude Code
      's5.title': 'Instalando Claude Code',
      's5.desc': 'Claude Code es una herramienta CLI que trae la IA Claude directamente a tu terminal. Puede leer tu codigo, crear archivos, ejecutar comandos y ayudarte a construir software.',
      's5.alt': 'Tambien puedes pegar la documentacion oficial en Warp y dejar que el agente lo instale automaticamente.',

      // Slide 6 - Codex
      's6.title': 'Instalando Codex',
      's6.desc': 'Codex es la herramienta CLI de OpenAI para generacion y asistencia de codigo. Se integra directamente en tu flujo de trabajo de desarrollo desde la terminal.',

      // Slide 7 - Gemini CLI
      's7.title': 'Instalando Gemini CLI',
      's7.desc': 'Gemini CLI trae el modelo de IA de Google a tu terminal. Usalo para generacion de codigo, analisis y tareas de automatizacion.',

      // Slide 8 - Brave & Security
      's8.title': 'Navegador Brave y Herramientas de Seguridad',
      's8.desc': 'Brave es un navegador enfocado en privacidad con bloqueo de anuncios integrado, proteccion contra rastreadores y ventanas Tor opcionales. Esencial para navegar de forma segura mientras desarrollas.',
      's8.f1.title': 'Bloqueador Integrado',
      's8.f1.desc': 'Sin necesidad de extensiones para bloquear anuncios',
      's8.f2.title': 'Privacidad Primero',
      's8.f2.desc': 'Shields protege contra rastreo y fingerprinting',
      's8.f3.title': 'Ventanas Tor',
      's8.f3.desc': 'Navegacion privada a traves de la red Tor integrada',

      // Slide 9 - Setup Claude Code
      's9.title': 'Configurando Claude Code',
      's9.desc': 'Despues de la instalacion, necesitas autenticarte y configurar Claude Code para empezar a usarlo.',
      's9.s1': 'Ejecuta "claude" en tu terminal para iniciar la configuracion',
      's9.s2': 'Sigue las indicaciones de autenticacion para iniciar sesion',
      's9.s3': 'Selecciona tu modelo preferido y configuracion',
      's9.s4': 'Empieza a usar Claude Code en cualquier directorio de proyecto',

      // Slide 10 - Auto Install
      's10.title': 'Usando Documentacion para Instalacion Automatica',
      's10.desc': 'Uno de los flujos de trabajo mas potentes: copia la documentacion oficial y pegala directamente en el agente IA. El agente lee las instrucciones y ejecuta cada paso automaticamente, sin tu intervencion.',
      's10.example': 'Ejemplo: Pega la documentacion de instalacion de Claude Code en Warp. El agente lee cada paso y ejecuta los comandos por ti.',

      // Slide 11 - Folders
      's11.title': 'Ejemplo: Creando Carpetas',
      's11.desc': 'Los agentes IA pueden crear estructuras de proyecto complejas desde una simple solicitud en lenguaje natural. No necesitas recordar los comandos exactos de mkdir.',

      // Slide 12 - Excel
      's12.title': 'Ejemplo: Creando y Modificando Archivos Excel',
      's12.desc': 'El agente IA puede crear hojas de calculo, agregar columnas, rellenar datos y modificar archivos Excel existentes. Selecciona las librerias correctas y escribe el codigo automaticamente.',

      // Slide 13 - Commands
      's13.title': 'Creando Comandos Reutilizables',
      's13.desc': 'Para tareas que repites frecuentemente, crea alias de shell o scripts. El agente IA puede ayudarte a construirlos para que los ejecutes con un solo comando corto.',
      's13.example': 'Guarda flujos de trabajo repetitivos como alias en tu configuracion de shell. Ejecuta secuencias complejas con un solo comando.',

      // Slide 14 - Team Task
      's14.title': 'Tarea del Equipo',
      's14.desc': 'Completa los siguientes pasos para configurar tu entorno de desarrollo:',
      's14.t1': 'Descarga e instala Warp desde warp.dev',
      's14.t2': 'Instala Codex: npm install -g codex',
      's14.t3': 'Instala Claude Code: npm install -g @anthropic-ai/claude-code',
      's14.t4': 'Ejecuta "claude" y completa la autenticacion',
      's14.t5': 'Crea una carpeta de proyecto de prueba con subcarpetas src, tests y docs',
      's14.t6': 'Usa el agente IA para crear un archivo Excel de ejemplo en el proyecto',

      // Slide 15 - Resources
      's15.title': 'Recursos',
      's15.warp': 'Terminal Warp',
      's15.claude': 'Documentacion de Claude Code',
      's15.codex': 'Codex CLI',
      's15.gemini': 'Gemini CLI',
      's15.brave': 'Navegador Brave',
      's15.desc': 'Guarda estos recursos en marcadores. Cuando tengas dudas, pega la documentacion en tu agente IA y deja que te guie.',

      // Slide 16 - End
      's16.title': 'Gracias',
      's16.subtitle': 'Empieza a construir con herramientas IA hoy',
    }
  },

  t(key) {
    return this._dict[this._lang]?.[key] || this._dict['en']?.[key] || key;
  },

  getLang() {
    return this._lang;
  },

  setLang(lang) {
    if (lang === this._lang) return;
    this._lang = lang;
    document.documentElement.lang = lang;
    this.translateStatic();
    document.dispatchEvent(new CustomEvent('i18n:changed', { detail: { lang } }));
  },

  toggle() {
    this.setLang(this._lang === 'en' ? 'es' : 'en');
  },

  translateStatic() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = this.t(key);
    });
  },

  init() {
    const saved = localStorage.getItem('ss-lang');
    if (saved && this._dict[saved]) {
      this._lang = saved;
    }
    document.documentElement.lang = this._lang;
    this.translateStatic();

    document.addEventListener('i18n:changed', () => {
      localStorage.setItem('ss-lang', this._lang);
    });
  }
};
