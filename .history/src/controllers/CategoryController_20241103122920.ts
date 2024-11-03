 
import {
  JsonController,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Authorized,
} from "routing-controllers";
import { Category } from "../entities/Category";
import { AppDataSource } from "../data-source";

@JsonController("/categories")
export class CategoryController {
  private categoryRepository = AppDataSource.getRepository(Category);

  // Get all categories (accessible to both general and admin roles)
  @Get("/")
  async getAll() {
    return await this.categoryRepository.find();
  }

  // Create a new category (admin role only)
  @Authorized(["admin"])
  @Post("/")
  async create(@Body() categoryData: Partial<Category>) {
    const category = this.categoryRepository.create(categoryData);
    return await this.categoryRepository.save(category);
  }

  // Update an existing category (admin role only)
  @Authorized(["admin"])
  @Put("/:id")
  async update(@Param("id") id: number, @Body() categoryData: Partial<Category>) {
    await this.categoryRepository.update(id, categoryData);
    return this.categoryRepository.findOneBy({ id });
  }

  // Delete a category (admin role only)
  @Authorized(["admin"])
  @Delete("/:id")
  async delete(@Param("id") id: number) {
    return await this.categoryRepository.delete(id);
  }
}
