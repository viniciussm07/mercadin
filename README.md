
# Documento de Apresentação

## Disciplinas
SSC0961 - Desenvolvimento Web e Mobile (2026)  
SSC0535 - Gerência de Configuração, Manutenção e Evolução de Software (2026)

## Integrantes
- Cleverson Cristian Oliveira Sousa - 15522410
- Leonardo Gonsalez - 15657074
- Miguel Filippo - 15480331
- Vinicius Soares Martins - 11794907
- Renan Silva Soriano - 11794824

---

## Proposta
A aplicação é voltada ao planejamento financeiro da alimentação, oferecendo maior previsibilidade de gastos a partir da montagem de listas de compras.

O sistema integrará dados dos supermercados mais relevantes de São Carlos, permitindo ao usuário:
- Montar listas de compras com base nos produtos disponíveis;
- Visualizar o custo estimado da compra de forma imediata;
- Obter insights como comparação entre mercados, variação de preços e alternativas mais econômicas.

---

## MVP (Produto Mínimo Viável)
Funcionalidade central:
- Criação de listas de compras personalizadas, exibindo:
	- Preço de cada item em diferentes supermercados;
	- Custo total da lista em cada mercado;
	- Combinação de produtos (inclusive entre mercados distintos) que resulte no menor custo total.

### Obtenção dos Dados
Os dados serão obtidos por raspagem dos sites dos supermercados, sob demanda, criando uma camada intermediária semelhante a uma API para consulta de preços e produtos.

---

## Funcionalidades Principais
- Montagem de listas de compras
- Comparação de preços entre mercados locais
- Identificação da combinação mais barata de produtos
- Cadastro de produtos favoritos
- Monitoramento de promoções de produtos selecionados
- Notificações quando itens favoritados entrarem em promoção

# Estrutura
.
├── client			# frontend
├── README.md
└── server			# backend
