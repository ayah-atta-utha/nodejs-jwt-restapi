"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
class CategoryService {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    // Get all categories
    async getAllCategories() {
        return await this.categoryRepository.find();
    }
    async getCategory(id) {
        const category = await this.categoryRepository.findOneBy({ id });
        console.log('Fetched category:', category); // Debugging log
        if (!category) {
            throw new Error("Category not found"); // Throw an error if category is not found
        }
        return category;
    }
    // Create a new category
    async createCategory(data) {
        const category = this.categoryRepository.create(data);
        return await this.categoryRepository.save(category);
    }
    // Update an existing category
    async updateCategory(id, data) {
        const result = await this.categoryRepository.update(id, data);
        if (result.affected === 0) {
            throw new Error("Category not found"); // Throw an error if no rows were affected
        }
        return this.categoryRepository.findOneBy({ id }); // Return the updated category
    }
    // Delete a category
    async deleteCategory(id) {
        const result = await this.categoryRepository.delete(id);
        if (result.affected === 0) {
            throw new Error("Category not found");
        }
        return result;
    }
}
exports.CategoryService = CategoryService;
