import { Pool } from "pg";
import * as cheerio from "cheerio";
import "dotenv/config";

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function scrapeSingleProduct(url: string) {
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT, Accept: "text/html" },
    });

    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Falha na requisição: ${res.status}`);

    const html = await res.text();
    const $ = cheerio.load(html);

    let ean = $(".product-detail").attr("data-pid")?.trim();
    if (!ean) {
      ean = $(".product-infos .product-id").text().replace(/[^\d]/g, "");
    }
    if (!ean || !/^\d{4,5}$|^\d{8,14}$/.test(ean)) return null;

    const name = $("h1.product-name").text().trim();
    if (!name) return null;

    const priceAttr = $(".prices .value").first().attr("content")?.trim();
    console.log(priceAttr);
    const price = priceAttr ? Number(priceAttr) : NaN;
    if (!Number.isFinite(price) || price <= 0) return null;

    return { ean, name, price, url };
  } catch (error) {
    console.error(`Erro ao acessar ${url}:`, error);
    return null;
  }
}

async function main() {
  console.log("Iniciando atualização de preços via URL...");

  // 1. Busca todos os produtos do Jaú Serve que já possuem uma URL
  const { rows: products } = await pool.query(`
    SELECT mp.id, mp.url 
    FROM "MarketProduct" mp
    INNER JOIN "Market" m ON m.id = mp."marketId"
    WHERE mp.url IS NOT NULL AND m.slug = 'JAU_SERVE'
  `);

  console.log(`Encontrados ${products.length} produtos para atualizar.`);

  // 2. Itera sobre os produtos e atualiza um por um
  for (const product of products) {
    console.log(`Raspando: ${product.url}`);
    const scrapedData = await scrapeSingleProduct(product.url);

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      if (!scrapedData) {
        await client.query(
          `
          UPDATE "MarketProduct"
          SET "isAvailable" = false, "lastScrapedAt" = NOW()
          WHERE id = $1
        `,
          [product.id],
        );
        console.log(`❌ Produto ${product.id} marcado como indisponível.`);
      } else {
        await client.query(
          `
          UPDATE "MarketProduct"
          SET "nameInMarket" = $1, "isAvailable" = true, "lastScrapedAt" = NOW()
          WHERE id = $2
        `,
          [scrapedData.name, product.id],
        );

        await client.query(
          `
          INSERT INTO "PriceHistory" (id, price, timestamp, "marketProductId")
          VALUES (gen_random_uuid(), $1, NOW(), $2)
        `,
          [scrapedData.price, product.id],
        );

        console.log(`✅ Produto ${product.id} atualizado: R$ ${scrapedData.price}`);
      }

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK");
      console.error(`Erro ao salvar no banco o produto ${product.id}:`, error);
    } finally {
      client.release();
    }

    await new Promise(resolve => setTimeout(resolve, 1500));
  }

  console.log("Atualização finalizada!");
  await pool.end();
  process.exit(0);
}

main().catch(error => {
  console.error("Erro fatal no script:", error);
  process.exit(1);
});
