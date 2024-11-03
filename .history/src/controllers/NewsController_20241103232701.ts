 
import {
  JsonController,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  UseBefore,
} from "routing-controllers";
import { NewsService } from "../services/NewsService";
import { News } from "../entities/News";
import { Repository } from "typeorm/repository/Repository";
import AppDataSource from "../data-source";
import { adminMiddleware } from "../middleware/AdminMiddleware";
import { CategoryService } from "../services/CategoryService";
import { Category } from "../entities/Category";

@JsonController("/news")
export class NewsController {private newsService: NewsService;
  private categoryService: CategoryService; 
 
  @Get("/")
  async getAll() {
    return await this.newsService.getAllNews();
  }

  @Get("/:id")
  async getOne(@Param("id") id: number) {
    return  await this.newsService.getNewsById(id);
  }
  
  constructor() {
    const newsRepository: Repository<News> = AppDataSource.getRepository(News);
    const categoryRepository:Repository<Category> = AppDataSource.getRepository(Category);

    this.categoryService = new CategoryService(categoryRepository);
    this.newsService = new NewsService(newsRepository,categoryRepository);
  }
  

  @Post("/")
  @HttpCode(201)
  @UseBefore(adminMiddleware)
  async createNews(data: Partial<News>, categoryId: number) {
    
    const category = await this.categoryService.getCategory(categoryId );
    if (!category) throw new Error("Category not found");

   return await this.newsService.createNews({ ...data },categoryId); 
  }

  @Put("/:id")
  @UseBefore(adminMiddleware)
  async update(@Param("id") id: number, @Body() newsData: Partial<News>) {
    return await this.newsService.updateNews(id, newsData);
  }

  @Delete("/:id")
  @HttpCode(204)

  @UseBefore(adminMiddleware)
  async delete(@Param("id") id: number) {
    return  await this.newsService.deleteNews(id);
  }
}
