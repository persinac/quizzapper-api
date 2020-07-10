import { Request, Response, Router, NextFunction } from "express";
import { getRepository } from "typeorm";
import HttpException from "../exceptions/HttpException";
import { Category } from "../entities/Category";
import CategoryNotFoundException from "../exceptions/category/CategoryNotFoundException";
import CannotCreateCategoryException from "../exceptions/category/CannotCreateCategoryException";

class CategoryController {
    public path = "/category";
    public router = Router();
    private categoryRepository = getRepository(Category);

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.get(this.path, this.getAllCategories);
        this.router.get(`${this.path}/:id`, this.getCategoryById);
        this.router.post(this.path, this.createCategory);
    }

    private getAllCategories = (request: Request, response: Response) => {
        this.categoryRepository.find()
            .then((categories: Category[]) => {
                response.send(categories);
            });
    };

    private getCategoryById = (request: Request, response: Response, next: NextFunction) => {
        const id = request.params.id;
        this.categoryRepository.findOne(id)
            .then((result: Category) => {
                console.log(result);
                result ? response.send(result) : next(new CategoryNotFoundException(id));
            })
            .catch((err) => {
                next(new HttpException(404, err));
            });
    };

    private createCategory = (request: Request, response: Response, next: NextFunction) => {
        const category: Category = request.body;
        const newCategory = this.categoryRepository.create(category);
        this.categoryRepository.save(newCategory)
            .then((result: Category) => {
                response.send(result);
            })
            .catch((err) => {
                next(new CannotCreateCategoryException(err));
            });
    };
}

export default CategoryController;