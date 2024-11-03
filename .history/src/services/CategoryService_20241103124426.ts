 
import { Repository } from "typeorm";
import { Category } from "../entities/Category";
import { AppDataSource } from "../data-source";

export class CategoryService {
 

  constructor( private categoryRepository: Repository<Category>) {
    // this.categoryRepository = AppDataSource.getRepository(Category);
  }

  // Get all categories
  async getAllCategories() {
    return await this.categoryRepository.find();
  }
  async getCategory(id:number){
    return await this.categoryRepository.findOne({id:id});
  }

  // Create a new category
  async createCategory(data: Partial<Category>) {
    const category = this.categoryRepository.create(data);
    return await this.categoryRepository.save(category);
  }

  // Update an existing category
  async updateCategory(id: number, data: Partial<Category>) {
    await this.categoryRepository.update(id, data);
    return await this.categoryRepository.findOneBy({ id });
  }

  // Delete a category
  async deleteCategory(id: number) {
    return await this.categoryRepository.delete(id);
  }
}
