 
import { Repository, UpdateResult } from "typeorm";
import { Category } from "../entities/Category";
import { CategoryService } from "../services/CategoryService";

// Mock the typeorm module
jest.mock("typeorm", () => {
  const actualTypeorm = jest.requireActual("typeorm");
  return {
    ...actualTypeorm,
    DataSource: jest.fn().mockReturnValue({
      getRepository: jest.fn().mockReturnValue({
        find: jest.fn(),
        findOneBy: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      }),
    }),
  };
});
 

describe("CategoryService", () => {
  let categoryService: CategoryService;
  let categoryRepository: jest.Mocked<Repository<Category>>;

  beforeEach(() => {
    // Setting up the mocked repository
    categoryRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOneBy: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<Repository<Category>>;

    categoryService = new CategoryService(categoryRepository);
  });

  it("should create a new category", async () => {
    const categoryData = { name: "Technology" };
    const savedCategory = {
        id: 1,
        ...categoryData,
        news: [], // Providing an empty array or undefined based on your logic
    };

    (categoryRepository.create as jest.Mock).mockReturnValue(savedCategory);
    (categoryRepository.save as jest.Mock).mockResolvedValue(savedCategory);

    const result = await categoryService.createCategory(categoryData);
    expect(result).toEqual(savedCategory);
    expect(categoryRepository.create).toHaveBeenCalledWith(categoryData);
    expect(categoryRepository.save).toHaveBeenCalledWith(savedCategory);
  });

  it("should retrieve all categories", async () => {
    const categories: Category[] = [
      { id: 1, name: "Technology", createdAt: new Date(), updatedAt: new Date(),news:[] },
      { id: 2, name: "Science", createdAt: new Date(), updatedAt: new Date() ,news:[]},
    ];

    categoryRepository.find.mockResolvedValue(categories);

    const result = await categoryService.getAllCategories();
    expect(categoryRepository.find).toHaveBeenCalledTimes(1);
    expect(result).toEqual(categories);
  });

  it("should update an existing category", async () => {
    const categoryId = 1;
    const updateData = { name: "Updated Category" };
    const updatedCategory = { id: categoryId, ...updateData, createdAt: new Date(), updatedAt: new Date(),news:[] };
 

    categoryRepository.update.mockResolvedValue({affected: 1}as any); // `affected` is 1
   categoryRepository.findOneBy.mockResolvedValue(updatedCategory);

    const result = await categoryService.updateCategory(categoryId, updateData);
    expect(categoryRepository.update).toHaveBeenCalledWith(categoryId, updateData);
    expect(result).toEqual(updatedCategory);
  });

  it("should throw an error if trying to update a non-existent category", async () => {
    const categoryId = 99;
    const updateData = { name: "Non-existent Category" };

   
    categoryRepository.update.mockResolvedValue({affected:0}as any); // `affected` is 0
  categoryRepository.findOneBy.mockResolvedValue(null);

    await expect(categoryService.updateCategory(categoryId, updateData)).rejects.toThrow("Category not found");
    expect(categoryRepository.update).toHaveBeenCalledWith(categoryId, updateData);
  });

  it("should delete a category", async () => {
    const categoryId = 1;

    categoryRepository.delete.mockResolvedValue({ affected: 1 }as any) ;

    const result = await categoryService.deleteCategory(categoryId);
    expect(categoryRepository.delete).toHaveBeenCalledWith(categoryId);
    expect(result.affected).toBe(1);
  });

  it("should throw an error if trying to delete a non-existent category", async () => {
    const categoryId = 99;

    categoryRepository.delete.mockResolvedValue({ affected: 0 }as any);

    await expect(categoryService.deleteCategory(categoryId)).rejects.toThrow("Category not found");
    expect(categoryRepository.delete).toHaveBeenCalledWith(categoryId);
  });
  it('should return the category when found', async () => {
    const mockCategory = { id: 1, name: 'Technology', createdAt: new Date(), updatedAt: new Date() };

    // Mock the findOneBy method to return a category
    (categoryRepository.findOneBy as jest.Mock).mockResolvedValue(mockCategory);

    const result = await categoryService.getCategory(1);

    expect(result).toEqual(mockCategory); // Check if the result matches the mock category
    expect(categoryRepository.findOneBy).toHaveBeenCalledWith({ id: 1 }); // Verify findOneBy was called correctly
});

it('should throw an error when the category is not found', async () => {
    // Mock the findOneBy method to return null
    (categoryRepository.findOneBy as jest.Mock).mockResolvedValue(null);

    await expect(categoryService.getCategory(1)).rejects.toThrow("Category not found"); // Check for error
    expect(categoryRepository.findOneBy).toHaveBeenCalledWith({ id: 1 }); // Verify findOneBy was called correctly
});
});
