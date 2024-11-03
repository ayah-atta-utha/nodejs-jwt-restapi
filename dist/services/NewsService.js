"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsService = void 0;
class NewsService {
    constructor(newsRepository, categoryRepository) {
        this.newsRepository = newsRepository;
        this.categoryRepository = categoryRepository;
    }
    async getAllNews() {
        return await this.newsRepository.find();
    }
    async getNewsById(id) {
        const news = await this.newsRepository.findOneBy({ id });
        if (!news) {
            throw new Error("News not found"); // Throw an error if news is not found
        }
        return news;
    }
    async createNews(newsData, categoryId) {
        // Check if the category exists
        const category = await this.categoryRepository.findOneBy({
            id: categoryId,
        });
        if (!category) {
            throw new Error("Category not found"); // Throw an error if category does not exist
        }
        const news = this.newsRepository.create({ ...newsData, category });
        return this.newsRepository.save(news);
    }
    async updateNews(id, newsData) {
        const result = await this.newsRepository.update(id, newsData);
        if (result.affected === 0) {
            throw new Error("News not found"); // Throw an error if no rows were affected
        }
        return this.newsRepository.findOneBy({ id });
    }
    async deleteNews(id) {
        const result = await this.newsRepository.delete(id);
        if (result.affected === 0) {
            throw new Error("News not found");
        }
        return result;
    }
}
exports.NewsService = NewsService;
