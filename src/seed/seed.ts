import { connect, connection, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/codespace_dev';

async function seed() {
  console.log('🌱 Conectando ao MongoDB...');
  await connect(MONGODB_URI);
  console.log('✅ Conectado!');

  const db = connection.db;

  // Clear existing data
  console.log('🗑️  Limpando dados existentes...');
  const collections = [
    'users', 'tracks', 'sessions', 'channels', 'messages', 'plans', 'subscriptions', 'usertrackprogresses',
    'challenges', 'challengesubmissions', 'jobs', 'jobapplications',
    'interviewquestions', 'interviewsessions', 'projects', 'userprojects',
    'resources', 'resourcebookmarks', 'checkins', 'certificates',
  ];
  for (const col of collections) {
    try {
      await db.collection(col).drop();
    } catch {
      // Collection might not exist
    }
  }

  // ==================== PLANS ====================
  console.log('📋 Criando planos...');
  const plans = await db.collection('plans').insertMany([
    {
      slug: 'essencial',
      name: 'Essencial',
      description: 'Ideal para quem está começando sua jornada na programação',
      priceMonthly: 497,
      priceYearly: 4970,
      sessionsPerWeek: 1,
      features: [
        'Mentoria individual 1x por semana',
        'Acesso ao grupo WhatsApp',
        'Code reviews semanais',
        'Plano de estudos personalizado',
        'Acesso às trilhas básicas',
        'Certificado de conclusão',
      ],
      isPopular: false,
      isActive: true,
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      slug: 'profissional',
      name: 'Profissional',
      description: 'Para quem quer acelerar e se destacar no mercado',
      priceMonthly: 897,
      priceYearly: 8970,
      sessionsPerWeek: 2,
      features: [
        'Mentoria individual 2x por semana',
        'WhatsApp prioritário com mentor',
        'Participação em projetos reais',
        'Simulação de entrevistas técnicas',
        'Indicação para empresas parceiras',
        'Acesso a todas as trilhas',
        'Code reviews ilimitados',
        'Certificado de conclusão',
      ],
      isPopular: true,
      isActive: true,
      order: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      slug: 'elite',
      name: 'Elite',
      description: 'Acompanhamento máximo para resultados extraordinários',
      priceMonthly: 1497,
      priceYearly: 14970,
      sessionsPerWeek: 3,
      features: [
        'Mentoria individual 3x por semana',
        'WhatsApp diário com mentor',
        'Pair programming semanal',
        'Indicação direta para empresas',
        'Suporte para LinkedIn e portfólio',
        'Acesso vitalício à comunidade',
        'Projetos reais com deploy',
        'Mock interviews ilimitadas',
        'Certificado premium',
      ],
      isPopular: false,
      isActive: true,
      order: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  console.log(`  ✅ ${plans.insertedCount} planos criados`);

  // ==================== USERS ====================
  console.log('👤 Criando usuários...');
  const hashedPassword = await bcrypt.hash('123456', 12);

  const users = await db.collection('users').insertMany([
    {
      name: 'Yago (Admin)',
      email: 'admin@codespace.com.br',
      password: hashedPassword,
      avatar: '',
      phone: '',
      bio: 'Fundador e mentor principal do Codespace',
      github: 'yago',
      linkedin: '',
      plan: 'elite',
      status: 'active',
      role: 'admin',
      streakDays: 45,
      totalHours: 320,
      notificationPreferences: {
        email: true,
        push: true,
        mentorReminders: true,
        communityUpdates: true,
        weeklyReport: true,
      },
      lastLoginAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'João Silva',
      email: 'joao@example.com',
      password: hashedPassword,
      avatar: '',
      phone: '(11) 99999-0001',
      bio: 'Desenvolvedor full-stack em formação',
      github: 'joaosilva',
      linkedin: '',
      plan: 'profissional',
      status: 'active',
      role: 'user',
      streakDays: 12,
      totalHours: 87,
      notificationPreferences: {
        email: true,
        push: true,
        mentorReminders: true,
        communityUpdates: true,
        weeklyReport: false,
      },
      lastLoginAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Maria Santos',
      email: 'maria@example.com',
      password: hashedPassword,
      avatar: '',
      phone: '(21) 99999-0002',
      bio: 'Transição de carreira para tech',
      github: 'mariasantos',
      linkedin: '',
      plan: 'essencial',
      status: 'active',
      role: 'user',
      streakDays: 5,
      totalHours: 34,
      notificationPreferences: {
        email: true,
        push: false,
        mentorReminders: true,
        communityUpdates: false,
        weeklyReport: true,
      },
      lastLoginAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  console.log(`  ✅ ${users.insertedCount} usuários criados`);

  const adminId = users.insertedIds[0];
  const joaoId = users.insertedIds[1];
  const mariaId = users.insertedIds[2];

  // ==================== LESSON IDs (stable ObjectIds) ====================
  const jsLesson1 = new Types.ObjectId();
  const jsLesson2 = new Types.ObjectId();
  const jsLesson3 = new Types.ObjectId();
  const jsLesson4 = new Types.ObjectId();
  const jsLesson5 = new Types.ObjectId();
  const jsLesson6 = new Types.ObjectId();

  const reactLesson1 = new Types.ObjectId();
  const reactLesson2 = new Types.ObjectId();
  const reactLesson3 = new Types.ObjectId();
  const reactLesson4 = new Types.ObjectId();

  const nodeLesson1 = new Types.ObjectId();
  const nodeLesson2 = new Types.ObjectId();
  const nodeLesson3 = new Types.ObjectId();

  const tsLesson1 = new Types.ObjectId();
  const tsLesson2 = new Types.ObjectId();

  const devopsLesson1 = new Types.ObjectId();
  const devopsLesson2 = new Types.ObjectId();

  const archLesson1 = new Types.ObjectId();
  const archLesson2 = new Types.ObjectId();

  // ==================== TRACKS ====================
  console.log('🛤️  Criando trilhas...');
  const tracks = await db.collection('tracks').insertMany([
    {
      title: 'Fundamentos de JavaScript',
      description: 'Domine os fundamentos do JavaScript desde variáveis até async/await. A base essencial para qualquer desenvolvedor web.',
      icon: 'Code2',
      color: '#F7DF1E',
      tags: ['JavaScript', 'Fundamentos', 'Web'],
      difficulty: 'beginner',
      totalLessons: 6,
      estimatedHours: 40,
      lessons: [
        { _id: jsLesson1, title: 'Introdução ao JavaScript', description: 'O que é JS e como funciona', videoUrl: '', content: '# Introdução ao JavaScript\n\nJavaScript é a linguagem de programação mais popular do mundo. Nesta aula, você vai entender:\n\n- O que é JavaScript e sua história\n- Como o JavaScript roda no navegador (engine V8)\n- A diferença entre JavaScript e ECMAScript\n- Configurando seu ambiente de desenvolvimento\n\n## O que é JavaScript?\n\nJavaScript é uma linguagem de programação interpretada, de alto nível, dinâmica e multi-paradigma. Foi criada por Brendan Eich em 1995.\n\n## Exercício Prático\n\nAbra o console do navegador (F12) e digite:\n\n```js\nconsole.log("Hello, World!");\n```\n\nParabéns! Você acaba de escrever seu primeiro código JavaScript.', durationMinutes: 30, order: 1 },
        { _id: jsLesson2, title: 'Variáveis e Tipos', description: 'let, const, var, tipos primitivos', videoUrl: '', content: '# Variáveis e Tipos de Dados\n\nVariáveis são espaços na memória para armazenar valores.\n\n## Declaração de Variáveis\n\n```js\nlet nome = "Maria";      // pode ser reatribuída\nconst PI = 3.14159;       // constante, não muda\nvar idade = 25;           // evite usar var\n```\n\n## Tipos Primitivos\n\n- **string** — texto: `"Olá mundo"`\n- **number** — números: `42`, `3.14`\n- **boolean** — `true` ou `false`\n- **undefined** — variável declarada sem valor\n- **null** — ausência intencional de valor\n- **symbol** — identificador único\n- **bigint** — números muito grandes\n\n## typeof\n\n```js\ntypeof "hello"  // "string"\ntypeof 42       // "number"\ntypeof true     // "boolean"\n```\n\n## Exercício\n\nCrie variáveis para armazenar seu nome, idade e se é estudante.', durationMinutes: 45, order: 2 },
        { _id: jsLesson3, title: 'Operadores', description: 'Aritméticos, lógicos, comparação', videoUrl: '', content: '# Operadores em JavaScript\n\n## Aritméticos\n```js\nlet a = 10 + 5;  // 15\nlet b = 10 - 3;  // 7\nlet c = 4 * 3;   // 12\nlet d = 15 / 4;  // 3.75\nlet e = 15 % 4;  // 3 (resto)\nlet f = 2 ** 3;  // 8 (potência)\n```\n\n## Comparação\n```js\n5 == "5"    // true (compara só valor)\n5 === "5"   // false (compara valor E tipo)\n5 != "5"    // false\n5 !== "5"   // true\n```\n\n## Lógicos\n```js\ntrue && false  // false (AND)\ntrue || false  // true (OR)\n!true          // false (NOT)\n```\n\n## Exercício\nEscreva expressões que resultem em `true` usando cada operador de comparação.', durationMinutes: 30, order: 3 },
        { _id: jsLesson4, title: 'Condicionais', description: 'if/else, switch, ternário', videoUrl: '', content: '# Estruturas Condicionais\n\n## if / else\n```js\nlet idade = 18;\n\nif (idade >= 18) {\n  console.log("Maior de idade");\n} else if (idade >= 16) {\n  console.log("Pode votar");\n} else {\n  console.log("Menor de idade");\n}\n```\n\n## Operador Ternário\n```js\nlet status = idade >= 18 ? "adulto" : "menor";\n```\n\n## switch\n```js\nlet dia = "segunda";\nswitch (dia) {\n  case "segunda":\n  case "terça":\n    console.log("Início da semana");\n    break;\n  case "sexta":\n    console.log("Sextou!");\n    break;\n  default:\n    console.log("Outro dia");\n}\n```\n\n## Exercício\nCrie um programa que classifica a nota do aluno: A (>=90), B (>=80), C (>=70), D (>=60), F (<60).', durationMinutes: 40, order: 4 },
        { _id: jsLesson5, title: 'Loops', description: 'for, while, do-while, for...of', videoUrl: '', content: '# Loops (Laços de Repetição)\n\n## for\n```js\nfor (let i = 0; i < 5; i++) {\n  console.log(i); // 0, 1, 2, 3, 4\n}\n```\n\n## while\n```js\nlet contador = 0;\nwhile (contador < 3) {\n  console.log(contador);\n  contador++;\n}\n```\n\n## for...of (arrays)\n```js\nconst frutas = ["maçã", "banana", "laranja"];\nfor (const fruta of frutas) {\n  console.log(fruta);\n}\n```\n\n## for...in (objetos)\n```js\nconst pessoa = { nome: "Ana", idade: 25 };\nfor (const chave in pessoa) {\n  console.log(`${chave}: ${pessoa[chave]}`);\n}\n```\n\n## Exercício\nUse um loop para somar todos os números de 1 a 100.', durationMinutes: 35, order: 5 },
        { _id: jsLesson6, title: 'Funções', description: 'Declaração, arrow functions, callbacks', videoUrl: '', content: '# Funções em JavaScript\n\n## Declaração Tradicional\n```js\nfunction saudacao(nome) {\n  return `Olá, ${nome}!`;\n}\n```\n\n## Arrow Function\n```js\nconst saudacao = (nome) => `Olá, ${nome}!`;\n\nconst soma = (a, b) => a + b;\n\nconst quadrado = x => x * x;\n```\n\n## Callbacks\n```js\nfunction executar(callback) {\n  console.log("Antes");\n  callback();\n  console.log("Depois");\n}\n\nexecutar(() => console.log("Executando!"));\n```\n\n## Parâmetros Default\n```js\nfunction criar(nome = "Anônimo", idade = 0) {\n  return { nome, idade };\n}\n```\n\n## Exercício\nCrie uma arrow function que receba um array de números e retorne apenas os pares usando `.filter()`.', durationMinutes: 50, order: 6 },
      ],
      requiredPlans: ['free', 'essencial', 'profissional', 'elite'],
      isPublished: true,
      order: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'React do Zero ao Avançado',
      description: 'Aprenda React na prática — componentes, hooks, estado, rotas, e deploy de aplicações completas.',
      icon: 'Atom',
      color: '#61DAFB',
      tags: ['React', 'Frontend', 'SPA'],
      difficulty: 'intermediate',
      totalLessons: 4,
      estimatedHours: 56,
      lessons: [
        { _id: reactLesson1, title: 'O que é React?', description: 'Virtual DOM, JSX, componentes', videoUrl: '', content: '# O que é React?\n\nReact é uma biblioteca JavaScript para construir interfaces de usuário.\n\n## Conceitos Fundamentais\n\n- **Componentes** — blocos reutilizáveis de UI\n- **Virtual DOM** — representação leve do DOM real\n- **JSX** — sintaxe que combina HTML com JavaScript\n- **Unidirecional** — fluxo de dados de pai para filho\n\n## Criando um Projeto\n\n```bash\nnpm create vite@latest meu-app -- --template react-ts\ncd meu-app\nnpm install\nnpm run dev\n```\n\n## Primeiro Componente\n```jsx\nfunction App() {\n  return (\n    <div>\n      <h1>Meu primeiro React App!</h1>\n    </div>\n  );\n}\n```\n\n## Exercício\nCrie um projeto React com Vite e modifique o componente App para exibir seu nome.', durationMinutes: 30, order: 1 },
        { _id: reactLesson2, title: 'Criando o Primeiro Componente', description: 'Function components, props', videoUrl: '', content: '# Componentes e Props\n\nComponentes são funções que retornam JSX.\n\n## Function Component\n```tsx\nfunction Saudacao({ nome }: { nome: string }) {\n  return <h2>Olá, {nome}!</h2>;\n}\n\n// Uso:\n<Saudacao nome="Maria" />\n```\n\n## Props\nProps são as "propriedades" passadas para um componente:\n\n```tsx\ninterface CardProps {\n  titulo: string;\n  descricao: string;\n  destaque?: boolean;\n}\n\nfunction Card({ titulo, descricao, destaque = false }: CardProps) {\n  return (\n    <div className={destaque ? "card destaque" : "card"}>\n      <h3>{titulo}</h3>\n      <p>{descricao}</p>\n    </div>\n  );\n}\n```\n\n## children\n```tsx\nfunction Container({ children }: { children: React.ReactNode }) {\n  return <div className="container">{children}</div>;\n}\n```\n\n## Exercício\nCrie um componente `UserCard` que recebe name, email e avatar como props.', durationMinutes: 40, order: 2 },
        { _id: reactLesson3, title: 'useState e Eventos', description: 'State management básico', videoUrl: '', content: '# useState e Eventos\n\nO estado permite que componentes "lembrem" de valores entre renderizações.\n\n## useState\n```tsx\nimport { useState } from "react";\n\nfunction Contador() {\n  const [count, setCount] = useState(0);\n\n  return (\n    <div>\n      <p>Contagem: {count}</p>\n      <button onClick={() => setCount(count + 1)}>+1</button>\n      <button onClick={() => setCount(0)}>Reset</button>\n    </div>\n  );\n}\n```\n\n## Eventos\n```tsx\nfunction Formulario() {\n  const [texto, setTexto] = useState("");\n\n  const handleSubmit = (e: React.FormEvent) => {\n    e.preventDefault();\n    alert(`Enviado: ${texto}`);\n  };\n\n  return (\n    <form onSubmit={handleSubmit}>\n      <input\n        value={texto}\n        onChange={(e) => setTexto(e.target.value)}\n      />\n      <button type="submit">Enviar</button>\n    </form>\n  );\n}\n```\n\n## Exercício\nCrie um app Todo List com useState: adicionar, marcar como concluído e remover itens.', durationMinutes: 45, order: 3 },
        { _id: reactLesson4, title: 'useEffect', description: 'Side effects, cleanup, dependencies', videoUrl: '', content: '# useEffect — Side Effects\n\nuseEffect executa código após a renderização.\n\n## Sintaxe Básica\n```tsx\nimport { useEffect, useState } from "react";\n\nfunction Timer() {\n  const [seconds, setSeconds] = useState(0);\n\n  useEffect(() => {\n    const interval = setInterval(() => {\n      setSeconds(s => s + 1);\n    }, 1000);\n\n    // Cleanup function\n    return () => clearInterval(interval);\n  }, []); // [] = executa só na montagem\n\n  return <p>Tempo: {seconds}s</p>;\n}\n```\n\n## Dependencies Array\n```tsx\n// Executa sempre que userId mudar\nuseEffect(() => {\n  fetchUser(userId);\n}, [userId]);\n\n// Sem array = executa toda renderização (evite!)\nuseEffect(() => { /* ... */ });\n```\n\n## Fetch de Dados\n```tsx\nuseEffect(() => {\n  async function loadData() {\n    const res = await fetch("/api/users");\n    const data = await res.json();\n    setUsers(data);\n  }\n  loadData();\n}, []);\n```\n\n## Exercício\nCrie um componente que busca dados de uma API pública e exibe uma lista.', durationMinutes: 50, order: 4 },
      ],
      requiredPlans: ['essencial', 'profissional', 'elite'],
      isPublished: true,
      order: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Node.js e APIs RESTful',
      description: 'Construa APIs profissionais com Node.js, Express, e banco de dados. Do setup ao deploy.',
      icon: 'Server',
      color: '#339933',
      tags: ['Node.js', 'Backend', 'API', 'Express'],
      difficulty: 'intermediate',
      totalLessons: 3,
      estimatedHours: 48,
      lessons: [
        { _id: nodeLesson1, title: 'Introdução ao Node.js', description: 'Runtime, npm, módulos', videoUrl: '', content: '# Introdução ao Node.js\n\nNode.js permite executar JavaScript fora do navegador.\n\n## O que é Node.js?\n- Runtime JavaScript baseado no V8 do Chrome\n- Não-bloqueante e orientado a eventos\n- Ideal para aplicações em tempo real e APIs\n\n## npm (Node Package Manager)\n```bash\nnpm init -y\nnpm install express\nnpm install -D typescript @types/node\n```\n\n## Módulos\n```js\n// math.js\nmodule.exports = { soma: (a, b) => a + b };\n\n// ES Modules\nexport const soma = (a, b) => a + b;\nimport { soma } from "./math.js";\n```\n\n## Primeiro Servidor\n```js\nconst http = require("http");\n\nconst server = http.createServer((req, res) => {\n  res.writeHead(200, { "Content-Type": "text/plain" });\n  res.end("Hello, Node.js!");\n});\n\nserver.listen(3000, () => console.log("Rodando na porta 3000"));\n```\n\n## Exercício\nCrie um servidor Node.js simples que responde com JSON.', durationMinutes: 35, order: 1 },
        { _id: nodeLesson2, title: 'Express Básico', description: 'Rotas, middleware, request/response', videoUrl: '', content: '# Express.js\n\nFramework minimalista para aplicações web com Node.js.\n\n## Setup\n```bash\nnpm install express\n```\n\n## Servidor Básico\n```js\nconst express = require("express");\nconst app = express();\n\napp.use(express.json());\n\napp.get("/api/users", (req, res) => {\n  res.json([{ id: 1, nome: "Ana" }]);\n});\n\napp.post("/api/users", (req, res) => {\n  const { nome, email } = req.body;\n  res.status(201).json({ id: 2, nome, email });\n});\n\napp.listen(3000);\n```\n\n## Middleware\n```js\n// Logger middleware\napp.use((req, res, next) => {\n  console.log(`${req.method} ${req.url}`);\n  next();\n});\n```\n\n## Exercício\nCrie uma API CRUD completa para gerenciar tarefas (tasks).', durationMinutes: 45, order: 2 },
        { _id: nodeLesson3, title: 'MongoDB e Mongoose', description: 'NoSQL, schemas, queries', videoUrl: '', content: '# MongoDB e Mongoose\n\nMongoDB é um banco de dados NoSQL orientado a documentos.\n\n## Instalação\n```bash\nnpm install mongoose\n```\n\n## Conexão\n```js\nconst mongoose = require("mongoose");\nawait mongoose.connect("mongodb://localhost:27017/mydb");\n```\n\n## Schema e Model\n```js\nconst userSchema = new mongoose.Schema({\n  nome: { type: String, required: true },\n  email: { type: String, unique: true },\n  idade: Number,\n  createdAt: { type: Date, default: Date.now },\n});\n\nconst User = mongoose.model("User", userSchema);\n```\n\n## Operações\n```js\n// Criar\nconst user = await User.create({ nome: "Ana", email: "ana@mail.com" });\n\n// Buscar\nconst todos = await User.find();\nconst um = await User.findById(id);\n\n// Atualizar\nawait User.findByIdAndUpdate(id, { nome: "Ana Clara" });\n\n// Deletar\nawait User.findByIdAndDelete(id);\n```\n\n## Exercício\nCrie uma API de blog posts com Mongoose: criar, listar, editar e deletar.', durationMinutes: 50, order: 3 },
      ],
      requiredPlans: ['essencial', 'profissional', 'elite'],
      isPublished: true,
      order: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'TypeScript Profissional',
      description: 'Tipagem avançada, generics, utility types, e padrões profissionais com TypeScript.',
      icon: 'FileCode',
      color: '#3178C6',
      tags: ['TypeScript', 'Tipos', 'Avançado'],
      difficulty: 'intermediate',
      totalLessons: 2,
      estimatedHours: 35,
      lessons: [
        { _id: tsLesson1, title: 'Por que TypeScript?', description: 'Vantagens, setup, tsconfig', videoUrl: '', content: '# Por que TypeScript?\n\nTypeScript adiciona tipagem estática ao JavaScript.\n\n## Vantagens\n- Detecta erros em tempo de compilação\n- Autocompletar inteligente no editor\n- Documentação viva do código\n- Refatoração segura\n\n## Setup\n```bash\nnpm install -D typescript\nnpx tsc --init\n```\n\n## tsconfig.json\n```json\n{\n  "compilerOptions": {\n    "target": "ES2020",\n    "module": "commonjs",\n    "strict": true,\n    "outDir": "./dist",\n    "rootDir": "./src"\n  }\n}\n```\n\n## Primeiro Arquivo .ts\n```ts\nfunction saudacao(nome: string): string {\n  return `Olá, ${nome}!`;\n}\n\nconsole.log(saudacao("Mundo"));\n// saudacao(42); // Erro!\n```\n\n## Exercício\nConfigure um projeto TypeScript e crie funções tipadas para operações matemáticas.', durationMinutes: 30, order: 1 },
        { _id: tsLesson2, title: 'Tipos Básicos', description: 'string, number, boolean, arrays', videoUrl: '', content: '# Tipos Básicos do TypeScript\n\n## Tipos Primitivos\n```ts\nlet nome: string = "Ana";\nlet idade: number = 25;\nlet ativo: boolean = true;\nlet nada: undefined = undefined;\nlet vazio: null = null;\n```\n\n## Arrays e Tuplas\n```ts\nlet numeros: number[] = [1, 2, 3];\nlet nomes: Array<string> = ["Ana", "Bob"];\nlet tupla: [string, number] = ["idade", 25];\n```\n\n## Interfaces\n```ts\ninterface User {\n  nome: string;\n  email: string;\n  idade?: number; // opcional\n  readonly id: string;\n}\n\nconst user: User = {\n  id: "abc",\n  nome: "Ana",\n  email: "ana@mail.com"\n};\n```\n\n## Type Aliases\n```ts\ntype Status = "ativo" | "inativo" | "pendente";\ntype Resposta = { sucesso: boolean; dados: unknown };\n```\n\n## Exercício\nCrie interfaces para modelar um sistema de e-commerce: Product, Cart, Order.', durationMinutes: 40, order: 2 },
      ],
      requiredPlans: ['free', 'essencial', 'profissional', 'elite'],
      isPublished: true,
      order: 4,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'DevOps e Deploy',
      description: 'Docker, CI/CD, AWS, e estratégias de deploy para colocar suas aplicações em produção.',
      icon: 'Cloud',
      color: '#FF6B35',
      tags: ['DevOps', 'Docker', 'AWS', 'CI/CD'],
      difficulty: 'advanced',
      totalLessons: 2,
      estimatedHours: 30,
      lessons: [
        { _id: devopsLesson1, title: 'Introdução ao Docker', description: 'Containers, images, Dockerfile', videoUrl: '', content: '# Introdução ao Docker\n\nDocker permite empacotar aplicações em containers isolados.\n\n## Conceitos\n- **Image** — template read-only (blueprint)\n- **Container** — instância em execução de uma image\n- **Dockerfile** — receita para criar images\n- **Registry** — repositório de images (Docker Hub)\n\n## Comandos Básicos\n```bash\ndocker pull node:20\ndocker run -it node:20 node -e "console.log(42)"\ndocker ps       # containers rodando\ndocker images   # images locais\n```\n\n## Dockerfile\n```dockerfile\nFROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm install\nCOPY . .\nEXPOSE 3000\nCMD ["node", "dist/main.js"]\n```\n\n```bash\ndocker build -t minha-api .\ndocker run -p 3000:3000 minha-api\n```\n\n## Exercício\nCrie um Dockerfile para uma aplicação Node.js e rode-a localmente.', durationMinutes: 45, order: 1 },
        { _id: devopsLesson2, title: 'Docker Compose', description: 'Multi-container apps', videoUrl: '', content: '# Docker Compose\n\nOrquestra múltiplos containers como um só serviço.\n\n## docker-compose.yml\n```yaml\nversion: "3.9"\nservices:\n  api:\n    build: .\n    ports:\n      - "3000:3000"\n    environment:\n      - MONGO_URL=mongodb://mongo:27017/mydb\n    depends_on:\n      - mongo\n\n  mongo:\n    image: mongo:7\n    ports:\n      - "27017:27017"\n    volumes:\n      - mongo_data:/data/db\n\nvolumes:\n  mongo_data:\n```\n\n## Comandos\n```bash\ndocker compose up -d     # iniciar\ndocker compose down       # parar\ndocker compose logs api   # ver logs\ndocker compose exec api sh  # acessar container\n```\n\n## Exercício\nCrie um docker-compose.yml para sua API + MongoDB + Redis.', durationMinutes: 40, order: 2 },
      ],
      requiredPlans: ['profissional', 'elite'],
      isPublished: true,
      order: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: 'Arquitetura de Software',
      description: 'Clean Architecture, Design Patterns, SOLID, e boas práticas para código escalável.',
      icon: 'Building',
      color: '#8B5CF6',
      tags: ['Arquitetura', 'Design Patterns', 'SOLID'],
      difficulty: 'advanced',
      totalLessons: 2,
      estimatedHours: 28,
      lessons: [
        { _id: archLesson1, title: 'SOLID Principles', description: 'SRP, OCP, LSP, ISP, DIP', videoUrl: '', content: '# Princípios SOLID\n\nSOLID são 5 princípios para código orientado a objetos mais limpo.\n\n## S — Single Responsibility\nCada classe deve ter uma única responsabilidade.\n```ts\n// ❌ Faz demais\nclass UserService {\n  createUser() { /* ... */ }\n  sendEmail() { /* ... */ }\n  generateReport() { /* ... */ }\n}\n\n// ✅ Responsabilidade única\nclass UserService { createUser() { /* ... */ } }\nclass EmailService { sendEmail() { /* ... */ } }\nclass ReportService { generateReport() { /* ... */ } }\n```\n\n## O — Open/Closed\nAberto para extensão, fechado para modificação.\n\n## L — Liskov Substitution\nSubtipos devem ser substituíveis por seus tipos base.\n\n## I — Interface Segregation\nClientes não devem depender de interfaces que não usam.\n\n## D — Dependency Inversion\nDependa de abstrações, não de implementações.\n```ts\ninterface Logger { log(msg: string): void; }\nclass ConsoleLogger implements Logger { log(msg: string) { console.log(msg); } }\nclass FileLogger implements Logger { log(msg: string) { /* grava arquivo */ } }\n```\n\n## Exercício\nRefatore uma classe "God Object" aplicando SRP e DIP.', durationMinutes: 60, order: 1 },
        { _id: archLesson2, title: 'Clean Architecture', description: 'Layered architecture, dependencies', videoUrl: '', content: '# Clean Architecture\n\nOrganização do código em camadas com regra de dependência.\n\n## As Camadas\n\n```\n┌─────────────────┐\n│   Frameworks    │ ← Express, React, MongoDB\n├─────────────────┤\n│   Adapters      │ ← Controllers, Gateways\n├─────────────────┤\n│   Use Cases     │ ← Regras de negócio da aplicação\n├─────────────────┤\n│   Entities      │ ← Regras de negócio centrais\n└─────────────────┘\n```\n\n## Regra de Dependência\nDependências apontam sempre para DENTRO (camadas internas).\n\n## Exemplo Prático\n```ts\n// Entity\nclass User {\n  constructor(public name: string, public email: string) {}\n}\n\n// Use Case\nclass CreateUser {\n  constructor(private userRepo: UserRepository) {}\n  async execute(name: string, email: string): Promise<User> {\n    return this.userRepo.create(new User(name, email));\n  }\n}\n\n// Repository Interface (Port)\ninterface UserRepository {\n  create(user: User): Promise<User>;\n  findById(id: string): Promise<User | null>;\n}\n```\n\n## Exercício\nEstruture um módulo de "Pedidos" usando Clean Architecture.', durationMinutes: 55, order: 2 },
      ],
      requiredPlans: ['elite'],
      isPublished: true,
      order: 6,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  console.log(`  ✅ ${tracks.insertedCount} trilhas criadas`);

  // ==================== USER TRACK PROGRESS ====================
  console.log('📊 Criando progresso dos usuários...');
  const trackIds = Object.values(tracks.insertedIds);

  await db.collection('usertrackprogresses').insertMany([
    {
      userId: joaoId,
      trackId: trackIds[0], // JS Fundamentals (6 lessons) — completed 4
      status: 'in_progress',
      progressPercent: 67,
      completedLessons: 4,
      lessonProgress: [
        { lessonId: jsLesson1, completed: true, completedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000) },
        { lessonId: jsLesson2, completed: true, completedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000) },
        { lessonId: jsLesson3, completed: true, completedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000) },
        { lessonId: jsLesson4, completed: true, completedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) },
      ],
      startedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      userId: joaoId,
      trackId: trackIds[1], // React (4 lessons) — completed 1
      status: 'in_progress',
      progressPercent: 25,
      completedLessons: 1,
      lessonProgress: [
        { lessonId: reactLesson1, completed: true, completedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000) },
      ],
      startedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      userId: mariaId,
      trackId: trackIds[0], // JS Fundamentals (6 lessons) — completed 2
      status: 'in_progress',
      progressPercent: 33,
      completedLessons: 2,
      lessonProgress: [
        { lessonId: jsLesson1, completed: true, completedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000) },
        { lessonId: jsLesson2, completed: true, completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) },
      ],
      startedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  console.log('  ✅ Progresso criado');

  // ==================== SESSIONS ====================
  console.log('📅 Criando sessões...');
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  tomorrow.setHours(14, 0, 0, 0);

  const dayAfter = new Date(now);
  dayAfter.setDate(now.getDate() + 3);
  dayAfter.setHours(10, 0, 0, 0);

  const nextWeek = new Date(now);
  nextWeek.setDate(now.getDate() + 7);
  nextWeek.setHours(16, 0, 0, 0);

  const lastWeek = new Date(now);
  lastWeek.setDate(now.getDate() - 5);
  lastWeek.setHours(14, 0, 0, 0);

  await db.collection('sessions').insertMany([
    {
      userId: joaoId,
      mentorId: adminId,
      title: 'Revisão de Código - Projeto E-commerce',
      description: 'Revisão do código do projeto de e-commerce, foco em padrões React',
      scheduledAt: tomorrow,
      durationMinutes: 60,
      status: 'scheduled',
      meetingUrl: 'https://meet.google.com/abc-defg-hij',
      recordingUrl: '',
      notes: '',
      topics: ['React', 'Code Review', 'Clean Code'],
      type: 'code_review',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      userId: joaoId,
      mentorId: adminId,
      title: 'Mentoria - Hooks Avançados do React',
      description: 'Estudar useReducer, useContext, custom hooks',
      scheduledAt: dayAfter,
      durationMinutes: 60,
      status: 'scheduled',
      meetingUrl: 'https://meet.google.com/klm-nopq-rst',
      recordingUrl: '',
      notes: '',
      topics: ['React', 'Hooks', 'State Management'],
      type: 'mentoring',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      userId: joaoId,
      mentorId: adminId,
      title: 'Mock Interview - Frontend',
      description: 'Simulação de entrevista técnica focada em frontend',
      scheduledAt: nextWeek,
      durationMinutes: 90,
      status: 'scheduled',
      meetingUrl: '',
      recordingUrl: '',
      notes: '',
      topics: ['Interview', 'Frontend', 'Problem Solving'],
      type: 'mock_interview',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      userId: joaoId,
      mentorId: adminId,
      title: 'Mentoria - Fundamentos de JavaScript',
      description: 'Closures, prototypes, event loop',
      scheduledAt: lastWeek,
      durationMinutes: 60,
      status: 'completed',
      meetingUrl: '',
      recordingUrl: 'https://drive.google.com/recording-1',
      notes: 'Estudar mais sobre event loop, praticar com exercícios',
      topics: ['JavaScript', 'Fundamentos'],
      type: 'mentoring',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      userId: mariaId,
      mentorId: adminId,
      title: 'Mentoria - Primeiros Passos com JavaScript',
      description: 'Variáveis, tipos, condicionais',
      scheduledAt: tomorrow,
      durationMinutes: 60,
      status: 'scheduled',
      meetingUrl: 'https://meet.google.com/uvw-xyza-bcd',
      recordingUrl: '',
      notes: '',
      topics: ['JavaScript', 'Fundamentos'],
      type: 'mentoring',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  console.log('  ✅ Sessões criadas');

  // ==================== CHANNELS ====================
  console.log('💬 Criando canais da comunidade...');
  const channels = await db.collection('channels').insertMany([
    { name: 'Geral', description: 'Discussões gerais sobre programação', icon: 'Hash', order: 1, isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { name: 'Dúvidas', description: 'Tire suas dúvidas técnicas', icon: 'HelpCircle', order: 2, isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { name: 'Code Reviews', description: 'Compartilhe e revise código', icon: 'Code', order: 3, isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { name: 'Vagas', description: 'Oportunidades de emprego', icon: 'Briefcase', order: 4, isActive: true, createdAt: new Date(), updatedAt: new Date() },
    { name: 'Off-Topic', description: 'Conversas livres', icon: 'Coffee', order: 5, isActive: true, createdAt: new Date(), updatedAt: new Date() },
  ]);
  console.log(`  ✅ ${channels.insertedCount} canais criados`);

  const channelIds = Object.values(channels.insertedIds);

  // ==================== MESSAGES ====================
  console.log('💬 Criando mensagens...');
  await db.collection('messages').insertMany([
    {
      channelId: channelIds[0], // Geral
      userId: adminId,
      content: 'Bem-vindos ao Codespace! 🚀 Este é o canal geral para discussões sobre programação. Fiquem à vontade para participar!',
      isPinned: true,
      likes: [joaoId, mariaId],
      replyCount: 2,
      parentMessageId: null,
      attachments: [],
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
    {
      channelId: channelIds[0],
      userId: joaoId,
      content: 'Valeu! Estou muito animado com a trilha de React. Já comecei os exercícios!',
      isPinned: false,
      likes: [adminId],
      replyCount: 0,
      parentMessageId: null,
      attachments: [],
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
    {
      channelId: channelIds[0],
      userId: mariaId,
      content: 'Oi pessoal! Acabei de entrar, estou começando com JavaScript. Alguém mais no mesmo caminho?',
      isPinned: false,
      likes: [adminId, joaoId],
      replyCount: 1,
      parentMessageId: null,
      attachments: [],
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
    {
      channelId: channelIds[1], // Dúvidas
      userId: joaoId,
      content: 'Alguém pode explicar a diferença entre useEffect e useLayoutEffect no React?',
      isPinned: false,
      likes: [mariaId],
      replyCount: 1,
      parentMessageId: null,
      attachments: [],
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
    {
      channelId: channelIds[3], // Vagas
      userId: adminId,
      content: '🔥 Vaga: Desenvolvedor React Jr na TechCorp - Remoto - R$4.000-6.000. Interessados falem comigo!',
      isPinned: true,
      likes: [joaoId, mariaId],
      replyCount: 3,
      parentMessageId: null,
      attachments: [],
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      updatedAt: new Date(),
    },
  ]);
  console.log('  ✅ Mensagens criadas');

  // ==================== SUBSCRIPTIONS ====================
  console.log('💳 Criando assinaturas...');
  const planIds = Object.values(plans.insertedIds);

  await db.collection('subscriptions').insertMany([
    {
      userId: joaoId,
      planId: planIds[1], // Profissional
      status: 'active',
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      billingCycle: 'monthly',
      amountPaid: 897,
      paymentMethod: 'credit_card',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      userId: mariaId,
      planId: planIds[0], // Essencial
      status: 'active',
      startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      billingCycle: 'monthly',
      amountPaid: 497,
      paymentMethod: 'pix',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  console.log('  ✅ Assinaturas criadas');

  // ==================== CHALLENGES ====================
  console.log('🧩 Criando desafios...');
  const challengeNow = new Date();
  const weekStart = new Date(challengeNow); weekStart.setDate(challengeNow.getDate() - challengeNow.getDay());
  const weekEnd = new Date(weekStart); weekEnd.setDate(weekStart.getDate() + 6);

  await db.collection('challenges').insertMany([
    {
      title: 'FizzBuzz Clássico',
      description: 'Implemente o clássico FizzBuzz: para números de 1 a N, imprima "Fizz" se divisível por 3, "Buzz" se divisível por 5, "FizzBuzz" se divisível por ambos.',
      instructions: 'Crie uma função fizzBuzz(n) que retorna um array de strings.',
      difficulty: 'easy',
      tags: ['lógica', 'loops'],
      category: 'Lógica',
      points: 10,
      starterCode: 'function fizzBuzz(n) {\n  // seu código aqui\n}',
      solutionCode: 'function fizzBuzz(n) {\n  const result = [];\n  for (let i = 1; i <= n; i++) {\n    if (i % 15 === 0) result.push("FizzBuzz");\n    else if (i % 3 === 0) result.push("Fizz");\n    else if (i % 5 === 0) result.push("Buzz");\n    else result.push(String(i));\n  }\n  return result;\n}',
      testCases: [
        { input: '5', expectedOutput: '["1","2","Fizz","4","Buzz"]', isHidden: false },
        { input: '15', expectedOutput: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]', isHidden: false },
      ],
      isActive: true, isWeekly: false, totalSubmissions: 42, totalCompletions: 35,
      createdAt: new Date(), updatedAt: new Date(),
    },
    {
      title: 'Palíndromo Checker',
      description: 'Verifique se uma string é um palíndromo, ignorando espaços e acentuação.',
      instructions: 'Crie uma função isPalindrome(str) que retorna true/false.',
      difficulty: 'easy',
      tags: ['strings', 'lógica'],
      category: 'Strings',
      points: 10,
      starterCode: 'function isPalindrome(str) {\n  // seu código aqui\n}',
      solutionCode: 'function isPalindrome(str) {\n  const clean = str.toLowerCase().replace(/[^a-z0-9]/g, "");\n  return clean === clean.split("").reverse().join("");\n}',
      testCases: [
        { input: '"racecar"', expectedOutput: 'true', isHidden: false },
        { input: '"hello"', expectedOutput: 'false', isHidden: false },
      ],
      isActive: true, isWeekly: false, totalSubmissions: 28, totalCompletions: 22,
      createdAt: new Date(), updatedAt: new Date(),
    },
    {
      title: 'Soma de Dois Números',
      description: 'Dado um array de inteiros e um target, retorne os índices dos dois números cuja soma é igual ao target.',
      instructions: 'Crie uma função twoSum(nums, target) que retorna [i, j].',
      difficulty: 'medium',
      tags: ['arrays', 'hash-map'],
      category: 'Arrays',
      points: 25,
      starterCode: 'function twoSum(nums, target) {\n  // seu código aqui\n}',
      solutionCode: 'function twoSum(nums, target) {\n  const map = {};\n  for (let i = 0; i < nums.length; i++) {\n    const comp = target - nums[i];\n    if (map[comp] !== undefined) return [map[comp], i];\n    map[nums[i]] = i;\n  }\n}',
      testCases: [
        { input: '[2,7,11,15], 9', expectedOutput: '[0,1]', isHidden: false },
        { input: '[3,2,4], 6', expectedOutput: '[1,2]', isHidden: true },
      ],
      isActive: true, isWeekly: false, totalSubmissions: 65, totalCompletions: 40,
      createdAt: new Date(), updatedAt: new Date(),
    },
    {
      title: 'Desafio da Semana: Flatten Array',
      description: 'Implemente uma função que "achata" um array multidimensional em um array unidimensional, sem usar .flat().',
      instructions: 'Crie uma função flatten(arr) que retorna um array plano.',
      difficulty: 'medium',
      tags: ['recursão', 'arrays'],
      category: 'Arrays',
      points: 50,
      starterCode: 'function flatten(arr) {\n  // seu código aqui\n}',
      solutionCode: 'function flatten(arr) {\n  const result = [];\n  for (const item of arr) {\n    if (Array.isArray(item)) result.push(...flatten(item));\n    else result.push(item);\n  }\n  return result;\n}',
      testCases: [
        { input: '[1,[2,[3,4],5]]', expectedOutput: '[1,2,3,4,5]', isHidden: false },
      ],
      isActive: true, isWeekly: true, weekStart, weekEnd, totalSubmissions: 18, totalCompletions: 8,
      createdAt: new Date(), updatedAt: new Date(),
    },
    {
      title: 'Binary Search',
      description: 'Implemente a busca binária em um array ordenado.',
      difficulty: 'hard',
      tags: ['algoritmos', 'busca'],
      category: 'Algoritmos',
      points: 50,
      starterCode: 'function binarySearch(arr, target) {\n  // seu código aqui\n}',
      solutionCode: 'function binarySearch(arr, target) {\n  let lo = 0, hi = arr.length - 1;\n  while (lo <= hi) {\n    const mid = Math.floor((lo + hi) / 2);\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) lo = mid + 1;\n    else hi = mid - 1;\n  }\n  return -1;\n}',
      testCases: [
        { input: '[1,3,5,7,9], 5', expectedOutput: '2', isHidden: false },
        { input: '[1,3,5,7,9], 6', expectedOutput: '-1', isHidden: false },
      ],
      isActive: true, isWeekly: false, totalSubmissions: 30, totalCompletions: 18,
      createdAt: new Date(), updatedAt: new Date(),
    },
  ]);
  console.log('  ✅ Desafios criados');

  // ==================== JOBS ====================
  console.log('💼 Criando vagas...');
  await db.collection('jobs').insertMany([
    {
      title: 'Desenvolvedor React Jr',
      company: 'TechCorp',
      companyLogo: '',
      description: 'Estamos buscando um dev React Jr para trabalhar em projetos inovadores. Ambiente descontraído, crescimento rápido.',
      requirements: 'React, TypeScript, Git, conhecimento básico de REST APIs.',
      benefits: 'VA/VR, Plano de saúde, Home office, PLR, Day off no aniversário.',
      type: 'remote',
      location: 'Brasil',
      level: 'junior',
      salaryRange: 'R$ 4.000 - R$ 6.000',
      tags: ['React', 'TypeScript', 'Frontend'],
      requiredSkills: ['React', 'TypeScript', 'CSS', 'Git'],
      isActive: true, isExclusive: true, isFeatured: true,
      applicationsCount: 12,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      createdAt: new Date(), updatedAt: new Date(),
    },
    {
      title: 'Fullstack Developer Pleno',
      company: 'Startup XYZ',
      description: 'Buscamos dev fullstack para liderar features. Stack: Node.js + React.',
      requirements: 'Node.js, React, PostgreSQL, Docker, 2+ anos de experiência.',
      benefits: 'Equity, plano de saúde e dental, horário flexível.',
      type: 'hybrid',
      location: 'São Paulo, SP',
      level: 'pleno',
      salaryRange: 'R$ 8.000 - R$ 12.000',
      tags: ['Node.js', 'React', 'Fullstack', 'PostgreSQL'],
      requiredSkills: ['Node.js', 'React', 'PostgreSQL', 'Docker'],
      isActive: true, isExclusive: false, isFeatured: true,
      applicationsCount: 8,
      expiresAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      createdAt: new Date(), updatedAt: new Date(),
    },
    {
      title: 'Backend Developer Node.js',
      company: 'FinTech Brasil',
      description: 'Oportunidade para trabalhar com APIs de alto throughput no mercado financeiro.',
      requirements: 'Node.js, NestJS, MongoDB, Redis, mensageria (RabbitMQ/Kafka).',
      benefits: 'Salário competitivo, bônus trimestral, home office integral.',
      type: 'remote',
      location: 'Brasil',
      level: 'pleno',
      salaryRange: 'R$ 10.000 - R$ 15.000',
      tags: ['Node.js', 'NestJS', 'Backend', 'MongoDB'],
      requiredSkills: ['Node.js', 'NestJS', 'MongoDB', 'Redis'],
      isActive: true, isExclusive: true, isFeatured: false,
      applicationsCount: 5,
      expiresAt: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
      createdAt: new Date(), updatedAt: new Date(),
    },
    {
      title: 'Estagiário Frontend',
      company: 'AgênciaWeb',
      description: 'Vaga de estágio para dev frontend. Oportunidade de aprendizado prático.',
      requirements: 'HTML, CSS, JavaScript básico. Cursando SI ou CC.',
      benefits: 'Bolsa R$1.500, horário flexível, mentoria.',
      type: 'onsite',
      location: 'Rio de Janeiro, RJ',
      level: 'junior',
      salaryRange: 'R$ 1.500',
      tags: ['HTML', 'CSS', 'JavaScript', 'Estágio'],
      requiredSkills: ['HTML', 'CSS', 'JavaScript'],
      isActive: true, isExclusive: false, isFeatured: false,
      applicationsCount: 20,
      expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      createdAt: new Date(), updatedAt: new Date(),
    },
    {
      title: 'Tech Lead Frontend',
      company: 'MegaSoft',
      description: 'Lidere o time de frontend em uma empresa global. Design system, performance, CI/CD.',
      requirements: '5+ anos com React/Vue, liderança técnica, Design Systems, testes automatizados.',
      benefits: 'Salário em USD, equity, plano internacional de saúde.',
      type: 'remote',
      location: 'Global',
      level: 'senior',
      salaryRange: 'US$ 5.000 - US$ 8.000',
      tags: ['React', 'Leadership', 'Design System', 'Senior'],
      requiredSkills: ['React', 'TypeScript', 'CI/CD', 'Testing'],
      isActive: true, isExclusive: true, isFeatured: true,
      applicationsCount: 3,
      expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      createdAt: new Date(), updatedAt: new Date(),
    },
  ]);
  console.log('  ✅ Vagas criadas');

  // ==================== INTERVIEW QUESTIONS ====================
  console.log('🧠 Criando questões de entrevista...');
  await db.collection('interviewquestions').insertMany([
    {
      title: 'Qual a diferença entre let, const e var?',
      question: 'Explique as diferenças entre let, const e var em JavaScript. Quando usar cada um?',
      hints: 'Pense em escopo, hoisting e reatribuição.',
      idealAnswer: 'var tem escopo de função e sofre hoisting. let tem escopo de bloco e permite reatribuição. const tem escopo de bloco e não permite reatribuição (mas objetos são mutáveis).',
      type: 'technical', level: 'junior', category: 'JavaScript', tags: ['JavaScript', 'ES6'], timeLimitMinutes: 3, isActive: true,
      createdAt: new Date(), updatedAt: new Date(),
    },
    {
      title: 'O que é Closure?',
      question: 'Explique o conceito de closure em JavaScript e dê um exemplo prático.',
      hints: 'Pense em funções retornando funções e escopo léxico.',
      idealAnswer: 'Closure é quando uma função interna tem acesso às variáveis da função externa, mesmo após a função externa ter retornado. Exemplo: função que retorna um contador.',
      type: 'technical', level: 'junior', category: 'JavaScript', tags: ['JavaScript', 'Fundamentos'], timeLimitMinutes: 5, isActive: true,
      createdAt: new Date(), updatedAt: new Date(),
    },
    {
      title: 'Conte sobre um desafio que superou',
      question: 'Descreva uma situação desafiadora que você enfrentou no trabalho e como a superou.',
      hints: 'Use a técnica STAR: Situação, Tarefa, Ação, Resultado.',
      idealAnswer: 'Uma boa resposta descreve a situação com contexto, a tarefa/desafio específico, as ações tomadas e os resultados mensuráveis alcançados.',
      type: 'behavioral', level: 'junior', category: 'Soft Skills', tags: ['Comportamental', 'STAR'], timeLimitMinutes: 5, isActive: true,
      createdAt: new Date(), updatedAt: new Date(),
    },
    {
      title: 'Explique o Virtual DOM do React',
      question: 'O que é o Virtual DOM? Por que o React o utiliza e como funciona o processo de reconciliação?',
      hints: 'Pense em performance, diffing algorithm, batch updates.',
      idealAnswer: 'O Virtual DOM é uma representação em memória do DOM real. O React compara versões do VDOM (diffing), calcula as mudanças mínimas e aplica-as ao DOM real (reconciliação), otimizando performance.',
      type: 'technical', level: 'pleno', category: 'React', tags: ['React', 'Performance'], timeLimitMinutes: 5, isActive: true,
      createdAt: new Date(), updatedAt: new Date(),
    },
    {
      title: 'Design de API REST',
      question: 'Você precisa projetar uma API REST para um sistema de e-commerce. Quais endpoints, métodos HTTP e status codes você usaria para o CRUD de produtos?',
      hints: 'Pense em REST, recursos, verbos HTTP, paginação, erros.',
      idealAnswer: 'GET /products (listar com paginação), GET /products/:id (detalhe), POST /products (criar), PUT /products/:id (atualizar completo), PATCH /products/:id (parcial), DELETE /products/:id. Status: 200 OK, 201 Created, 204 No Content, 400 Bad Request, 404 Not Found.',
      type: 'system-design', level: 'pleno', category: 'Arquitetura', tags: ['API', 'REST', 'Design'], timeLimitMinutes: 10, isActive: true,
      createdAt: new Date(), updatedAt: new Date(),
    },
    {
      title: 'Implemente debounce',
      question: 'Implemente uma função debounce em JavaScript. Explique para que serve e quando usaria.',
      hints: 'setTimeout, clearTimeout, contexto this, argumentos.',
      idealAnswer: 'Debounce adia a execução de uma função até que um período de inatividade passe. Útil para inputs de busca, resize. Implementação usa setTimeout + clearTimeout.',
      type: 'coding', level: 'pleno', category: 'JavaScript', tags: ['JavaScript', 'Padrões'], timeLimitMinutes: 8, isActive: true,
      createdAt: new Date(), updatedAt: new Date(),
    },
    {
      title: 'Escalabilidade de Microserviços',
      question: 'Como você projetaria a arquitetura de uma plataforma de streaming de vídeo para suportar 1 milhão de usuários simultâneos?',
      hints: 'CDN, cache, load balancing, microserviços, filas, banco de dados.',
      idealAnswer: 'CDN para distribuição de vídeo, Load Balancer com auto-scaling, microserviços separados (auth, catalog, streaming, billing), cache com Redis, fila para processamento assíncrono de vídeos, banco NoSQL para catálogo.',
      type: 'system-design', level: 'senior', category: 'Arquitetura', tags: ['System Design', 'Escalabilidade'], timeLimitMinutes: 15, isActive: true,
      createdAt: new Date(), updatedAt: new Date(),
    },
    {
      title: 'Como você lida com conflitos no time?',
      question: 'Descreva como você lidaria com um conflito técnico com um colega sobre a escolha de tecnologia para um projeto.',
      hints: 'Comunicação, dados, trade-offs, decisão em equipe.',
      idealAnswer: 'Ouvir o ponto de vista do colega, apresentar dados/métricas para sustentar sua opinião, avaliar trade-offs juntos, buscar consenso. Se necessário, propor um spike/POC para validar ambas abordagens.',
      type: 'behavioral', level: 'pleno', category: 'Soft Skills', tags: ['Comunicação', 'Teamwork'], timeLimitMinutes: 5, isActive: true,
      createdAt: new Date(), updatedAt: new Date(),
    },
  ]);
  console.log('  ✅ Questões de entrevista criadas');

  // ==================== PROJECTS ====================
  console.log('📁 Criando projetos...');
  await db.collection('projects').insertMany([
    {
      title: 'Landing Page Responsiva',
      description: 'Crie uma landing page moderna e responsiva usando HTML, CSS e JavaScript.',
      longDescription: 'Neste projeto você irá construir uma landing page profissional do zero. Inclui header com navegação, hero section, seção de features, depoimentos, pricing e footer. Deve ser 100% responsiva.',
      difficulty: 'beginner',
      category: 'Frontend',
      technologies: ['HTML', 'CSS', 'JavaScript'],
      features: ['Design responsivo', 'Animações CSS', 'Menu hambúrguer mobile', 'Scroll suave', 'Formulário de contato'],
      estimatedHours: 8,
      participants: 15,
      isActive: true, isFeatured: true,
      learningGoals: ['Semântica HTML', 'Flexbox/Grid', 'Media queries', 'JavaScript DOM'],
      createdAt: new Date(), updatedAt: new Date(),
    },
    {
      title: 'Todo App com React',
      description: 'Aplicação de tarefas completa com React, estado local e persistência no localStorage.',
      longDescription: 'Construa um gerenciador de tarefas com React. Funcionalidades: adicionar, editar, excluir, marcar como concluída, filtros (todas/ativas/concluídas), drag and drop para reordenar, dark mode.',
      difficulty: 'beginner',
      category: 'Frontend',
      technologies: ['React', 'TypeScript', 'Tailwind CSS'],
      features: ['CRUD de tarefas', 'Filtros', 'LocalStorage', 'Drag and Drop', 'Dark Mode'],
      estimatedHours: 12,
      participants: 22,
      isActive: true, isFeatured: false,
      learningGoals: ['React hooks', 'Estado e props', 'TypeScript básico', 'Persistência local'],
      createdAt: new Date(), updatedAt: new Date(),
    },
    {
      title: 'API REST com Node.js',
      description: 'Crie uma API RESTful completa para um sistema de blog com autenticação JWT.',
      longDescription: 'Desenvolva uma API com NestJS/Express para um sistema de blog. Inclui: autenticação JWT, CRUD de posts e comentários, upload de imagens, paginação, roles de admin/user.',
      difficulty: 'intermediate',
      category: 'Backend',
      technologies: ['Node.js', 'NestJS', 'MongoDB', 'JWT'],
      features: ['Autenticação JWT', 'CRUD completo', 'Upload de imagens', 'Paginação', 'Roles e permissões'],
      estimatedHours: 20,
      participants: 10,
      isActive: true, isFeatured: true,
      learningGoals: ['NestJS modules', 'MongoDB/Mongoose', 'JWT auth', 'REST best practices'],
      createdAt: new Date(), updatedAt: new Date(),
    },
    {
      title: 'Clone do Twitter',
      description: 'Recrie as funcionalidades principais do Twitter: posts, likes, follows, timeline em tempo real.',
      longDescription: 'Projeto fullstack ambicioso: frontend em React + backend em Node.js. Funcionalidades: criar tweets, curtir, retweet, seguir usuários, timeline personalizada, notificações em tempo real com WebSockets.',
      difficulty: 'advanced',
      category: 'Fullstack',
      technologies: ['React', 'Node.js', 'MongoDB', 'Socket.io', 'Redis'],
      features: ['Timeline em tempo real', 'Sistema de follows', 'Likes e retweets', 'Notificações push', 'Upload de mídia', 'Busca de usuários'],
      estimatedHours: 40,
      participants: 4,
      isActive: true, isFeatured: true,
      learningGoals: ['WebSockets', 'Arquitetura fullstack', 'Cache com Redis', 'Modelagem NoSQL'],
      createdAt: new Date(), updatedAt: new Date(),
    },
    {
      title: 'Dashboard de Analytics',
      description: 'Construa um dashboard interativo com gráficos, tabelas e filtros usando React e Chart.js.',
      difficulty: 'intermediate',
      category: 'Frontend',
      technologies: ['React', 'TypeScript', 'Chart.js', 'Tailwind CSS'],
      features: ['Gráficos interativos', 'Tabelas com paginação', 'Filtros dinâmicos', 'Export para CSV', 'Responsivo'],
      estimatedHours: 16,
      participants: 7,
      isActive: true, isFeatured: false,
      learningGoals: ['Visualização de dados', 'Chart.js com React', 'Componentes reutilizáveis'],
      createdAt: new Date(), updatedAt: new Date(),
    },
  ]);
  console.log('  ✅ Projetos criados');

  // ==================== RESOURCES ====================
  console.log('📚 Criando recursos...');
  await db.collection('resources').insertMany([
    {
      title: 'JavaScript: O Guia Definitivo',
      description: 'E-book completo cobrindo JavaScript do básico ao avançado, incluindo ES6+, async/await e padrões de projeto.',
      type: 'ebook',
      category: 'JavaScript',
      tags: ['JavaScript', 'ES6', 'Fundamentos'],
      externalUrl: 'https://example.com/js-guide',
      downloads: 145, views: 520, likes: 89,
      isActive: true, isFeatured: true,
      author: 'Codespace Team',
      difficulty: 'beginner',
      estimatedReadTime: 120,
      createdAt: new Date(), updatedAt: new Date(),
    },
    {
      title: 'React Hooks Cheatsheet',
      description: 'Referência rápida de todos os hooks do React com exemplos práticos e boas práticas.',
      type: 'cheatsheet',
      category: 'React',
      tags: ['React', 'Hooks', 'Referência'],
      externalUrl: 'https://example.com/react-hooks-cheat',
      downloads: 230, views: 680, likes: 156,
      isActive: true, isFeatured: true,
      author: 'Codespace Team',
      difficulty: 'beginner',
      estimatedReadTime: 15,
      createdAt: new Date(), updatedAt: new Date(),
    },
    {
      title: 'Curso: Node.js do Zero ao Deploy',
      description: 'Videoaulas completas sobre Node.js: Express, NestJS, MongoDB, Docker, deploy na AWS.',
      type: 'video',
      category: 'Node.js',
      tags: ['Node.js', 'Backend', 'Deploy'],
      externalUrl: 'https://example.com/nodejs-course',
      downloads: 0, views: 320, likes: 98,
      isActive: true, isFeatured: false,
      author: 'Codespace Team',
      difficulty: 'intermediate',
      estimatedReadTime: 480,
      createdAt: new Date(), updatedAt: new Date(),
    },
    {
      title: 'Git & GitHub: Guia Prático',
      description: 'Artigo completo sobre Git: branches, merge, rebase, cherry-pick, resolução de conflitos e workflows.',
      type: 'article',
      category: 'DevOps',
      tags: ['Git', 'GitHub', 'Versionamento'],
      externalUrl: 'https://example.com/git-guide',
      downloads: 67, views: 410, likes: 72,
      isActive: true, isFeatured: false,
      author: 'Codespace Team',
      difficulty: 'beginner',
      estimatedReadTime: 25,
      createdAt: new Date(), updatedAt: new Date(),
    },
    {
      title: 'Template: Projeto React + TypeScript + Vite',
      description: 'Boilerplate pronto com React 19, TypeScript, Vite, Tailwind CSS, ESLint, Prettier e estrutura de pastas profissional.',
      type: 'template',
      category: 'React',
      tags: ['React', 'TypeScript', 'Boilerplate', 'Vite'],
      externalUrl: 'https://github.com/example/react-template',
      downloads: 312, views: 890, likes: 201,
      isActive: true, isFeatured: true,
      author: 'Codespace Team',
      difficulty: 'beginner',
      estimatedReadTime: 10,
      createdAt: new Date(), updatedAt: new Date(),
    },
    {
      title: 'TypeScript Cheatsheet Avançado',
      description: 'Generics, Utility Types, Conditional Types, Template Literal Types e muito mais.',
      type: 'cheatsheet',
      category: 'TypeScript',
      tags: ['TypeScript', 'Avançado', 'Tipos'],
      externalUrl: 'https://example.com/ts-advanced',
      downloads: 178, views: 540, likes: 120,
      isActive: true, isFeatured: false,
      author: 'Codespace Team',
      difficulty: 'intermediate',
      estimatedReadTime: 20,
      createdAt: new Date(), updatedAt: new Date(),
    },
    {
      title: 'Figma para Devs',
      description: 'Ferramenta e guia prático: como extrair specs, cores, tipografia e assets do Figma para implementação.',
      type: 'tool',
      category: 'Design',
      tags: ['Figma', 'Design', 'UI/UX'],
      externalUrl: 'https://example.com/figma-devs',
      downloads: 95, views: 350, likes: 64,
      isActive: true, isFeatured: false,
      author: 'Codespace Team',
      difficulty: 'beginner',
      estimatedReadTime: 30,
      createdAt: new Date(), updatedAt: new Date(),
    },
    {
      title: 'System Design: Guia Completo para Entrevistas',
      description: 'Artigo detalhado sobre como abordar problemas de system design em entrevistas técnicas.',
      type: 'article',
      category: 'Carreira',
      tags: ['System Design', 'Entrevistas', 'Arquitetura'],
      externalUrl: 'https://example.com/system-design-guide',
      downloads: 134, views: 720, likes: 186,
      isActive: true, isFeatured: true,
      author: 'Codespace Team',
      difficulty: 'advanced',
      estimatedReadTime: 45,
      createdAt: new Date(), updatedAt: new Date(),
    },
  ]);
  console.log('  ✅ Recursos criados');

  console.log('\n🎉 Seed concluído com sucesso!');
  console.log('📧 Credenciais de teste:');
  console.log('   Admin: admin@codespace.com.br / 123456');
  console.log('   João:  joao@example.com / 123456');
  console.log('   Maria: maria@example.com / 123456');

  await connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Erro no seed:', err);
  process.exit(1);
});
