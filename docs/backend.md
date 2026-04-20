# Documentação de Arquitetura do Backend - Mercadin

Este documento define as diretrizes arquiteturais e decisões de engenharia adotadas para o backend do aplicativo **Mercadin**, focado no planejamento financeiro de alimentação através de comparação de preços em diferentes supermercados locais (ex: Jaú Serve, Savegnago, Tenda Atacado).

A stack base é composta por **NestJS**, **Prisma** e **PostgreSQL**.

---

## 1. Resumo das Funções do Backend

O backend atua como o motor inteligente e centralizador de dados da plataforma, sendo responsável pelas seguintes funções:

- **Autenticação e Autorização:** Receber e validar tokens JWT emitidos pelo provedor de identidade do frontend, protegendo rotas privadas e associando dados aos usuários corretos.
- **Scraping e Ingestão de Dados:** Orquestrar workers (rotinas assíncronas em background) para navegar, extrair, limpar e normalizar dados de produtos e preços dos sites de supermercados.
- **Gestão de Catálogo Unificado:** Gerenciar as entidades `MasterProduct` (produto global) e associá-las aos `MarketProduct` (variantes locais) validando via EAN.
- **Gestão de Listas de Compras:** Fornecer operações de CRUD (Criar, Ler, Atualizar, Deletar) para as listas personalizadas dos usuários.
- **Engine de Combinação de Preços (Otimização):** Executar algoritmos em memória para calcular cestas completas (mesmo mercado) ou cestas fracionadas (modo economia máxima) cruzando itens da lista com o banco de preços.
- **Monitoramento de Histórico (Time-Series):** Rastrear flutuações de preços, permitindo consultas para geração de gráficos e cálculo de "Economia Total do Mês".
- **Sistema de Notificações:** Checar rotineiramente quedas de preço em produtos favoritados e acionar a API do Expo Push Notifications para enviar alertas ao dispositivo móvel do usuário.

---

## 2. Decisões Técnicas (Architecture Decision Records)

### 2.1. Estratégia de Scraping e Consistência de Dados
**Decisão:** Scraping Assíncrono via Workers / CRON (Background).
- **Descrição:** O sistema utilizará filas de processamento (ex: BullMQ) e agendadores para extrair dados dos sites dos supermercados continuamente em segundo plano. O usuário final fará consultas de preço apenas contra o nosso banco de dados relacional interno, nunca aguardando o processamento em tempo real da página do supermercado.
- **Motivação:** O scraping em tempo real, disparado no momento em que o usuário pesquisa ou abre uma lista, exige múltiplas requisições lentas para sites pesados, criando um gargalo que arruína a experiência do usuário. 
- **Prós:** 
  - Consultas no aplicativo são praticamente instantâneas pois consultam o PostgreSQL local.
  - Baixo risco de bloqueios por firewalls dos mercados, pois a taxa de extração é controlada pelo backend, e não pelo tráfego de usuários.
  - Possibilita a análise autônoma de preços para disparo de notificações "offline".
- **Contras:** 
  - Os preços vistos pelo usuário podem estar levemente defasados (com atraso de algumas horas, dependendo do intervalo do CRON).
  - Requer infraestrutura adicional de filas/workers (ex: Redis + BullMQ) ou uso pesado do `@nestjs/schedule`.

### 2.2. Unificação de Produtos e Matching
**Decisão:** Mapeamento Estrito via EAN (Código de Barras Global).
- **Descrição:** Todos os produtos inseridos no banco de dados serão agrupados utilizando o EAN (`MasterProduct`). Produtos extraídos dos mercados (`MarketProduct`) que não contiverem o código EAN explícito (seja no HTML ou na API) serão ignorados no processamento, garantindo que todo produto comparável tenha a chave universal.
- **Motivação:** Cada supermercado usa um SKU interno e nomenclaturas distintas ("Arroz Tio Joao 5k" vs "Arroz Bc Tio Joao 5 Kg"). Algoritmos de IA ou similaridade textual (fuzzy logic) são caros computacionalmente e sujeitos a falsos positivos. O EAN é a única "fonte de verdade".
- **Prós:** 
  - Alta precisão na comparação de preços (zero risco de comparar "Arroz 5kg" com "Arroz 1kg").
  - Banco de dados limpo e determinístico.
- **Contras:** 
  - Redução de catálogo: produtos que o mercado esconde o EAN no site não farão parte do sistema (a não ser que seja feito um esforço extra de rotacionar IPs para entrar na página de detalhes).

### 2.3. Histórico de Preços e Promoções
**Decisão:** Tabela de Histórico Time-Series (Append-only).
- **Descrição:** A modelagem do banco de dados não substituirá o valor da coluna de preço a cada nova raspagem. Cada alteração de preço detectada insere um novo registro com timestamp na tabela `PriceHistory`. O valor atual do produto torna-se apenas a linha mais recente adicionada a esse histórico.
- **Motivação:** Sobrepor o preço antigo (`UPDATE price`) destrói a percepção de valor. Para calcular a "economia do mês" e notificar o usuário com gráficos reais de tendências, precisamos armazenar os estados anteriores.
- **Prós:** 
  - Gera alto valor agregado para o usuário (comparável a plataformas maduras como Zoom/Buscapé).
  - Permite análise preditiva no futuro ("geralmente a carne abaixa de quarta-feira").
- **Contras:** 
  - Crescimento acelerado do tamanho do banco de dados PostgreSQL.
  - Necessidade de criar políticas de retenção ou limpeza de dados velhos no futuro (ex: deletar históricos mais velhos que 12 meses).

### 2.4. Engine de Combinação de Custo
**Decisão:** Abordagem Híbrida (Conveniência vs. Economia Máxima).
- **Descrição:** O serviço de cálculo de lista de compras (`ShoppingListService`) processará os itens retornando duas respostas paralelas: um array agrupando todos os itens em carrinhos individuais por supermercado (exibindo o custo de se comprar tudo num só local) e um "super carrinho", que monta a lista mesclando os itens nos mercados específicos em que estão mais baratos.
- **Motivação:** Dividir uma lista matematicamente pelos menores preços em 3 mercados diferentes poupa dinheiro, mas o custo logístico (tempo, gasolina) torna isso impraticável para listas pequenas. O usuário precisa de opções.
- **Prós:** 
  - Atende tanto o usuário que busca conveniência (apenas 1 parada no mercado) quanto o usuário que está no "modo sobrevivência" e quer poupar o máximo possível.
  - É um diferencial forte de UX para a aplicação.
- **Contras:** 
  - Exige algoritmos mais complexos e pesados no backend (`.reduce`, ordenação customizada de arrays) a cada abertura/cálculo de lista.

### 2.5. Autenticação e Gestão de Usuários
**Decisão:** Provedor de Identidade Third-party (Supabase Auth ou Firebase Auth).
- **Descrição:** O armazenamento seguro de senhas, os e-mails de recuperação de conta e os fluxos de login com o Google/Apple serão gerenciados por uma SDK de terceiros no próprio frontend mobile. O nosso backend em NestJS apenas extrairá e validará criptograficamente os tokens JWT recebidos no cabeçalho HTTP (`Authorization: Bearer <token>`).
- **Motivação:** Construir fluxos seguros de recuperação de senhas ("Esqueci minha senha") demanda integrações com serviços de SMTP (SendGrid), geração de tokens e expiração de rotas. O tempo do MVP deve ser investido nas regras de negócio financeiras.
- **Prós:** 
  - Velocidade de implementação extrema.
  - Segurança de nível enterprise "grátis" ou a baixíssimo custo.
  - Facilita integrações futuras de Social Login (Entrar com Apple, Entrar com Google) no mobile.
- **Contras:** 
  - Dependência de infraestrutura externa. Se o Supabase/Firebase cair, o login da aplicação para de funcionar.

### 2.6. Extensibilidade do Módulo de Scraping
**Decisão:** Strategy Pattern via Injeção de Dependência no NestJS.
- **Descrição:** O código de raspagem não será um grande arquivo monolítico com múltiplos `if`. Será definida uma interface TypeScript (`IMarketScraper`), e cada supermercado será uma classe isolada e injetável (`@Injectable()`) que implementa essa interface com suas próprias lógicas de `Cheerio` ou Fetch. O orquestrador central apenas iterará o array destas classes instanciadas.
- **Motivação:** Supermercados possuem arquiteturas web completamente distintas. O Savegnago pode exigir parsing de HTML usando Cheerio, enquanto o Tenda Atacado pode expor uma API REST. Construir um scraper único com múltiplos `if/else` criaria um código frágil ("Spaghetti code") e difícil de manter.
- **Prós:** 
  - **Plug-and-Play:** Adicionar um novo mercado significa apenas criar uma nova classe que implementa a interface `IMarketScraper` e registrá-la no módulo. O "motor" principal do aplicativo não muda.
  - **Isolamento de Falhas:** Se a estrutura do site do Tenda mudar e quebrar o scraper, a falha ficará isolada apenas na classe do Tenda. Os scrapers do Jaú Serve e Savegnago continuarão processando os dados normalmente.
  - **Desativação Rápida:** Remover/pausar um mercado exige apenas uma alteração no banco (ex: `isActive: false`) ou na lista de injeção.
- **Contras:** 
  - Aumenta levemente a verbosidade do código inicial devido à necessidade de criar interfaces ou classes abstratas (boilerplate clássico da arquitetura limpa).

### 2.7. Tratamento de Ruptura de Estoque (Out-of-Stock) e Dados Defasados
**Decisão:** Verificação em Duas Etapas (Targeted Scraper) e Controle de Status Lógico (Soft-Delete).
- **Descrição:** Se o worker varrer as seções do site e um produto "sumir", ele não é excluído fisicamente. Ele vai para uma fila secundária, onde um worker "sniper" tenta acessar a URL direta salva dele ou buscá-lo diretamente pelo EAN na API do site. Apenas se essa verificação confirmar o sumiço do produto, a coluna `isAvailable` (booleano) é marcada como `false`.
- **Motivação:** Se o scraper varrer a categoria "Óleos" e não achar o "Azeite Gallo", não podemos excluí-lo imediatamente, pois pode ser um bug da paginação do mercado ou ele apenas perdeu destaque na *Home*. Por outro lado, se ele realmente acabou, o app não pode recomendá-lo para a lista de compras do usuário para não gerar frustração.
- **Prós:** 
  - Usando `isAvailable` (boolean) e `lastScrapedAt` (DateTime), não quebramos os históricos de listas do usuário caso um produto seja removido temporariamente do mercado.
  - A estratégia de "Segunda verificação focada" (buscar o EAN específico na barra de pesquisa da API do mercado antes de marcar como indisponível) reduz quase a zero o índice de "falsos esgotados".
  - O aplicativo pode informar ao usuário: *"Preço atualizado há 3 horas"*, garantindo transparência.
- **Contras:** 
  - Aumenta o fluxo de trabalho do banco de dados (que precisará criar filas de "Verificação de Estoque" para os itens que sumirem na primeira varredura).
