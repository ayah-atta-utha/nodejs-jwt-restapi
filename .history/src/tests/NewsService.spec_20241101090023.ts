 
import { DataSource } from "typeorm";
import AppDataSource from "../data-source";
import { News } from "../entities/News";
import { NewsService } from "../services/NewsService";

let dataSource: DataSource;
let newsService: NewsService;

beforeAll(async () => {
  dataSource = await AppDataSource.initialize();
  newsService = new NewsService();
});

afterAll(async () => {
  await dataSource.destroy(); // Close the connection after tests
});

beforeEach(async () => {
  // Clear data before each test to ensure isolated tests
  await dataSource.getRepository(News).clear();
});

describe("NewsService", () => {
  it("should create a new news article", async () => {
    const newsData = { title: "Breaking News", content: "This is the content of the news." };
    const createdNews = await newsService.createNews(newsData);

    expect(createdNews).toHaveProperty("id");
    expect(createdNews.title).toEqual("Breaking News");
    expect(createdNews.content).toEqual("This is the content of the news.");
  });

  it("should retrieve all news articles", async () => {
    await newsService.createNews({ title: "News 1", content: "Content 1" });
    await newsService.createNews({ title: "News 2", content: "Content 2" });

    const allNews = await newsService.getAllNews();
    expect(allNews.length).toBe(2);
    expect(allNews[0].title).toEqual("News 1");
    expect(allNews[1].title).toEqual("News 2");
  });

  it("should retrieve a news article by ID", async () => {
    const news = await newsService.createNews({ title: "Specific News", content: "Content for specific news" });
    const foundNews = await newsService.getNewsById(news.id);

    expect(foundNews).not.toBeNull();
    expect(foundNews?.id).toEqual(news.id);
    expect(foundNews?.title).toEqual("Specific News");
  });

  it("should update a news article", async () => {
    const news = await newsService.createNews({ title: "Old Title", content: "Old Content" });
    const updatedNews = await newsService.updateNews(news.id, { title: "New Title", content: "New Content" });

    const foundNews = await newsService.getNewsById(news.id);
    expect(updatedNews.affected).toBe(1);
    expect(foundNews?.title).toEqual("New Title");
    expect(foundNews?.content).toEqual("New Content");
  });

  it("should delete a news article by ID", async () => {
    const news = await newsService.createNews({ title: "News to delete", content: "Content to delete" });
    const result = await newsService.deleteNews(news.id);

    const foundNews = await newsService.getNewsById(news.id);
    expect(result.affected).toBe(1);
    expect(foundNews).toBeNull();
  });

  it("should return null for non-existent news ID", async () => {
    const result = await newsService.getNewsById(99999);
    expect(result).toBeNull();
  });
});
