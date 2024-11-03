"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CategoryService_1 = require("../services/CategoryService");
describe("CategoryService", () => {
    let categoryService;
    let categoryRepository;
    beforeEach(() => {
        // Setting up the mocked repository
        categoryRepository = {
            create: jest.fn(),
            save: jest.fn(),
            findOneBy: jest.fn(),
            find: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };
        categoryService = new CategoryService_1.CategoryService(categoryRepository);
    });
    it("should create a new category", async () => {
        const categoryData = { name: "Technology" };
        const savedCategory = {
            id: 1,
            ...categoryData,
            news: [], // Providing an empty array or undefined based on your logic
        };
        categoryRepository.create.mockReturnValue(savedCategory);
        categoryRepository.save.mockResolvedValue(savedCategory);
        const result = await categoryService.createCategory(categoryData);
        expect(result).toEqual(savedCategory);
        expect(categoryRepository.create).toHaveBeenCalledWith(categoryData);
        expect(categoryRepository.save).toHaveBeenCalledWith(savedCategory);
    });
    it("should retrieve all categories", async () => {
        const categories = [
            { id: 1, name: "Technology", createdAt: new Date(), updatedAt: new Date(), news: [] },
            { id: 2, name: "Science", createdAt: new Date(), updatedAt: new Date(), news: [] },
        ];
        categoryRepository.find.mockResolvedValue(categories);
        const result = await categoryService.getAllCategories();
        expect(categoryRepository.find).toHaveBeenCalledTimes(1);
        expect(result).toEqual(categories);
    });
    it("should update an existing category", async () => {
        const categoryId = 1;
        const updateData = { name: "Updated Category" };
        const updatedCategory = { id: categoryId, ...updateData, createdAt: new Date(), updatedAt: new Date(), news: [] };
        categoryRepository.update.mockResolvedValue({ affected: 1 }); // `affected` is 1
        categoryRepository.findOneBy.mockResolvedValue(updatedCategory);
        const result = await categoryService.updateCategory(categoryId, updateData);
        expect(categoryRepository.update).toHaveBeenCalledWith(categoryId, updateData);
        expect(result).toEqual(updatedCategory);
    });
    it("should throw an error if trying to update a non-existent category", async () => {
        const categoryId = 99;
        const updateData = { name: "Non-existent Category" };
        categoryRepository.update.mockResolvedValue({ affected: 0 }); // `affected` is 0
        categoryRepository.findOneBy.mockResolvedValue(null);
        await expect(categoryService.updateCategory(categoryId, updateData)).rejects.toThrow("Category not found");
        expect(categoryRepository.update).toHaveBeenCalledWith(categoryId, updateData);
    });
    it("should delete a category", async () => {
        const categoryId = 1;
        categoryRepository.delete.mockResolvedValue({ affected: 1 });
        const result = await categoryService.deleteCategory(categoryId);
        expect(categoryRepository.delete).toHaveBeenCalledWith(categoryId);
        expect(result.affected).toBe(1);
    });
    it("should throw an error if trying to delete a non-existent category", async () => {
        const categoryId = 99;
        categoryRepository.delete.mockResolvedValue({ affected: 0 });
        await expect(categoryService.deleteCategory(categoryId)).rejects.toThrow("Category not found");
        expect(categoryRepository.delete).toHaveBeenCalledWith(categoryId);
    });
    it('should return the category when found', async () => {
        const mockCategory = { id: 1, name: 'Technology', createdAt: new Date(), updatedAt: new Date() };
        // Mock the findOneBy method to return a category
        categoryRepository.findOneBy.mockResolvedValue(mockCategory);
        const result = await categoryService.getCategory(1);
        expect(result).toEqual(mockCategory); // Check if the result matches the mock category
        expect(categoryRepository.findOneBy).toHaveBeenCalledWith({ id: 1 }); // Verify findOneBy was called correctly
    });
    it('should throw an error when the category is not found', async () => {
        // Mock the findOneBy method to return null
        categoryRepository.findOneBy.mockResolvedValue(null);
        await expect(categoryService.getCategory(1)).rejects.toThrow("Category not found"); // Check for error
        expect(categoryRepository.findOneBy).toHaveBeenCalledWith({ id: 1 }); // Verify findOneBy was called correctly
    });
});