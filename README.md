# 🎨 Hackathon Frontend - Banco Colaborativo de Recursos Didáticos

Interface web moderna em Next.js + TypeScript para sistema de compartilhamento de materiais didáticos.

## 🚀 Tecnologias

- **Framework**: Next.js 15 (App Router)
- **Linguagem**: TypeScript
- **Estilização**: Tailwind CSS 4
- **UI Components**: Componentes customizados
- **Estado**: React Context API
- **Formulários**: React Hook Form + Validação
- **Build**: Turbopack (ultra-rápido)

## ⚡ Quick Start

```bash
# 1. Instalar dependências
npm install

# 2. Executar desenvolvimento
npm run dev

# 3. Acessar aplicação
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
- `/materials` - Explorar materiais (sem login)

### Protegidas (Requer Login)
- `/dashboard` - Painel do usuário
- `/upload` - Compartilhar novo material

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
- **Persistência**: Estado mantido no localStorage

### 📊 Dashboard (`/dashboard`)
- Estatísticas pessoais do usuário
- Materiais recentes compartilhados
- Ações rápidas (upload, exploração)
- Cards informativos com métricas

### 📚 Exploração (`/materials`)
- Listagem de todos os materiais
- **Busca**: Por título, descrição, tags
- **Filtros**: Disciplina, série, tipo
- **Info**: Downloads, avaliações, autor
- Cards detalhados e responsivos

### 📤 Upload (`/upload`)
- Formulário completo para materiais
- **Campos**: Título, descrição, disciplina, série
- **Categorização**: Tipo de material, dificuldade
- **Upload**: Arquivos PDF, DOC, PPT, XLS
- **Validação**: Campos obrigatórios e formato

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Next.js 15 App Router
│   ├── dashboard/         # Dashboard protegido
│   ├── login/            # Página de login
│   ├── register/         # Página de registro
│   ├── materials/        # Exploração pública
│   ├── upload/           # Upload protegido
│   ├── layout.tsx        # Layout global + AuthProvider
│   └── page.tsx          # Homepage
├── components/           # Componentes reutilizáveis
│   ├── ui/              # Sistema de design
│   │   ├── Button.tsx   # Botões com variants
│   │   ├── Input.tsx    # Inputs com validação
│   │   ├── Card.tsx     # Cards modulares
│   │   └── Badge.tsx    # Tags e labels
│   └── layout/          # Layout components
│       └── Header.tsx   # Navegação principal
├── contexts/            # Estado global
│   └── AuthContext.tsx  # Autenticação
├── types/               # TypeScript
│   └── index.ts         # Interfaces e tipos
└── globals.css          # Estilos Tailwind
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
```

### Paleta de Cores
- **Primary**: Azul (#2563eb) - Ações principais
- **Secondary**: Roxo (#7c3aed) - Categorias
- **Success**: Verde (#10b981) - Sucessos
- **Warning**: Amarelo (#f59e0b) - Avisos
- **Danger**: Vermelho (#ef4444) - Erros

## 🔐 Autenticação (Mock)

```tsx
// Context de autenticação
const { user, login, register, logout, isAuthenticated } = useAuth();

// Login simulado
const success = await login({ email, password });

// Proteção de rota
useEffect(() => {
  if (!authLoading && !isAuthenticated) {
    router.push('/login');
  }
}, [isAuthenticated, authLoading, router]);
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

### Context API
```tsx
// AuthContext para autenticação global
<AuthProvider>
  <App />
</AuthProvider>

// Estado local dos componentes
const [materials, setMaterials] = useState<Material[]>([]);
```

### Dados Mock
- **Usuários**: Professores simulados
- **Materiais**: Banco de recursos educacionais
- **Persistência**: localStorage para demo

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
```

### Credenciais de Teste
```
Email: qualquer@email.com
Senha: qualquer (mínimo 6 caracteres)
```

## 🚀 Deploy

### Vercel (Recomendado)
```bash
npm install -g vercel
vercel --prod
```

### Build Manual
```bash
npm run build    # Gera .next/
npm run start    # Servidor produção
```

## 🔄 Desenvolvimento

### Adicionando Nova Página
1. Criar arquivo em `src/app/nova-pagina/page.tsx`
2. Implementar componente com `export default`
3. Adicionar navegação no Header se necessário

### Criando Componente UI
1. Criar em `src/components/ui/NovoComponent.tsx`
2. Seguir padrão de props + className
3. Implementar variants se aplicável
4. Exportar tipagens TypeScript

### Integrando com Backend
1. Substituir funções mock em `AuthContext`
2. Criar serviços em `src/services/`
3. Configurar variáveis de ambiente
4. Implementar tratamento de erros

## 🔧 Configuração Avançada

### Variáveis de Ambiente
```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_UPLOAD_URL=http://localhost:3001/uploads
```

### TypeScript
```tsx
// Tipagem de materiais
interface Material {
  id: string;
  title: string;
  subject: string;
  gradeLevel: string;
  // ...
}

// Enum para categorias
enum MaterialType {
  LESSON_PLAN = 'LESSON_PLAN',
  EXERCISE = 'EXERCISE',
  // ...
}
```

## 📋 Roadmap

### Próximas Funcionalidades
- [ ] Integração com backend real
- [ ] Sistema de favoritos
- [ ] Comentários e avaliações
- [ ] Notificações push
- [ ] Chat entre professores
- [ ] Modo offline (PWA)
- [ ] Tema escuro

### Melhorias Técnicas
- [ ] Testes automatizados (Jest + Testing Library)
- [ ] Storybook para componentes
- [ ] Internacionalização (i18n)
- [ ] Analytics (Google Analytics)
- [ ] SEO otimizado
- [ ] Acessibilidade (WCAG)

## 🐛 Problemas Conhecidos

- Autenticação é simulada (dados não persistem no reload)
- Upload de arquivos é apenas visual
- Filtros são aplicados apenas nos dados mock
- Rotas protegidas redirecionam sempre para /login

## 🤝 Conectando com Backend

```tsx
// Substituir AuthContext mock por integração real
const login = async (data: LoginData): Promise<boolean> => {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    if (result.success) {
      localStorage.setItem('token', result.token);
      setUser(result.user);
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
};
```

---

## 🎯 Demonstração

O frontend está totalmente funcional para demonstração, com:
- ✅ Interface completa e responsiva
- ✅ Fluxo de autenticação simulado
- ✅ Navegação entre páginas
- ✅ Formulários com validação
- ✅ Sistema de busca e filtros
- ✅ Upload de arquivos (visual)

**Acesse**: `http://localhost:3000` após `npm run dev` 🚀
