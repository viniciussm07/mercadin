import { SavegnagoScraper } from "./savegnago.scraper";

describe("SavegnagoScraper", () => {
  const scraper = new SavegnagoScraper();

  afterEach(() => jest.restoreAllMocks());

  it("fetches and parses valid products", async () => {
    const payload = [
      {
        productName: "Arroz",
        productReference: "12345",
        brand: "Marca",
        link: "https://savegnago.test/arroz",
        items: [
          {
            ean: "7891234567890",
            itemId: "sku-1",
            images: [{ imageUrl: "https://images.test/arroz.png" }],
            sellers: [{ commertialOffer: { Price: 11.25 } }],
          },
        ],
      },
      {
        productName: "Invalid",
        productReference: "invalid",
        items: [{ ean: "invalid", sellers: [{ commertialOffer: { Price: 10 } }] }],
      },
    ];
    const fetchMock = jest
      .spyOn(global, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify(payload), { status: 200 }));

    await expect(scraper.search("arroz integral")).resolves.toEqual([
      {
        ean: "7891234567890",
        sku: "sku-1",
        name: "Arroz",
        price: 11.25,
        imageUrl: "https://images.test/arroz.png",
        url: "https://savegnago.test/arroz",
        brand: "Marca",
      },
    ]);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("?ft=arroz%20integral&_from=0&_to=49"),
      expect.objectContaining({
        headers: expect.objectContaining({ Accept: "application/json" }),
      }),
    );
  });

  it("uses a valid product reference when the EAN is missing", async () => {
    const payload = [
      {
        productName: "Produce",
        productReference: "12345",
        items: [
          {
            ean: "",
            itemId: "sku-2",
            sellers: [{ commertialOffer: { Price: 3.5 } }],
          },
        ],
      },
    ];
    jest
      .spyOn(global, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify(payload), { status: 200 }));

    await expect(scraper.search("produce")).resolves.toEqual([
      expect.objectContaining({ ean: "12345", sku: "sku-2", price: 3.5 }),
    ]);
  });

  it("throws for invalid payloads and failed requests", async () => {
    jest
      .spyOn(global, "fetch")
      .mockResolvedValueOnce(new Response("{}", { status: 200 }))
      .mockResolvedValueOnce(new Response("", { status: 502 }));

    await expect(scraper.search("rice")).rejects.toThrow("Unexpected Savegnago product payload");
    await expect(scraper.search("rice")).rejects.toThrow(
      /Savegnago search failed \(502\) for query "rice"/,
    );
  });
});
