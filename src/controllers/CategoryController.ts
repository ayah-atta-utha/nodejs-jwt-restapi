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
import { CategoryService } from "../services/CategoryService";
import { Category } from "../entities/Category";
import { Repository } from "typeorm";
import AppDataSource from "../data-source";

@JsonController("/categories")
export class CategoryController {
  private categoryService: CategoryService;

  constructor() {
    const categoryRepository: Repository<Category> =
      AppDataSource.getRepository(Category);
    this.categoryService = new CategoryService(categoryRepository);
  }

  // Get all categories (accessible to both general and admin roles)
  @Get("/")
  @Authorized(["admin"])
  async getAll() {
    return await this.categoryService.getAllCategories();
  }

  // Create a new category (admin role only)
  @Authorized(["admin"])
  @Post("/")
  async create(@Body() categoryData: Partial<Category>) {
    return await this.categoryService.createCategory(categoryData);
  }

  // Update an existing category (admin role only)
  @Authorized(["admin"])
  @Put("/:id")
  async update(
    @Param("id") id: number,
    @Body() categoryData: Partial<Category>
  ) {
    return await this.categoryService.updateCategory(id, categoryData);
  }

  // Delete a category (admin role only)
  @Authorized(["admin"])
  @Delete("/:id")
  async delete(@Param("id") id: number) {
    return await this.categoryService.deleteCategory(id);
  }
}
