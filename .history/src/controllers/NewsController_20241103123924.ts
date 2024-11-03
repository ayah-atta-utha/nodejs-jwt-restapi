 
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

 
    constructor() {
      const newsRepository: Repository<News> = AppDataSource.getRepository(News);

  const categoryRepository:Repository<Category> = AppDataSource.getRepository(Category);
      this.categoryService = new CategoryService(categoryRepository);
      this.newsService = new NewsService(newsRepository);
    }
  @Get("/")
  getAll() {
    return this.newsService.getAllNews();
  }

  @Get("/:id")
  getOne(@Param("id") id: number) {
    return this.newsService.getNewsById(id);
  }

  // @Post("/")
  // @HttpCode(201)
  // @UseBefore(adminMiddleware)
  // create(@Body() newsData: Partial<News>) {
  //   return this.newsService.createNews(newsData);
  // }



  async createNews(data: Partial<News>, categoryId: number) {
    const category = await this.categoryRepository.findOneBy({ id: categoryId });
    if (!category) throw new Error("Category not found");

    const news = this.newsRepository.create({ ...data, category });
    return await this.newsRepository.save(news);
  }

  @Put("/:id")
  update(@Param("id") id: number, @Body() newsData: Partial<News>) {
    return this.newsService.updateNews(id, newsData);
  }

  @Delete("/:id")
  @HttpCode(204)
  delete(@Param("id") id: number) {
    return this.newsService.deleteNews(id);
  }
}
