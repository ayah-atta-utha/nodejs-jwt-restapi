 
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

@JsonController("/news")
export class NewsController {private newsService: NewsService;

    constructor() {
      const newsRepository: Repository<News> = AppDataSource.getRepository(News);
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

  @Post("/")
  @HttpCode(201)
  @UseBefore(adminMiddleware)
  create(@Body() newsData: Partial<News>) {
    return this.newsService.createNews(newsData);
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
