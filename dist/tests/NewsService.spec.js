"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NewsService_1 = require("../services/NewsService");
const Category_1 = require("../entities/Category");
describe("NewsService", () => {
    let newsService;
    let newsRepository;
    let categoryRepository;
    beforeEach(() => {
        // Setting up the mocked repository
        newsRepository = {
            create: jest.fn(),
            save: jest.fn(),
            findOneBy: jest.fn(),
            find: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };
        categoryRepository = {
            create: jest.fn(),
            save: jest.fn(),
            findOneBy: jest.fn(),
            find: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };
        newsService = new NewsService_1.NewsService(newsRepository, categoryRepository);
    });
    it("should create a new news article", async () => {
        const mockCategory = { id: 1, name: "Technology", createdAt: new Date(), updatedAt: new Date() };
        const newsData = { title: "New Article", content: "Content of the article" };
        // Mocking the category repository to return a category
        categoryRepository.findOneBy.mockResolvedValue(mockCategory);
        const savedNews = { id: 1, ...newsData, category: mockCategory };
        newsRepository.create.mockReturnValue(savedNews);
        newsRepository.save.mockResolvedValue(savedNews);
        const result = await newsService.createNews(newsData, 1);
        expect(result).toEqual(savedNews);
        expect(newsRepository.create).toHaveBeenCalledWith({ ...newsData, category: mockCategory });
        expect(newsRepository.save).toHaveBeenCalledWith(savedNews);
    });
    it("should retrieve all news articles", async () => {
        const newsArray = [
            {
                id: 1,
                title: "News 1",
                content: "Content 1",
                publishedAt: new Date(),
                category: new Category_1.Category(),
            },
            {
                id: 2,
                title: "News 2",
                content: "Content 2",
                publishedAt: new Date(),
                category: new Category_1.Category(),
            },
        ];
        newsRepository.find.mockResolvedValue(newsArray);
        const result = await newsService.getAllNews();
        expect(result).toEqual(newsArray);
        expect(newsRepository.find).toHaveBeenCalled();
    });
    it("should retrieve a news article by ID", async () => {
        const news = {
            id: 1,
            title: "Specific News",
            content: "Specific content",
            publishedAt: new Date(),
            category: new Category_1.Category(),
        };
        newsRepository.findOneBy.mockResolvedValue(news);
        const result = await newsService.getNewsById(1);
        expect(result).toEqual(news);
        expect(newsRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
    it("should update a news article", async () => {
        const newsId = 1;
        const updateData = { title: "Updated Title" };
        // Mocking the updated news article, including all required properties
        const updatedNews = {
            id: newsId,
            title: "Updated Title",
            content: "Updated content", // Include all required fields
            publishedAt: new Date(), // Mock a date or set to null if applicable
            category: { id: 1, name: "Technology", createdAt: new Date(), updatedAt: new Date, news: [] }, // Assuming category is an object with id and name
        };
        const updateResult = { affected: 1 }; // Simulating that one record was affected
        // Mock the repository behavior
        newsRepository.update.mockResolvedValue(updateResult); // Mocking the update result
        newsRepository.findOneBy.mockResolvedValue(updatedNews); // Mocking the retrieval of the updated article
        const result = await newsService.updateNews(newsId, updateData);
        expect(result).toEqual(updatedNews); // Check that the result matches the updated news article
        expect(newsRepository.update).toHaveBeenCalledWith(newsId, updateData);
    });
    it("should delete a news article by ID", async () => {
        newsRepository.delete.mockResolvedValue({ affected: 1 });
        const result = await newsService.deleteNews(1);
        expect(result).toEqual({ affected: 1 });
        expect(newsRepository.delete).toHaveBeenCalledWith(1);
    });
    it("should throw an error when news is not found", async () => {
        const newsId = 1;
        // Mock the findOneBy method to return null
        newsRepository.findOneBy.mockResolvedValue(null);
        await expect(newsService.getNewsById(newsId)).rejects.toThrow("News not found"); // Check for error
        expect(newsRepository.findOneBy).toHaveBeenCalledWith({ id: newsId }); // Verify the find call
    });
    it("should throw an error when category does not exist during news creation", async () => {
        const newsData = { title: "Test News", content: "Content of the news" };
        const categoryId = 1;
        // Mock the findOneBy method to return null for the category
        categoryRepository.findOneBy.mockResolvedValue(null);
        await expect(newsService.createNews(newsData, categoryId)).rejects.toThrow("Category not found"); // Check for error
        expect(categoryRepository.findOneBy).toHaveBeenCalledWith({ id: categoryId }); // Verify the find call
    });
    it("should throw an error when updating news that does not exist", async () => {
        const newsId = 1;
        const updateData = { title: "Updated Title" };
        // Mock the update method to affect 0 rows (indicating not found)
        newsRepository.update.mockResolvedValue({ affected: 0 });
        await expect(newsService.updateNews(newsId, updateData)).rejects.toThrow("News not found"); // Check for error
        expect(newsRepository.update).toHaveBeenCalledWith(newsId, updateData); // Verify the update call
    });
    it("should throw an error when deleting news that does not exist", async () => {
        const newsId = 1;
        // Mock the delete method to affect 0 rows (indicating not found)
        newsRepository.delete.mockResolvedValue({ affected: 0 });
        await expect(newsService.deleteNews(newsId)).rejects.toThrow("News not found"); // Check for error
        expect(newsRepository.delete).toHaveBeenCalledWith(newsId); // Verify the delete call
    });
});
