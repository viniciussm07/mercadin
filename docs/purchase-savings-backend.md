# Funcionalidade de Economia e Compras Finalizadas - Backend

Este documento especifica a funcionalidade backend para calcular, registrar e expor métricas de economia no Mercadin.

O objetivo é separar claramente três conceitos:

- **Potencial de economia:** oportunidade atual calculada para listas em aberto.
- **Economia estimada:** valor calculado pelo app para uma lista/cenário antes da compra ser concluída.
- **Economia confirmada:** valor registrado em snapshot quando o usuário finaliza uma lista como compra.

Essa separação é obrigatória porque o app não tem acesso automático aos gastos reais do usuário nem ao mercado em que ele efetivamente comprou.

---

## 1. Estado Atual do Backend

O backend já possui uma base para comparação de preços em listas:

- `ShoppingList` representa listas do usuário.
- `ShoppingListItem` representa itens da lista, com quantidade e vínculo para `MarketProduct`.
- `MarketProduct` representa o produto em um mercado específico.
- `MasterProduct` representa o produto universal, agrupado por EAN.
- `PriceCombinationService` calcula:
  - carrinhos por mercado único (`byMarket`);
  - super carrinho (`superCart`), escolhendo o menor preço por item entre mercados;
  - `cheapestSingleMarketId`;
  - `savings`, quando existe comparação válida entre mercado único completo e super carrinho.

Esse cálculo atual deve continuar existindo e será reaproveitado para snapshots e métricas.

---

## 2. Conceitos de Produto

### 2.1. Potencial de Economia

É a economia possível em listas ainda abertas.

Exemplo:

- lista ativa tem arroz, leite e café;
- comprar tudo no mercado único mais barato custa R$ 120,00;
- montar o super carrinho em mais de um mercado custa R$ 105,00;
- potencial de economia = R$ 15,00.

Esse valor não deve ser apresentado como economia real, porque o usuário ainda não confirmou a compra.

Uso esperado:

- home: card `Potencial de economia`;
- listas: tela de comparação de preços;
- recomendações de compra.

### 2.2. Economia Estimada

É o valor calculado pelo app para um cenário específico de compra.

Exemplos de cenários:

- comprar tudo no menor mercado único completo;
- seguir o super carrinho;
- outro cenário calculado futuramente.

A economia estimada pode virar economia confirmada se o usuário finalizar a compra sem informar o valor real pago.

### 2.3. Economia Confirmada

É a economia registrada quando o usuário executa a ação explícita `Finalizar compra`.

Ela deve ser persistida em snapshot imutável, para que mudanças futuras em preços, lista ou produtos não alterem o histórico.

Uso esperado:

- home: card `Economia confirmada`;
- histórico de compras;
- métricas mensais;
- cálculo do mercado que mais contribuiu.

---

## 3. Baseline de Economia

O baseline padrão deve ser:

> Menor carrinho completo em um único mercado.

Fórmula:

```text
economia = totalMenorMercadoUnicoCompleto - totalEscolhido
```

Regras:

- Se existir ao menos um mercado que tenha todos os itens da lista, o menor desses carrinhos é o baseline.
- Se não existir mercado único completo, `savings` deve ser `null`.
- Se `totalEscolhido` for maior ou igual ao baseline, a economia pode ser `0` ou negativa conforme a estratégia de produto.
- Para MVP, recomenda-se armazenar o valor matemático real, mas exibir economia negativa com cuidado na UI.

Motivo:

- O baseline responde uma pergunta clara: "quanto economizei em relação à melhor compra feita em um único mercado?".
- Ele reaproveita o cálculo que já existe em `PriceCombinationService`.
- Evita comparações frágeis contra média, maior preço, preço antigo ou preço sugerido.

---

## 4. Cenários de Compra Suportados

Inicialmente o backend deve suportar dois cenários:

### 4.1. `CHEAPEST_SINGLE_MARKET`

O usuário finaliza a compra usando o menor mercado único completo.

Características:

- todos os itens são comprados no mesmo mercado;
- só é válido quando existe carrinho completo;
- economia contra o próprio baseline tende a ser `0`;
- é útil para registrar compra por conveniência.

### 4.2. `SUPER_CART`

O usuário finaliza seguindo o super carrinho.

Características:

- cada item é comprado no mercado onde está mais barato;
- pode envolver múltiplos mercados;
- só deve ser considerado completo se todos os itens tiverem ao menos uma variante disponível;
- economia estimada é a diferença contra o menor mercado único completo.

### 4.3. Cenários Futuros

Não implementar no MVP, mas o modelo deve permitir expansão:

- `MANUAL_TOTAL`: usuário informa valor pago real.
- `CUSTOM_MARKET_SELECTION`: usuário escolhe manualmente mercado por item.
- `RECEIPT_IMPORTED`: compra validada por nota fiscal, cupom ou NFC-e.

---

## 5. Modelo de Dados Proposto

### 5.1. Status da Lista

Adicionar status em `ShoppingList`.

```prisma
enum ShoppingListStatus {
  ACTIVE
  COMPLETED
  ARCHIVED
}

model ShoppingList {
  id        String             @id @default(uuid())
  name      String
  status    ShoppingListStatus @default(ACTIVE)
  userId    String
  user      User               @relation(fields: [userId], references: [id])
  items     ShoppingListItem[]
  createdAt DateTime           @default(now())
  updatedAt DateTime           @updatedAt
}
```

Regras:

- listas `ACTIVE` podem ser editadas;
- listas `COMPLETED` não podem ser editadas;
- listas `COMPLETED` podem ser duplicadas para criar uma nova lista `ACTIVE`;
- `ARCHIVED` é opcional para organização futura.

### 5.2. Snapshot de Compra

Criar entidade principal para compra finalizada.

```prisma
enum PurchaseScenario {
  CHEAPEST_SINGLE_MARKET
  SUPER_CART
  MANUAL_TOTAL
}

enum SavingsConfidence {
  ESTIMATED_CONFIRMED
  ACTUAL_PAID
}

model PurchaseSnapshot {
  id                    String             @id @default(uuid())
  userId                String
  user                  User               @relation(fields: [userId], references: [id])
  shoppingListId         String
  shoppingList           ShoppingList       @relation(fields: [shoppingListId], references: [id])

  scenario              PurchaseScenario
  confidence            SavingsConfidence

  baselineTotal          Float?
  estimatedTotal         Float
  actualPaidTotal        Float?
  savings                Float?

  cheapestSingleMarketId String?
  marketsCount           Int
  completedAt            DateTime           @default(now())
  createdAt              DateTime           @default(now())

  items                  PurchaseSnapshotItem[]
}
```

Campos:

- `baselineTotal`: total do menor mercado único completo, quando existir.
- `estimatedTotal`: total calculado pelo app para o cenário escolhido.
- `actualPaidTotal`: valor real informado pelo usuário. Opcional.
- `savings`: economia calculada contra o baseline.
- `confidence`: indica se o total foi apenas estimado ou informado pelo usuário.
- `completedAt`: data usada nas métricas por período.

### 5.3. Itens do Snapshot

Criar entidade para preservar cada item comprado no momento da finalização.

```prisma
model PurchaseSnapshotItem {
  id                 String           @id @default(uuid())
  snapshotId         String
  snapshot           PurchaseSnapshot @relation(fields: [snapshotId], references: [id], onDelete: Cascade)

  masterProductId    String
  masterProductName  String
  marketProductId    String?
  marketId           String?
  marketName         String?

  quantity           Int
  unitPrice          Float
  subtotal           Float

  baselineMarketId   String?
  baselineMarketName String?
  baselineUnitPrice  Float?
  baselineSubtotal   Float?
  savingsContribution Float?
}
```

Motivo:

- snapshots devem ser imutáveis;
- nomes, preços e relações atuais podem mudar depois;
- métricas históricas não podem depender do estado atual de `MarketProduct`.

---

## 6. Finalização de Compra

### 6.1. Endpoint

Criar endpoint privado:

```http
POST /shopping-lists/:id/complete
```

Body inicial:

```json
{
  "scenario": "SUPER_CART",
  "actualPaidTotal": null
}
```

Para MVP:

- `scenario` é obrigatório;
- `actualPaidTotal` é opcional;
- `actualPaidTotal` pode ser implementado depois, mas o modelo deve aceitar.

### 6.2. Fluxo de Serviço

O backend deve:

1. Validar que a lista pertence ao usuário autenticado.
2. Validar que a lista está `ACTIVE`.
3. Executar `PriceCombinationService.combine(listId, userId)`.
4. Validar que o cenário escolhido é possível.
5. Determinar `baselineTotal`.
6. Determinar `estimatedTotal`.
7. Calcular `savings`.
8. Criar `PurchaseSnapshot`.
9. Criar `PurchaseSnapshotItem[]`.
10. Marcar `ShoppingList.status = COMPLETED`.
11. Executar tudo em transação.

### 6.3. Regras por Cenário

#### `CHEAPEST_SINGLE_MARKET`

Validações:

- `cheapestSingleMarketId` precisa existir.
- O carrinho desse mercado precisa estar completo.

Snapshot:

- `estimatedTotal = cheapestSingleMarket.total`;
- `baselineTotal = cheapestSingleMarket.total`;
- `savings = 0`;
- `marketsCount = 1`;
- itens vêm dos picks do carrinho do mercado.

#### `SUPER_CART`

Validações:

- `superCart.isComplete` precisa ser `true`.

Snapshot:

- `estimatedTotal = superCart.total`;
- `baselineTotal = cheapestSingleMarket.total`, se existir;
- `savings = cheapestSingleMarket.total - superCart.total`, se existir baseline;
- `marketsCount = superCart.marketsCount`;
- itens vêm dos picks do super carrinho.

Se `superCart` for completo, mas não existir mercado único completo:

- permitir finalizar;
- `baselineTotal = null`;
- `savings = null`.

---

## 7. Imutabilidade e Edição

Depois de finalizar:

- a lista deve ser marcada como `COMPLETED`;
- endpoints de editar nome, adicionar item, remover item e alterar quantidade devem rejeitar listas `COMPLETED`;
- o snapshot deve ser a fonte de verdade histórica;
- mudanças futuras nos preços não devem alterar snapshots.

### 7.1. Duplicar Lista

Criar endpoint futuro:

```http
POST /shopping-lists/:id/duplicate
```

Regras:

- pode duplicar lista `ACTIVE` ou `COMPLETED`;
- cria nova lista `ACTIVE`;
- copia itens e quantidades;
- não copia snapshots;
- nome sugerido pode ser `Cópia de <nome>`.

---

## 8. Métricas da Home

### 8.1. Endpoint de Resumo

Criar endpoint privado:

```http
GET /shopping-lists/metrics/summary?period=current-month
```

Resposta sugerida:

```json
{
  "period": {
    "type": "current-month",
    "start": "2026-04-01T00:00:00.000Z",
    "end": "2026-04-29T23:59:59.999Z"
  },
  "confirmedSavings": {
    "total": 42.35,
    "purchasesCount": 3
  },
  "potentialSavings": {
    "total": 18.9,
    "listsCount": 2
  },
  "topContributingMarket": {
    "marketId": "uuid",
    "marketName": "Savegnago",
    "savingsContribution": 25.4
  }
}
```

### 8.2. Período Padrão

O período padrão da home deve ser o mês calendário atual:

```text
start = primeiro dia do mês, 00:00
end = agora
```

Campos base:

- usar `PurchaseSnapshot.completedAt` para economia confirmada;
- usar listas `ACTIVE` para potencial de economia.

Períodos futuros:

- últimos 30 dias;
- 3 meses;
- ano;
- período customizado.

---

## 9. Cálculo de Economia Confirmada

### 9.1. Total Confirmado

Para o card `Economia confirmada`:

```text
confirmedSavings.total = soma de PurchaseSnapshot.savings no período
```

Regras:

- ignorar snapshots com `savings = null`;
- incluir snapshots com `savings = 0`;
- decidir futuramente se valores negativos entram no total ou são exibidos separadamente.

### 9.2. Confiança da Métrica

Dois níveis:

- `ESTIMATED_CONFIRMED`: usuário confirmou o plano calculado pelo app, sem informar valor real.
- `ACTUAL_PAID`: usuário informou valor real pago.

Para MVP, usar `ESTIMATED_CONFIRMED`.

Quando `actualPaidTotal` existir:

```text
totalEscolhido = actualPaidTotal
savings = baselineTotal - actualPaidTotal
confidence = ACTUAL_PAID
```

---

## 10. Cálculo de Potencial de Economia

Para o card `Potencial de economia`:

1. Buscar listas `ACTIVE` do usuário.
2. Para cada lista, executar ou reaproveitar `PriceCombinationService.combine`.
3. Somar `savings` das listas cujo valor não é `null`.

```text
potentialSavings.total = soma de savings das listas ativas
```

Regras:

- não usar listas `COMPLETED`;
- não persistir como histórico;
- valor pode mudar conforme preços atuais;
- valor deve ser tratado como estimativa dinâmica.

Observação de performance:

- para MVP, calcular sob demanda;
- se ficar caro, criar cache por lista com invalidação por alteração de item/preço.

---

## 11. Mercado que Mais Contribuiu

### 11.1. Definição

O mercado que mais contribuiu é aquele que gerou maior economia acumulada em snapshots de compras finalizadas dentro do período.

Não é necessariamente:

- o mercado com menor ticket total;
- o mercado mais frequente;
- o mercado com mais itens baratos;
- o mercado mais barato em média.

### 11.2. Regra de Atribuição

Para cada item do snapshot:

```text
contribuicao = baselineSubtotal - subtotalEscolhido
```

Regras:

- atribuir contribuição ao mercado onde o item foi comprado no snapshot;
- somar apenas contribuições positivas;
- se não houver baseline, contribuição deve ser `null` ou `0`;
- se o cenário for `CHEAPEST_SINGLE_MARKET`, contribuição normalmente será `0`.

Exemplo:

- baseline no mercado único: café R$ 20,00;
- super carrinho escolheu café no Savegnago por R$ 16,00;
- contribuição do Savegnago = R$ 4,00.

### 11.3. Persistência

Cada `PurchaseSnapshotItem` deve armazenar:

- `baselineMarketId`;
- `baselineMarketName`;
- `baselineUnitPrice`;
- `baselineSubtotal`;
- `savingsContribution`.

Isso evita recalcular contribuição usando preços futuros.

---

## 12. APIs Backend Sugeridas

### 12.1. Finalizar Compra

```http
POST /shopping-lists/:id/complete
```

Body:

```json
{
  "scenario": "SUPER_CART",
  "actualPaidTotal": null
}
```

Resposta:

```json
{
  "id": "snapshot-id",
  "shoppingListId": "list-id",
  "scenario": "SUPER_CART",
  "confidence": "ESTIMATED_CONFIRMED",
  "baselineTotal": 120,
  "estimatedTotal": 105,
  "actualPaidTotal": null,
  "savings": 15,
  "marketsCount": 2,
  "completedAt": "2026-04-29T12:00:00.000Z"
}
```

### 12.2. Obter Snapshot

```http
GET /shopping-lists/purchases/:snapshotId
```

Deve retornar snapshot com itens.

### 12.3. Listar Histórico

```http
GET /shopping-lists/purchases?period=current-month
```

Retorna snapshots paginados do usuário.

### 12.4. Resumo de Métricas

```http
GET /shopping-lists/metrics/summary?period=current-month
```

Retorna:

- economia confirmada;
- potencial de economia;
- mercado que mais contribuiu;
- contadores auxiliares.

### 12.5. Duplicar Lista

```http
POST /shopping-lists/:id/duplicate
```

Cria nova lista ativa a partir de uma lista existente.

---

## 13. DTOs e Validação

### 13.1. CompleteShoppingListDto

```ts
export class CompleteShoppingListDto {
  @IsEnum(PurchaseScenario)
  scenario!: PurchaseScenario;

  @IsOptional()
  @IsNumber()
  @Min(0)
  actualPaidTotal?: number;
}
```

Regras:

- `scenario` obrigatório;
- `actualPaidTotal` opcional;
- se `actualPaidTotal` vier, usar `confidence = ACTUAL_PAID`;
- se não vier, usar `confidence = ESTIMATED_CONFIRMED`.

### 13.2. MetricsPeriodDto

```ts
export class MetricsPeriodDto {
  @IsOptional()
  @IsEnum(["current-month"])
  period?: "current-month";
}
```

Para MVP, aceitar apenas `current-month`.

---

## 14. Regras de Erro

### 14.1. Lista Não Encontrada

Retornar `404` quando:

- lista não existe;
- lista pertence a outro usuário.

### 14.2. Lista Já Finalizada

Retornar `409 Conflict` quando:

- usuário tenta finalizar lista `COMPLETED`;
- usuário tenta editar lista `COMPLETED`.

### 14.3. Cenário Inválido

Retornar `400 Bad Request` quando:

- cenário não existe;
- cenário escolhido não é possível para os dados atuais.

### 14.4. Carrinho Incompleto

Para `CHEAPEST_SINGLE_MARKET`:

- retornar `400` se nenhum mercado tiver todos os itens.

Para `SUPER_CART`:

- retornar `400` se algum item não tiver variante disponível em nenhum mercado.

---

## 15. Transações e Consistência

A finalização da compra deve ser transacional.

Na mesma transação:

1. validar lista ativa;
2. criar `PurchaseSnapshot`;
3. criar `PurchaseSnapshotItem[]`;
4. atualizar lista para `COMPLETED`.

Se qualquer passo falhar, nada deve ser persistido.

Concorrência:

- evitar dois snapshots para a mesma lista;
- aplicar constraint única opcional em `PurchaseSnapshot.shoppingListId`;
- ou validar status dentro da transação antes de atualizar.

Recomendação:

```prisma
model PurchaseSnapshot {
  shoppingListId String @unique
}
```

Isso garante uma finalização por lista.

---

## 16. Testes Backend

### 16.1. Unitários

Testar serviço de finalização:

- finaliza `SUPER_CART` completo;
- finaliza `CHEAPEST_SINGLE_MARKET` completo;
- rejeita lista de outro usuário;
- rejeita lista `COMPLETED`;
- rejeita cenário impossível;
- calcula `savings` corretamente;
- grava `savings = null` quando não há baseline;
- usa `actualPaidTotal` quando informado.

Testar métricas:

- soma apenas snapshots do período;
- ignora snapshots com `savings = null`;
- soma potencial apenas de listas `ACTIVE`;
- calcula mercado que mais contribuiu por itens;
- retorna `null` para mercado mais contribuinte quando não houver contribuição.

### 16.2. Integração

Testar endpoints:

- `POST /shopping-lists/:id/complete`;
- `GET /shopping-lists/metrics/summary`;
- `GET /shopping-lists/purchases`;
- `POST /shopping-lists/:id/duplicate`.

Validar autenticação e isolamento por usuário.

---

## 17. Incremento Recomendado de Implementação

### Fase 1 - Backend mínimo

Implementar:

- `ShoppingList.status`;
- `PurchaseSnapshot`;
- `PurchaseSnapshotItem`;
- endpoint `POST /shopping-lists/:id/complete`;
- cenário `CHEAPEST_SINGLE_MARKET`;
- cenário `SUPER_CART`;
- endpoint `GET /shopping-lists/metrics/summary?period=current-month`.

Não implementar ainda:

- valor manual obrigatório;
- upload de nota;
- integração bancária;
- importação de NFC-e;
- seleção manual por item.

### Fase 2 - Histórico e duplicação

Implementar:

- endpoint para listar snapshots;
- endpoint para ver detalhes de snapshot;
- endpoint para duplicar lista;
- bloqueio de edição em listas `COMPLETED`.

### Fase 3 - Valor real e confiança

Implementar:

- `actualPaidTotal`;
- edição controlada de valor pago no snapshot;
- diferenciação visual/contratual entre economia estimada confirmada e economia por valor real.

### Fase 4 - Comprovação

Implementar futuramente:

- upload de cupom;
- leitura de NFC-e;
- reconciliação com itens reais comprados.

---

## 18. Decisões Fechadas

- Não misturar economia real e potencial em uma métrica única.
- Home deve expor dois conceitos separados:
  - `Economia confirmada`;
  - `Potencial de economia`.
- Economia confirmada nasce de `Finalizar compra`.
- Finalização cria snapshot imutável.
- Lista finalizada não é editável.
- Usuário pode duplicar lista para reutilizar.
- Baseline é o menor carrinho completo em um único mercado.
- Mercado que mais contribuiu é calculado por contribuição de economia item a item.
- Período padrão da home é o mês calendário atual.
- Primeiro incremento backend deve priorizar snapshot e métricas, sem recibo nem comprovação externa.

---

## 19. Riscos e Pontos em Aberto

- Preços podem estar defasados no momento da compra.
- Economia `ESTIMATED_CONFIRMED` não prova gasto real.
- Potencial de economia pode ser caro se calculado para muitas listas ativas.
- Se não houver mercado único completo, não há baseline para economia confirmada.
- Futuramente pode ser necessário versionar estratégia de cálculo para preservar compatibilidade de snapshots antigos.

