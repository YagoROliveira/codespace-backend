"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var bcrypt = require("bcryptjs");
var dotenv = require("dotenv");
dotenv.config();
var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/codespace_dev';
function seed() {
    return __awaiter(this, void 0, void 0, function () {
        var db, collections, _i, collections_1, col, _a, plans, hashedPassword, users, adminId, joaoId, mariaId, tracks, trackIds, now, tomorrow, dayAfter, nextWeek, lastWeek, channels, channelIds, planIds;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log('🌱 Conectando ao MongoDB...');
                    return [4 /*yield*/, (0, mongoose_1.connect)(MONGODB_URI)];
                case 1:
                    _b.sent();
                    console.log('✅ Conectado!');
                    db = mongoose_1.connection.db;
                    // Clear existing data
                    console.log('🗑️  Limpando dados existentes...');
                    collections = ['users', 'tracks', 'sessions', 'channels', 'messages', 'plans', 'subscriptions', 'usertrackprogresses'];
                    _i = 0, collections_1 = collections;
                    _b.label = 2;
                case 2:
                    if (!(_i < collections_1.length)) return [3 /*break*/, 7];
                    col = collections_1[_i];
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, db.collection(col).drop()];
                case 4:
                    _b.sent();
                    return [3 /*break*/, 6];
                case 5:
                    _a = _b.sent();
                    return [3 /*break*/, 6];
                case 6:
                    _i++;
                    return [3 /*break*/, 2];
                case 7:
                    // ==================== PLANS ====================
                    console.log('📋 Criando planos...');
                    return [4 /*yield*/, db.collection('plans').insertMany([
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
                        ])];
                case 8:
                    plans = _b.sent();
                    console.log("  \u2705 ".concat(plans.insertedCount, " planos criados"));
                    // ==================== USERS ====================
                    console.log('👤 Criando usuários...');
                    return [4 /*yield*/, bcrypt.hash('123456', 12)];
                case 9:
                    hashedPassword = _b.sent();
                    return [4 /*yield*/, db.collection('users').insertMany([
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
                        ])];
                case 10:
                    users = _b.sent();
                    console.log("  \u2705 ".concat(users.insertedCount, " usu\u00E1rios criados"));
                    adminId = users.insertedIds[0];
                    joaoId = users.insertedIds[1];
                    mariaId = users.insertedIds[2];
                    // ==================== TRACKS ====================
                    console.log('🛤️  Criando trilhas...');
                    return [4 /*yield*/, db.collection('tracks').insertMany([
                            {
                                title: 'Fundamentos de JavaScript',
                                description: 'Domine os fundamentos do JavaScript desde variáveis até async/await. A base essencial para qualquer desenvolvedor web.',
                                icon: 'Code2',
                                color: '#F7DF1E',
                                tags: ['JavaScript', 'Fundamentos', 'Web'],
                                difficulty: 'beginner',
                                totalLessons: 24,
                                estimatedHours: 40,
                                lessons: [
                                    { title: 'Introdução ao JavaScript', description: 'O que é JS e como funciona', videoUrl: '', content: '', durationMinutes: 30, order: 1 },
                                    { title: 'Variáveis e Tipos', description: 'let, const, var, tipos primitivos', videoUrl: '', content: '', durationMinutes: 45, order: 2 },
                                    { title: 'Operadores', description: 'Aritméticos, lógicos, comparação', videoUrl: '', content: '', durationMinutes: 30, order: 3 },
                                    { title: 'Condicionais', description: 'if/else, switch, ternário', videoUrl: '', content: '', durationMinutes: 40, order: 4 },
                                    { title: 'Loops', description: 'for, while, do-while, for...of', videoUrl: '', content: '', durationMinutes: 35, order: 5 },
                                    { title: 'Funções', description: 'Declaração, arrow functions, callbacks', videoUrl: '', content: '', durationMinutes: 50, order: 6 },
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
                                totalLessons: 32,
                                estimatedHours: 56,
                                lessons: [
                                    { title: 'O que é React?', description: 'Virtual DOM, JSX, componentes', videoUrl: '', content: '', durationMinutes: 30, order: 1 },
                                    { title: 'Criando o Primeiro Componente', description: 'Function components, props', videoUrl: '', content: '', durationMinutes: 40, order: 2 },
                                    { title: 'useState e Eventos', description: 'State management básico', videoUrl: '', content: '', durationMinutes: 45, order: 3 },
                                    { title: 'useEffect', description: 'Side effects, cleanup, dependencies', videoUrl: '', content: '', durationMinutes: 50, order: 4 },
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
                                totalLessons: 28,
                                estimatedHours: 48,
                                lessons: [
                                    { title: 'Introdução ao Node.js', description: 'Runtime, npm, módulos', videoUrl: '', content: '', durationMinutes: 35, order: 1 },
                                    { title: 'Express Básico', description: 'Rotas, middleware, request/response', videoUrl: '', content: '', durationMinutes: 45, order: 2 },
                                    { title: 'MongoDB e Mongoose', description: 'NoSQL, schemas, queries', videoUrl: '', content: '', durationMinutes: 50, order: 3 },
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
                                totalLessons: 20,
                                estimatedHours: 35,
                                lessons: [
                                    { title: 'Por que TypeScript?', description: 'Vantagens, setup, tsconfig', videoUrl: '', content: '', durationMinutes: 30, order: 1 },
                                    { title: 'Tipos Básicos', description: 'string, number, boolean, arrays', videoUrl: '', content: '', durationMinutes: 40, order: 2 },
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
                                totalLessons: 18,
                                estimatedHours: 30,
                                lessons: [
                                    { title: 'Introdução ao Docker', description: 'Containers, images, Dockerfile', videoUrl: '', content: '', durationMinutes: 45, order: 1 },
                                    { title: 'Docker Compose', description: 'Multi-container apps', videoUrl: '', content: '', durationMinutes: 40, order: 2 },
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
                                totalLessons: 16,
                                estimatedHours: 28,
                                lessons: [
                                    { title: 'SOLID Principles', description: 'SRP, OCP, LSP, ISP, DIP', videoUrl: '', content: '', durationMinutes: 60, order: 1 },
                                    { title: 'Clean Architecture', description: 'Layered architecture, dependencies', videoUrl: '', content: '', durationMinutes: 55, order: 2 },
                                ],
                                requiredPlans: ['elite'],
                                isPublished: true,
                                order: 6,
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            },
                        ])];
                case 11:
                    tracks = _b.sent();
                    console.log("  \u2705 ".concat(tracks.insertedCount, " trilhas criadas"));
                    // ==================== USER TRACK PROGRESS ====================
                    console.log('📊 Criando progresso dos usuários...');
                    trackIds = Object.values(tracks.insertedIds);
                    return [4 /*yield*/, db.collection('usertrackprogresses').insertMany([
                            {
                                userId: joaoId,
                                trackId: trackIds[0], // JS Fundamentals
                                status: 'in_progress',
                                progressPercent: 65,
                                completedLessons: 16,
                                lessonProgress: [],
                                startedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            },
                            {
                                userId: joaoId,
                                trackId: trackIds[1], // React
                                status: 'in_progress',
                                progressPercent: 30,
                                completedLessons: 10,
                                lessonProgress: [],
                                startedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            },
                            {
                                userId: mariaId,
                                trackId: trackIds[0], // JS Fundamentals
                                status: 'in_progress',
                                progressPercent: 25,
                                completedLessons: 6,
                                lessonProgress: [],
                                startedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            },
                        ])];
                case 12:
                    _b.sent();
                    console.log('  ✅ Progresso criado');
                    // ==================== SESSIONS ====================
                    console.log('📅 Criando sessões...');
                    now = new Date();
                    tomorrow = new Date(now);
                    tomorrow.setDate(now.getDate() + 1);
                    tomorrow.setHours(14, 0, 0, 0);
                    dayAfter = new Date(now);
                    dayAfter.setDate(now.getDate() + 3);
                    dayAfter.setHours(10, 0, 0, 0);
                    nextWeek = new Date(now);
                    nextWeek.setDate(now.getDate() + 7);
                    nextWeek.setHours(16, 0, 0, 0);
                    lastWeek = new Date(now);
                    lastWeek.setDate(now.getDate() - 5);
                    lastWeek.setHours(14, 0, 0, 0);
                    return [4 /*yield*/, db.collection('sessions').insertMany([
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
                        ])];
                case 13:
                    _b.sent();
                    console.log('  ✅ Sessões criadas');
                    // ==================== CHANNELS ====================
                    console.log('💬 Criando canais da comunidade...');
                    return [4 /*yield*/, db.collection('channels').insertMany([
                            { name: 'Geral', description: 'Discussões gerais sobre programação', icon: 'Hash', order: 1, isActive: true, createdAt: new Date(), updatedAt: new Date() },
                            { name: 'Dúvidas', description: 'Tire suas dúvidas técnicas', icon: 'HelpCircle', order: 2, isActive: true, createdAt: new Date(), updatedAt: new Date() },
                            { name: 'Code Reviews', description: 'Compartilhe e revise código', icon: 'Code', order: 3, isActive: true, createdAt: new Date(), updatedAt: new Date() },
                            { name: 'Vagas', description: 'Oportunidades de emprego', icon: 'Briefcase', order: 4, isActive: true, createdAt: new Date(), updatedAt: new Date() },
                            { name: 'Off-Topic', description: 'Conversas livres', icon: 'Coffee', order: 5, isActive: true, createdAt: new Date(), updatedAt: new Date() },
                        ])];
                case 14:
                    channels = _b.sent();
                    console.log("  \u2705 ".concat(channels.insertedCount, " canais criados"));
                    channelIds = Object.values(channels.insertedIds);
                    // ==================== MESSAGES ====================
                    console.log('💬 Criando mensagens...');
                    return [4 /*yield*/, db.collection('messages').insertMany([
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
                        ])];
                case 15:
                    _b.sent();
                    console.log('  ✅ Mensagens criadas');
                    // ==================== SUBSCRIPTIONS ====================
                    console.log('💳 Criando assinaturas...');
                    planIds = Object.values(plans.insertedIds);
                    return [4 /*yield*/, db.collection('subscriptions').insertMany([
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
                        ])];
                case 16:
                    _b.sent();
                    console.log('  ✅ Assinaturas criadas');
                    console.log('\n🎉 Seed concluído com sucesso!');
                    console.log('📧 Credenciais de teste:');
                    console.log('   Admin: admin@codespace.com.br / 123456');
                    console.log('   João:  joao@example.com / 123456');
                    console.log('   Maria: maria@example.com / 123456');
                    return [4 /*yield*/, mongoose_1.connection.close()];
                case 17:
                    _b.sent();
                    process.exit(0);
                    return [2 /*return*/];
            }
        });
    });
}
seed().catch(function (err) {
    console.error('❌ Erro no seed:', err);
    process.exit(1);
});
