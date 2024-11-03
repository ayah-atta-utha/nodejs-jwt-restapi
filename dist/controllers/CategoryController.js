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
exports.CategoryController = void 0;
const routing_controllers_1 = require("routing-controllers");
const CategoryService_1 = require("../services/CategoryService");
const Category_1 = require("../entities/Category");
const data_source_1 = __importDefault(require("../data-source"));
let CategoryController = class CategoryController {
    constructor() {
        const categoryRepository = data_source_1.default.getRepository(Category_1.Category);
        this.categoryService = new CategoryService_1.CategoryService(categoryRepository);
    }
    // Get all categories (accessible to both general and admin roles)
    async getAll() {
        return await this.categoryService.getAllCategories();
    }
    // Create a new category (admin role only)
    async create(categoryData) {
        return await this.categoryService.createCategory(categoryData);
    }
    // Update an existing category (admin role only)
    async update(id, categoryData) {
        return await this.categoryService.updateCategory(id, categoryData);
    }
    // Delete a category (admin role only)
    async delete(id) {
        return await this.categoryService.deleteCategory(id);
    }
};
exports.CategoryController = CategoryController;
__decorate([
    (0, routing_controllers_1.Get)("/"),
    (0, routing_controllers_1.Authorized)(["admin"]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "getAll", null);
__decorate([
    (0, routing_controllers_1.Authorized)(["admin"]),
    (0, routing_controllers_1.Post)("/"),
    __param(0, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "create", null);
__decorate([
    (0, routing_controllers_1.Authorized)(["admin"]),
    (0, routing_controllers_1.Put)("/:id"),
    __param(0, (0, routing_controllers_1.Param)("id")),
    __param(1, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "update", null);
__decorate([
    (0, routing_controllers_1.Authorized)(["admin"]),
    (0, routing_controllers_1.Delete)("/:id"),
    __param(0, (0, routing_controllers_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "delete", null);
exports.CategoryController = CategoryController = __decorate([
    (0, routing_controllers_1.JsonController)("/categories"),
    __metadata("design:paramtypes", [])
], CategoryController);
