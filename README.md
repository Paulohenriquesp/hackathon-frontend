# 🎨 Hackathon Frontend - Banco Colaborativo de Recursos Didáticos

Interface web moderna em Next.js + TypeScript para sistema de compartilhamento de materiais didáticos com geração de planos de aula e atividades por IA.

## 🚀 Tecnologias

- **Framework**: Next.js 15 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS 4
- **UI Components**: Componentes customizados
- **Estado**: React Context API + TanStack Query (React Query)
- **Formulários**: React Hook Form + Validação
- **IA**: OpenAI GPT-4o-mini para geração de planos de aula e atividades
- **Build**: Turbopack (ultra-rápido)
- **Icons**: Lucide React

## ⚡ Quick Start

```bash
# 1. Instalar dependências
npm install

# 2. Configurar variáveis de ambiente
cp .env.example .env.local
# Adicionar OPENAI_API_KEY no backend

# 3. Executar desenvolvimento
npm run dev

# 4. Acessar aplicação
# http://localhost:3000
```

## 🔧 Scripts Disponíveis

```bash
npm run dev             # Desenvolvimento (Turbopack)
npm run build           # Build produção
npm run start           # Produção
npm run lint            # ESLint
```

## 🌐 Páginas e Rotas

### Públicas
- `/` - Homepage com apresentação
- `/login` - Autenticação de usuário
- `/register` - Cadastro de novo usuário
- `/materials` - Explorar materiais (busca, filtros, avaliações)

### Protegidas (Requer Login)
- `/dashboard` - Painel do usuário com estatísticas
- `/upload` - Compartilhar novo material
- `/materials/[id]` - Detalhes do material
- `/materials/[id]/edit` - Editar material
- `/materials/[id]/activities` - ✨ Gerar Plano de Aula + Atividades com IA

## 🎯 Funcionalidades

### 🏠 Homepage (`/`)
- Apresentação da plataforma
- Call-to-action para cadastro
- Navegação para materiais públicos
- Design responsivo e atrativo

### 👤 Autenticação
- **Login**: Formulário com validação
- **Registro**: Cadastro completo de professor
- **Proteção**: Rotas protegidas automaticamente
- **Persistência**: Token JWT no localStorage
- **Perfil**: Edição de dados pessoais e escola

### 📊 Dashboard (`/dashboard`)
- **Estatísticas pessoais**:
  - Total de materiais compartilhados
  - Total de downloads recebidos
  - Avaliação média dos materiais
  - Uploads do mês atual
- **Materiais recentes**: Lista com ações rápidas
- **Ações rápidas**:
  - Compartilhar novo material
  - Explorar materiais da comunidade
  - ✨ Gerar Plano de Aula + Atividades com IA (botão com ícone Sparkles)
  - Editar materiais existentes
  - Ver detalhes completos

### 📚 Exploração (`/materials`)
- **Busca avançada**: Por título, descrição, tags
- **Filtros múltiplos**:
  - Disciplina
  - Série/ano
  - Tipo de material
  - Dificuldade
  - Rating mínimo/máximo
  - Data de publicação
  - Autor
- **Ordenação**: Por data, rating, downloads, título
- **Paginação**: Load more com scroll infinito
- **Cards informativos**: Downloads, avaliações, autor, data
- **Avaliações**: Sistema de 5 estrelas com comentários (limite de 500 caracteres)
- **Download**: Autenticado com validação

### 🤖 Geração de Plano de Aula + Atividades com IA (`/materials/[id]/activities`)
- ✨ **NOVA FUNCIONALIDADE**: Integração com OpenAI GPT-4o-mini
- **Plano de Aula**:
  - Objetivos de aprendizagem
  - Conteúdo programático
  - Metodologia pedagógica
  - Recursos necessários
  - Avaliação
  - Tempo estimado
- **Atividades Educacionais**:
  - Múltiplas atividades personalizadas
  - Instruções detalhadas
  - Materiais necessários
  - Dicas pedagógicas
  - Variações de dificuldade
- **Interface com Tabs**: Navegação entre plano de aula e atividades
- **Exportação**: Download em formato Markdown (.md)
- **Estados de loading**: Feedback visual durante geração
- **Tratamento de erros**: Mensagens claras em caso de falha
- **Acesso rápido**: Botão disponível em cards de materiais e dashboard

### 📤 Upload (`/upload`)
- **Formulário completo** para materiais
- **Campos obrigatórios**:
  - Título (3-100 caracteres)
  - Descrição (10-500 caracteres)
  - Disciplina
  - Série/ano
  - Tipo de material
  - Subtópico (3-20 caracteres)
  - Dificuldade
- **Upload de arquivo**: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX
- **Validação**: Frontend e backend sincronizados
- **Feedback**: Mensagens de sucesso/erro

### 💬 Sistema de Avaliações
- **Rating**: 1-5 estrelas obrigatório
- **Comentários**: Opcional com limite de 500 caracteres
- **Validação visual**: Contador de caracteres com cores:
  - Verde/Cinza: 0-449 caracteres
  - Amarelo: 450-499 caracteres
  - Vermelho: 500 caracteres (máximo)
- **Atualização em tempo real**: Após avaliação
- **Autenticação**: Apenas usuários logados podem avaliar

## 📁 Estrutura do Projeto

```
src/
├── app/                      # Next.js 15 App Router
│   ├── dashboard/           # Dashboard protegido
│   ├── login/              # Página de login
│   ├── register/           # Página de registro
│   ├── materials/          # Exploração pública
│   │   ├── [id]/          # Detalhes do material
│   │   │   ├── activities/ # ✨ Geração de atividades com IA
│   │   │   └── edit/      # Edição de material
│   │   └── page.tsx       # Lista de materiais
│   ├── profile/           # Perfil do usuário
│   ├── upload/            # Upload protegido
│   ├── layout.tsx         # Layout global + Providers
│   └── page.tsx           # Homepage
├── components/            # Componentes reutilizáveis
│   ├── ui/               # Sistema de design
│   │   ├── Button.tsx    # Botões com variants
│   │   ├── Input.tsx     # Inputs com validação
│   │   ├── Card.tsx      # Cards modulares
│   │   ├── Badge.tsx     # Tags e labels
│   │   └── Toast.tsx     # Notificações
│   ├── materials/        # Componentes de materiais
│   │   ├── MaterialCard.tsx    # Card de material
│   │   ├── SearchFilters.tsx   # Filtros de busca
│   │   └── ActivityGenerator.tsx # ✨ Gerador de atividades
│   └── layout/          # Layout components
│       └── Header.tsx   # Navegação principal
├── contexts/            # Estado global
│   └── AuthContext.tsx  # Autenticação JWT
├── hooks/              # Custom React Hooks
│   ├── useMaterials.ts  # Hook para materiais
│   ├── useMaterialActions.ts # Download e avaliações
│   ├── useDashboard.ts  # Hook para dashboard
│   └── useActivities.ts # ✨ Hook para geração de atividades
├── services/           # Integração com API
│   ├── api.ts         # Cliente HTTP base
│   ├── authService.ts # Autenticação
│   ├── materialService.ts # CRUD de materiais
│   └── activityService.ts # ✨ Geração de atividades com IA
├── types/             # TypeScript
│   ├── index.ts       # Interfaces e tipos
│   └── material.ts    # Tipos de materiais
└── globals.css        # Estilos Tailwind
```

## 🎨 Sistema de Design

### Componentes UI

```tsx
// Button com variants
<Button variant="primary" size="lg" loading={false}>
  Texto do Botão
</Button>

// Input com ícone e validação
<Input
  label="Campo obrigatório"
  placeholder="Digite aqui..."
  error="Mensagem de erro"
  icon={<IconComponent />}
/>

// Card modular
<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
  </CardHeader>
  <CardContent>
    Conteúdo do card
  </CardContent>
</Card>

// Badge para categorias
<Badge variant="primary">Matemática</Badge>

// Toast para notificações
const { showToast } = useToast();
showToast('Material salvo com sucesso!', 'success', 3000);
```

### Paleta de Cores
- **Primary**: Azul (#2563eb) - Ações principais
- **Secondary**: Roxo (#7c3aed) - Categorias
- **Purple**: Roxo/Rosa gradiente - ✨ Recursos de IA
- **Success**: Verde (#10b981) - Sucessos
- **Warning**: Amarelo (#f59e0b) - Avisos
- **Danger**: Vermelho (#ef4444) - Erros

## 🔐 Autenticação

```tsx
// Context de autenticação com JWT
const { user, login, register, logout, isAuthenticated } = useAuth();

// Login com backend
const success = await login({ email, password });

// Proteção de rota
useEffect(() => {
  if (!authLoading && !isAuthenticated) {
    router.push('/login');
  }
}, [isAuthenticated, authLoading, router]);
```

## 🤖 Integração com IA (OpenAI)

### Backend Configuration

```typescript
// Serviço OpenAI no backend
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Geração de plano de aula
const completion = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [{
    role: "system",
    content: "Você é um assistente pedagógico especializado..."
  }],
  temperature: 0.7
});
```

### Frontend Usage

```typescript
// Hook de atividades
const { generateActivities, loading, error } = useActivities();

// Gerar plano + atividades
const result = await generateActivities(materialId);
```

## 📱 Responsividade

### Breakpoints Tailwind
- **sm**: 640px+ (tablets)
- **md**: 768px+ (tablets grandes)
- **lg**: 1024px+ (desktop)

### Grid System

```tsx
// Grid responsivo
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

// Flex responsivo
<div className="flex flex-col sm:flex-row gap-4">
```

## 🔄 Estado e Dados

### React Query (TanStack Query)

```typescript
// Custom hook com React Query
export function useMaterials() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['materials', filters],
    queryFn: () => fetchMaterials(filters)
  });
}
```

### Context API

```tsx
// AuthContext para autenticação global
<AuthProvider>
  <App />
</AuthProvider>

// Estado local dos componentes
const [materials, setMaterials] = useState<Material[]>([]);
```

## 🧪 Testando o Frontend

```bash
# Acessar aplicação
http://localhost:3000

# Páginas públicas
http://localhost:3000/
http://localhost:3000/materials
http://localhost:3000/login
http://localhost:3000/register

# Páginas protegidas (após login)
http://localhost:3000/dashboard
http://localhost:3000/upload
http://localhost:3000/materials/:id/activities  # ✨ Geração de atividades
```

### Credenciais de Teste
```
Email: cadastrado no backend
Senha: senha do usuário
```

## 🚀 Deploy

### Vercel (Recomendado)
```bash
npm install -g vercel
vercel --prod
```

### Variáveis de Ambiente (Vercel)
```env
NEXT_PUBLIC_API_URL=https://seu-backend.com
```

### Build Manual
```bash
npm run build    # Gera .next/
npm run start    # Servidor produção
```

## 🔧 Configuração Avançada

### Variáveis de Ambiente

```env
# .env.local (Frontend)
NEXT_PUBLIC_API_URL=http://localhost:3001

# .env (Backend)
OPENAI_API_KEY=sk-...
DATABASE_URL=postgresql://...
JWT_SECRET=...
```

### TypeScript

```typescript
// Tipagem de materiais
interface Material {
  id: string;
  title: string;
  description: string;
  discipline: string;
  grade: string;
  materialType: MaterialType;
  difficulty: Difficulty;
  subTopic: string;
  fileUrl?: string;
  downloadCount: number;
  avgRating: number;
  totalRatings: number;
  author: {
    id: string;
    name: string;
    school?: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Enum para tipos de material
enum MaterialType {
  LESSON_PLAN = 'LESSON_PLAN',
  EXERCISE = 'EXERCISE',
  PRESENTATION = 'PRESENTATION',
  VIDEO = 'VIDEO',
  GAME = 'GAME',
  OTHER = 'OTHER'
}

// ✨ Tipos para atividades geradas por IA
interface LessonPlan {
  objectives: string[];
  content: string;
  methodology: string;
  resources: string[];
  assessment: string;
  duration: string;
}

interface Activity {
  title: string;
  description: string;
  instructions: string[];
  materials: string[];
  tips: string;
  variations: string[];
}
```

## 📋 Roadmap

### ✅ Funcionalidades Implementadas
- [x] Integração com backend real (PostgreSQL + Prisma)
- [x] Sistema de avaliações com comentários
- [x] Upload de arquivos real
- [x] Filtros avançados e busca
- [x] ✨ Geração de planos de aula com IA (OpenAI GPT-4o-mini)
- [x] ✨ Geração de atividades educacionais com IA
- [x] Exportação de atividades em Markdown
- [x] Validação de caracteres em comentários (500 max)
- [x] Dashboard com estatísticas reais
- [x] Edição de perfil de usuário
- [x] Edição de materiais
- [x] Sistema de autenticação JWT

### 🔮 Próximas Funcionalidades
- [ ] Sistema de favoritos
- [ ] Notificações push
- [ ] Chat entre professores
- [ ] Modo offline (PWA)
- [ ] Tema escuro
- [ ] Compartilhamento social
- [ ] ✨ Mais formatos de exportação (PDF, DOCX)
- [ ] ✨ Geração de questões de prova com IA
- [ ] ✨ Análise de texto com IA (resumos, traduções)

### 🛠️ Melhorias Técnicas
- [ ] Testes automatizados (Jest + Testing Library)
- [ ] Storybook para componentes
- [ ] Internacionalização (i18n)
- [ ] Analytics (Google Analytics)
- [ ] SEO otimizado
- [ ] Acessibilidade (WCAG)
- [ ] Rate limiting no uso da API OpenAI
- [ ] Cache de atividades geradas

## 🤝 Conectando com Backend

### Backend Stack
- **Framework**: Express.js + TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Auth**: JWT
- **Upload**: Multer
- **IA**: OpenAI SDK

### API Endpoints

```
POST   /api/auth/register        # Registro
POST   /api/auth/login           # Login
GET    /api/auth/profile         # Perfil
PUT    /api/auth/profile         # Atualizar perfil

GET    /api/materials            # Listar materiais (com filtros)
GET    /api/materials/:id        # Detalhes
POST   /api/materials            # Criar (upload)
PUT    /api/materials/:id        # Atualizar
DELETE /api/materials/:id        # Deletar
GET    /api/materials/:id/download # Download

POST   /api/materials/:id/ratings # Criar avaliação
GET    /api/materials/:id/ratings # Listar avaliações

POST   /api/materials/:id/activities # ✨ Gerar atividades com IA

GET    /api/users/stats          # Estatísticas do usuário
```

---

## 🎯 Demonstração

O frontend está totalmente funcional e integrado com backend, incluindo:
- ✅ Interface completa e responsiva
- ✅ Autenticação JWT real
- ✅ Upload e download de arquivos
- ✅ Sistema de busca e filtros avançados
- ✅ Avaliações com comentários (500 chars max)
- ✅ ✨ Geração de planos de aula e atividades com IA
- ✅ Dashboard com estatísticas reais
- ✅ Edição de perfil e materiais
- ✅ Exportação de atividades geradas

**Acesse**: `http://localhost:3000` após `npm run dev` 🚀
