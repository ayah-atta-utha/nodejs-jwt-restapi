 
import { Repository } from "typeorm/repository/Repository";
import { AppDataSource } from "../data-source";
import { News } from "../entities/News";
import { Category } from "../entities/Category";

export class NewsService { 

  constructor(private newsRepository: Repository<News>,private categoryRepository: Repository<Category>) {}

  async getAllNews() {
    return await this.newsRepository.find();
  }

  async getNewsById(id: number) { 
    const news = await this.newsRepository.findOneBy({ id });
  if (!news) {
    throw new Error("News not found"); // Throw an error if news is not found
  }
  }



  async createNews(newsData: Partial<News>, categoryId: number) {
    // Check if the category exists
    const category = await this.categoryRepository.findOneBy({ id: categoryId });
    if (!category) {
      throw new Error("Category not found"); // Throw an error if category does not exist
    }

    const news = this.newsRepository.create({ ...newsData, category });
    return this.newsRepository.save(news);
  }

  async updateNews(id: number, newsData: Partial<News>) {
    return await this.newsRepository.update(id, newsData);
  }

  async deleteNews(id: number) {
    return await this.newsRepository.delete(id);
  }
}