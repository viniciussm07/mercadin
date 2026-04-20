# Mercadin - Guideline para Agentes de IA

Bem-vindo ao repositório do **Mercadin**. Este documento serve como o manual definitivo para qualquer agente de Inteligência Artificial (IA) que for trabalhar nesta base de código. 

Seu objetivo como IA é **produzir código de alta qualidade, consistente com os padrões já estabelecidos e garantir que nenhuma regressão ou antipadrão seja introduzido**.

---

## 1. Visão Geral do Repositório

O projeto é um **monorepo** gerenciado com **pnpm**, dividido em duas aplicações principais:

- `/client` - Aplicação Frontend Mobile construída com **Expo (React Native)** e **NativeWind**.
- `/server` - Aplicação Backend API construída com **NestJS** e **Prisma ORM**.

### 1.1 Regras Universais para IAs
- **Nunca improvise padrões:** Leia as regras antes de tomar decisões estruturais.
- **Sempre utilize o gerenciador de pacotes correto:** O projeto utiliza `pnpm`. Nunca utilize `npm` ou `yarn` para instalar dependências.
- **Respeite o ecossistema:** Sempre prefira ferramentas do ecossistema escolhido para a stack (ex: TanStack no frontend, NestJS modules no backend).
- **Sem adivinhações:** Se um padrão arquitetural (onde colocar um arquivo, qual biblioteca usar) não for óbvio, pare e consulte as diretrizes abaixo ou pergunte ao usuário.
- **Mantenha os arquivos organizados:** Siga rigorosamente as diretrizes de nomenclatura de arquivos (`index.tsx`, `hooks.ts`, etc.). Não crie nomes como `UserCard.tsx`.

---

## 2. Frontend (`/client`)

A pasta `client` é uma aplicação React Native gerenciada pelo Expo.

### 2.1 Tecnologias Essenciais
- **Framework:** Expo + React Native + TypeScript.
- **Estilização:** NativeWind v4 (Tailwind CSS para React Native). NUNCA utilize `StyleSheet.create` a não ser que seja absolutamente inevitável para animações ou propriedades muito específicas não suportadas pelo Tailwind.
- **Roteamento:** React Navigation (Native Stack).
- **Requisições:** `@tanstack/react-query` para gerenciamento de cache/estado do servidor e `ky` como cliente HTTP.
- **Estado Global:** `zustand` (apenas para estados globais complexos), `Context API` (para estados globais simples) e Zustand não deve substituir o React Query para dados do servidor.
- **Formulários:** `@tanstack/react-form` integrado com `zod` e `@tanstack/zod-form-adapter`.

### 2.2 Arquitetura e Estrutura de Pastas
A estrutura deve seguir o padrão de componentes isolados:

- **Componentes (`src/components/` ou `src/packages/[modulo]/components/`):**
  - **Devem** viver em pastas com o nome do componente em `kebab-case`.
  - O arquivo principal de renderização deve se chamar `index.tsx`.
  - Lógicas e requisições devem viver em um arquivo `hooks.ts` ao lado do `index.tsx`.
  - Subcomponentes vivem dentro de uma subpasta `components/` do componente pai.
- **Serviços (`src/services/`):**
  - Apenas chamadas HTTP usando `ky`. Sem regras de negócio.
- **Hooks (`src/hooks/`):**
  - Encapsulam requisições (usando `useQuery`/`useMutation`) ou lógicas reutilizáveis.
- **Tipagens:**
  - Tipos de `props` devem ficar no mesmo arquivo onde são usados a menos que precisem ser exportados, então devem ir para um `types.ts`.

---

## 3. Backend (`/server`)

A pasta `server` é uma API REST modular construída com NestJS.

### 3.1 Tecnologias Essenciais
- **Framework:** NestJS + TypeScript.
- **Banco de Dados:** PostgreSQL com Prisma ORM.
- **Validação:** `class-validator` e `class-transformer`.
- **Testes:** Jest.

### 3.2 Arquitetura e Estrutura de Pastas
A organização segue a separação por **Domínios (Modules)**:

- **Módulos (`src/modules/[dominio]/`):**
  - Cada domínio deve ter seu próprio `.module.ts`.
  - **Controllers:** Responsáveis apenas por receber requisições e devolver respostas (arquivos `.controller.ts`).
  - **Services:** Lógica de negócio isolada (arquivos `.service.ts`). Nunca devem acessar o banco de dados diretamente.
  - **Repositories:** Camada única responsável pela comunicação com o Prisma (arquivos `.repository.ts`). **O PrismaService só pode ser injetado nos repositories.**
  - **DTOs:** Utilizados para entrada de dados. Sempre utilize `whitelist: true` e `transform: true` via pipes do NestJS.
- **Database (`src/database/`):**
  - Onde o `PrismaService` vive e é instanciado.

---

## 4. Estilo de Código e Linting

O projeto possui um setup de ESLint rigoroso.
- **Frontend:** Regras do React e React Native aplicadas.
- **Backend:** Regras estritas do TypeScript e NestJS.
- **TypeScript:** Sempre escreva código tipado de forma estrita (`strict: true`). O uso de `any` ou o ato de silenciar o compilador (`@ts-ignore`) é terminantemente proibido a menos que expressamente solicitado pelo desenvolvedor.
- **Formatação:** Utilize o Prettier para formatar o código após as alterações.

### Quando escrever código, a IA deve sempre:
1. Verificar a estrutura de pastas existente e os padrões de arquivos já criados antes de sugerir novos.
2. Certificar-se de não quebrar as regras do ESLint/TypeScript introduzidas. (Por exemplo: o frontend utiliza `ky`, não sugira `axios` ou `fetch` nativo).
3. Evitar recriar lógicas que já existem em pastas como `src/utils` ou `src/common`.

> **Lembre-se:** A previsibilidade e a aderência aos padrões do repositório são as suas maiores prioridades como IA. Se tiver dúvida, questione o usuário em vez de tomar o caminho mais fácil ou mais comum na internet.
