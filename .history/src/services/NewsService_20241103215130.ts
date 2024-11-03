 
import { Repository } from "typeorm/repository/Repository";
import { AppDataSource } from "../data-source";
import { News } from "../entities/News";

export class NewsService {
//   private newsRepository = AppDataSource.getRepository(News);

  getAllNews() {
    return this.newsRepository.find();
  }

  getNewsById(id: number) {
    return this.newsRepository.findOneBy({ id });
  }

  constructor(private newsRepository: Repository<News>) {}

  createNews(newsData: Partial<News>) {
    const news = this.newsRepository.create(newsData);
    return this.newsRepository.save(news);
  }

  updateNews(id: number, newsData: Partial<News>) {
    return this.newsRepository.update(id, newsData);
  }

  deleteNews(id: number) {
    return this.newsRepository.delete(id);
  }
}
