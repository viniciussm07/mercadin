import { TendaAtacadoScraper } from "./tenda-atacado.scraper";

const createHtml = (payload: unknown) =>
  `<script id="__NEXT_DATA__" type="application/json">${JSON.stringify(payload)}</script>`;

describe("TendaAtacadoScraper", () => {
  const scraper = new TendaAtacadoScraper();

  afterEach(() => jest.restoreAllMocks());

  it("fetches and parses valid products", async () => {
    const html = createHtml({
      props: {
        initialMobxState: {
          productStore: {
            productByPage: [
              {
                barcode: "7891234567890",
                sku: "sku-1",
                name: "Arroz",
                price: 9.9,
                thumbnail: "https://images.test/arroz.png",
                url: "/arroz",
                brand: "Marca",
              },
              { barcode: "invalid", name: "Invalid", price: 10 },
              { barcode: "12345", name: "No price", price: 0 },
            ],
          },
        },
      },
    });
    const fetchMock = jest
      .spyOn(global, "fetch")
      .mockResolvedValueOnce(new Response(html, { status: 200 }));

    await expect(scraper.search("arroz branco")).resolves.toEqual([
      {
        ean: "7891234567890",
        sku: "sku-1",
        name: "Arroz",
        price: 9.9,
        imageUrl: "https://images.test/arroz.png",
        url: "https://www.tendaatacado.com.br/arroz",
        brand: "Marca",
      },
    ]);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("?q=arroz%20branco"),
      expect.objectContaining({
        headers: expect.objectContaining({ Accept: "text/html" }),
      }),
    );
  });

  it("throws for an invalid product payload", async () => {
    jest
      .spyOn(global, "fetch")
      .mockResolvedValueOnce(new Response(createHtml({ props: {} }), { status: 200 }));

    await expect(scraper.search("rice")).rejects.toThrow(
      "Unexpected Tenda Atacado product payload",
    );
  });

  it("throws when the market request fails", async () => {
    jest.spyOn(global, "fetch").mockResolvedValueOnce(new Response("", { status: 500 }));

    await expect(scraper.search("rice")).rejects.toThrow(
      /Tenda Atacado search failed \(500\) for query "rice"/,
    );
  });
});
