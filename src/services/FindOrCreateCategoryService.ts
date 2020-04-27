import { getRepository } from 'typeorm';
import Category from '../models/Category';

class FindOrCreateCategoryService {
  public async execute(nameCategory: string): Promise<Category> {
    const categoryRepository = getRepository(Category);

    const existCategory = await categoryRepository.findOne({
      where: {
        title: nameCategory,
      },
    });

    if (!existCategory) {
      const category = categoryRepository.create({
        title: nameCategory,
      });

      const newCategory = await categoryRepository.save(category, {
        reload: true,
      });

      return newCategory;
    }

    return existCategory;
  }
}

export default FindOrCreateCategoryService;
