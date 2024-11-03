 
import { CategoryService } from "../../src/services/CategoryService";
import { AppDataSource } from "../../src/data-source";
import { Category } from "../../src/entities/Category";

beforeAll(async () => {
  await AppDataSource.initialize();
});

afterAll(async () => {
  await AppDataSource.destroy();
});

describe("CategoryService", () => {
  const categoryService = new CategoryService();

  it("should create a new category", async () => {
    const categoryData = { name: "Tech" };
    const category = await categoryService.createCategory(categoryData);
    expect(category).toHaveProperty("id");
    expect(category.name).toBe("Tech");
  });

  // Additional tests for getAllCategories, updateCategory, and deleteCategory
});
