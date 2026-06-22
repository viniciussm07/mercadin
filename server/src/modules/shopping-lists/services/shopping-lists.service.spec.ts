import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { ShoppingListsRepository } from "../repositories/shopping-lists.repository";
import { ShoppingListsService } from "./shopping-lists.service";

describe("ShoppingListsService basic operations", () => {
  const repo = {
    create: jest.fn(),
    delete: jest.fn(),
    deleteAllByUser: jest.fn(),
    findAllByUser: jest.fn(),
    findByIdForUser: jest.fn(),
    findDetailsByIdForUser: jest.fn(),
    update: jest.fn(),
  };
  let service: ShoppingListsService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [ShoppingListsService, { provide: ShoppingListsRepository, useValue: repo }],
    }).compile();
    service = moduleRef.get(ShoppingListsService);
  });

  beforeEach(() => jest.clearAllMocks());

  it("delegates list and create operations", () => {
    service.findAll("user-1");
    service.create("user-1", { name: "Weekly" });
    service.removeAll("user-1");

    expect(repo.findAllByUser).toHaveBeenCalledWith("user-1");
    expect(repo.create).toHaveBeenCalledWith("user-1", "Weekly");
    expect(repo.deleteAllByUser).toHaveBeenCalledWith("user-1");
  });

  it("returns list details or throws when missing", async () => {
    const list = { id: "list-1" };
    repo.findDetailsByIdForUser.mockResolvedValueOnce(list).mockResolvedValueOnce(null);

    await expect(service.findOne("list-1", "user-1")).resolves.toBe(list);
    await expect(service.findOne("missing", "user-1")).rejects.toBeInstanceOf(NotFoundException);
  });

  it("updates and removes owned lists", async () => {
    repo.findByIdForUser.mockResolvedValue({ id: "list-1" });
    repo.update.mockResolvedValueOnce({ id: "list-1", name: "Updated" });
    repo.delete.mockResolvedValueOnce({ id: "list-1" });

    await service.update("list-1", "user-1", { name: "Updated" });
    await service.remove("list-1", "user-1");

    expect(repo.update).toHaveBeenCalledWith("list-1", { name: "Updated" });
    expect(repo.delete).toHaveBeenCalledWith("list-1");
  });

  it("rejects changes to inaccessible lists", async () => {
    repo.findByIdForUser.mockResolvedValueOnce(null);

    await expect(service.update("list-1", "user-1", { name: "Updated" })).rejects.toBeInstanceOf(
      ForbiddenException,
    );
    expect(repo.update).not.toHaveBeenCalled();
  });
});
