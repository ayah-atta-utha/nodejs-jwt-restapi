 
import { Repository } from "typeorm";
import { News } from "../entities/News";
import { NewsService } from "../services/NewsService";
import { Category } from "../entities/Category";

// Mock the repository
jest.mock("typeorm", () => {
  const actualTypeorm = jest.requireActual("typeorm");
  return {
    ...actualTypeorm,
    DataSource: jest.fn().mockReturnValue({
      getRepository: jest.fn().mockReturnValue({
        find: jest.fn(),
        findOneBy: jest.fn(),
        save: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      }),
    }),
  };
});

describe("NewsService", () => {
  let newsService: NewsService;
  let newsRepository: jest.Mocked<Repository<News>>;

  beforeEach(() => {
    // Setting up the mocked repository
    newsRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOneBy: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<Repository<News>>;

    newsService = new NewsService(newsRepository);
  });

  it("should create a new news article", async () => {
    const newsData = { title: "Breaking News", content: "News content" };
    const savedNews = { ...newsData, id: 1, publishedAt: new Date(),category: new Category() };

    // Mock the create and save methods
    newsRepository.create.mockReturnValue(savedNews as News);
    newsRepository.save.mockResolvedValue(savedNews);

    const result = await newsService.createNews(newsData);
    expect(result).toEqual(savedNews);
    expect(newsRepository.create).toHaveBeenCalledWith(newsData);
    expect(newsRepository.save).toHaveBeenCalledWith(savedNews); 
  });

  it("should retrieve all news articles", async () => {
    const newsArray = [
      { id: 1, title: "News 1", content: "Content 1", publishedAt:new Date(),category:new Category() },
      { id: 2, title: "News 2", content: "Content 2" ,  publishedAt:new Date(),category: new Category()},
    ];

    newsRepository.find.mockResolvedValue(newsArray);

    const result = await newsService.getAllNews();
    expect(result).toEqual(newsArray);
    expect(newsRepository.find).toHaveBeenCalled();
  });

  it("should retrieve a news article by ID", async () => {
    const news = { id: 1, title: "Specific News", content: "Specific content" , publishedAt:new Date(),category: new Category()};

    newsRepository.findOneBy.mockResolvedValue(news);

    const result = await newsService.getNewsById(1);
    expect(result).toEqual(news);
    expect(newsRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it("should update a news article", async () => {
    newsRepository.update.mockResolvedValue({ affected: 1 } as any);

    const result = await newsService.updateNews(1, { title: "Updated Title" });
    expect(result).toEqual({ affected: 1 });
    expect(newsRepository.update).toHaveBeenCalledWith(1, { title: "Updated Title" });
  });

  it("should delete a news article by ID", async () => {
    newsRepository.delete.mockResolvedValue({ affected: 1 } as any);

    const result = await newsService.deleteNews(1);
    expect(result).toEqual({ affected: 1 });
    expect(newsRepository.delete).toHaveBeenCalledWith(1);
  });
});
