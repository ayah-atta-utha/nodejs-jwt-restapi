import { Repository } from "typeorm";
import { Category } from "../entities/Category";
import { AppDataSource } from "../data-source";

export class CategoryService {
  constructor(private categoryRepository: Repository<Category>) {}

  // Get all categories
  async getAllCategories() {
    return await this.categoryRepository.find();
  }

  async getCategory(id: number) {
    const category = await this.categoryRepository.findOneBy({ id });
    console.log('Fetched category:', category); // Debugging log
    if (!category) {
      throw new Error("Category not found"); // Throw an error if category is not found
    }
  }

  // Create a new category
  async createCategory(data: Partial<Category>) {
    const category = this.categoryRepository.create(data);
    return await this.categoryRepository.save(category);
  }

  // Update an existing category
  async updateCategory(id: number, data: Partial<Category>) {
    const result = await this.categoryRepository.update(id, data);
    if (result.affected === 0) {
      throw new Error("Category not found"); // Throw an error if no rows were affected
    }
    return this.categoryRepository.findOneBy({ id }); // Return the updated category
  }

  // Delete a category
  async deleteCategory(id: number) {
    const result = await this.categoryRepository.delete(id);
    if (result.affected === 0) {
      throw new Error("Category not found"); // Optional: throw an error if trying to delete a non-existent category
    }
    return result;
  }
}
