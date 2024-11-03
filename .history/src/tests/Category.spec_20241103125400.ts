import { CategoryService } from "../services/CategoryService";
import { Category } from "../entities/Category";
// import { Repository } from "typeorm";
import { DeepMocked, createMock } from '@golevelup/ts-jest';

// Mock repository type
type MockRepository<T = any> = DeepMocked<Repository<T>>;

describe("CategoryService", () => {
  let categoryService: CategoryService;
  let mockCategoryRepository: MockRepository<Category>;

  beforeEach(() => {
    // Create a mock repository
    mockCategoryRepository = createMock<Repository<Category>>();
    categoryService = new CategoryService(mockCategoryRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should retrieve all categories", async () => {
    const categories: Category[] = [
      { id: 1, name: "Technology", createdAt: new Date(), updatedAt: new Date() },
      { id: 2, name: "Science", createdAt: new Date(), updatedAt: new Date() },
    ];

    mockCategoryRepository.find.mockResolvedValue(categories);

    const result = await categoryService.getAllCategories();
    expect(result).toEqual(categories);
    expect(mockCategoryRepository.find).toHaveBeenCalledTimes(1);
  });

  it("should create a new category", async () => {
    const newCategoryData = { name: "Health" };
    const createdCategory = { id: 3, ...newCategoryData, createdAt: new Date(), updatedAt: new Date() };

    mockCategoryRepository.create.mockReturnValue(createdCategory);
    mockCategoryRepository.save.mockResolvedValue(createdCategory);

    const result = await categoryService.createCategory(newCategoryData);
    expect(result).toEqual(createdCategory);
    expect(mockCategoryRepository.create).toHaveBeenCalledWith(newCategoryData);
    expect(mockCategoryRepository.save).toHaveBeenCalledWith(createdCategory);
  });

  it("should update an existing category", async () => {
    const categoryId = 1;
    const updateData = { name: "Updated Category" };
    const updatedCategory = { id: categoryId, name: "Updated Category", createdAt: new Date(), updatedAt: new Date() };

    mockCategoryRepository.update.mockResolvedValue({ affected: 1 });
    mockCategoryRepository.findOneBy.mockResolvedValue(updatedCategory);

    const result = await categoryService.updateCategory(categoryId, updateData);
    expect(result).toEqual(updatedCategory);
    expect(mockCategoryRepository.update).toHaveBeenCalledWith(categoryId, updateData);
    expect(mockCategoryRepository.findOneBy).toHaveBeenCalledWith({ id: categoryId });
  });

  it("should throw an error if trying to update a non-existent category", async () => {
    const categoryId = 99;
    const updateData = { name: "Non-existent Category" };

    mockCategoryRepository.update.mockResolvedValue({ affected: 0 });
    mockCategoryRepository.findOneBy.mockResolvedValue(null);

    await expect(categoryService.updateCategory(categoryId, updateData)).rejects.toThrow("Category not found");
    expect(mockCategoryRepository.update).toHaveBeenCalledWith(categoryId, updateData);
  });

  it("should delete a category", async () => {
    const categoryId = 1;
    mockCategoryRepository.delete.mockResolvedValue({ affected: 1 });

    const result = await categoryService.deleteCategory(categoryId);
    expect(result.affected).toBe(1);
    expect(mockCategoryRepository.delete).toHaveBeenCalledWith(categoryId);
  });

  it("should throw an error if trying to delete a non-existent category", async () => {
    const categoryId = 99;
    mockCategoryRepository.delete.mockResolvedValue({ affected: 0 });

    await expect(categoryService.deleteCategory(categoryId)).rejects.toThrow("Category not found");
    expect(mockCategoryRepository.delete).toHaveBeenCalledWith(categoryId);
  });
});
