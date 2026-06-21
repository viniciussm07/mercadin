import { JauserveScraper } from "./jauserve.scraper";

const html = `
  <div class="grid-tile" data-pid="7891234567890">
    <a class="link txt-ellipsis" href="/arroz">Arroz Integral</a>
    <span class="value" content="12.50"></span>
    <img class="tile-image" src="https://images.test/arroz.png" />
  </div>
  <div class="grid-tile" data-pid="invalid">
    <a class="link txt-ellipsis">Invalid EAN</a>
    <span class="value" content="10"></span>
  </div>
  <div class="grid-tile" data-pid="12345">
    <a class="link txt-ellipsis">Invalid Price</a>
    <span class="value" content="0"></span>
  </div>
`;

describe("JauserveScraper", () => {
  const scraper = new JauserveScraper();

  afterEach(() => jest.restoreAllMocks());

  it("fetches and parses valid products", async () => {
    const fetchMock = jest
      .spyOn(global, "fetch")
      .mockResolvedValueOnce(new Response(html, { status: 200 }));

    await expect(scraper.search("arroz integral")).resolves.toEqual([
      {
        ean: "7891234567890",
        sku: "7891234567890",
        name: "Arroz Integral",
        price: 12.5,
        imageUrl: "https://images.test/arroz.png",
        url: "https://www.jauserve.com.br/arroz",
      },
    ]);

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("?q=arroz%20integral"),
      expect.objectContaining({
        headers: expect.objectContaining({ Accept: "text/html" }),
      }),
    );
  });

  it("throws when the market request fails", async () => {
    jest.spyOn(global, "fetch").mockResolvedValueOnce(new Response("", { status: 503 }));

    await expect(scraper.search("rice")).rejects.toThrow(
      /Jauserve search failed \(503\) for query "rice"/,
    );
  });
});
