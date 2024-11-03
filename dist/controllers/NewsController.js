"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsController = void 0;
const routing_controllers_1 = require("routing-controllers");
const NewsService_1 = require("../services/NewsService");
const News_1 = require("../entities/News");
const data_source_1 = __importDefault(require("../data-source"));
const AdminMiddleware_1 = require("../middleware/AdminMiddleware");
const CategoryService_1 = require("../services/CategoryService");
const Category_1 = require("../entities/Category");
let NewsController = class NewsController {
    async getAll() {
        return await this.newsService.getAllNews();
    }
    async getOne(id) {
        return await this.newsService.getNewsById(id);
    }
    constructor() {
        const newsRepository = data_source_1.default.getRepository(News_1.News);
        const categoryRepository = data_source_1.default.getRepository(Category_1.Category);
        this.categoryService = new CategoryService_1.CategoryService(categoryRepository);
        this.newsService = new NewsService_1.NewsService(newsRepository, categoryRepository);
    }
    async createNews(data, categoryId) {
        const category = await this.categoryService.getCategory(categoryId);
        if (!category)
            throw new Error("Category not found");
        return await this.newsService.createNews({ ...data }, categoryId);
    }
    async update(id, newsData) {
        return await this.newsService.updateNews(id, newsData);
    }
    async delete(id) {
        return await this.newsService.deleteNews(id);
    }
};
exports.NewsController = NewsController;
__decorate([
    (0, routing_controllers_1.Get)("/"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], NewsController.prototype, "getAll", null);
__decorate([
    (0, routing_controllers_1.Get)("/:id"),
    __param(0, (0, routing_controllers_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NewsController.prototype, "getOne", null);
__decorate([
    (0, routing_controllers_1.Post)("/"),
    (0, routing_controllers_1.HttpCode)(201),
    (0, routing_controllers_1.UseBefore)(AdminMiddleware_1.adminMiddleware),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], NewsController.prototype, "createNews", null);
__decorate([
    (0, routing_controllers_1.Put)("/:id"),
    (0, routing_controllers_1.UseBefore)(AdminMiddleware_1.adminMiddleware),
    __param(0, (0, routing_controllers_1.Param)("id")),
    __param(1, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], NewsController.prototype, "update", null);
__decorate([
    (0, routing_controllers_1.Delete)("/:id"),
    (0, routing_controllers_1.HttpCode)(204),
    (0, routing_controllers_1.UseBefore)(AdminMiddleware_1.adminMiddleware),
    __param(0, (0, routing_controllers_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], NewsController.prototype, "delete", null);
exports.NewsController = NewsController = __decorate([
    (0, routing_controllers_1.JsonController)("/news"),
    __metadata("design:paramtypes", [])
], NewsController);
