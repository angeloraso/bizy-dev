import { Inject, Injectable } from '@angular/core';
import { ICategory } from '@cash-flow/model';
import { COLORS } from '@core/constants';
import { StorageService } from '@core/services';
import { STORAGE_KEYS } from '@core/services/storage.service';
import { v4 as uuidv4 } from 'uuid';
@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private readonly DEFAULT_CATEGORIES: Array<Omit<ICategory, 'id'>> = [
    { icon: 'person-outline', name: 'Student fee', color: '' },
    { icon: 'build-outline', name: 'Maintenance', color: '' },
    { icon: 'shield-checkmark-outline', name: 'Equipment', color: '' },
    { icon: 'home-outline', name: 'Rental', color: '' },
    { icon: 'fast-food-outline', name: 'Food', color: '' },
    { icon: 'shirt-outline', name: 'Clothes', color: '' },
    { icon: 'heart-outline', name: 'Hygiene', color: '' },
    { icon: 'bandage-outline', name: 'Medicines', color: '' },
    { icon: 'headset-outline', name: 'Electronic', color: '' },
    { icon: 'bus-outline', name: 'Transport', color: '' },
    { icon: 'hand-right-outline', name: 'Responsabilities', color: '' },
    { icon: 'school-outline', name: 'Training', color: '' },
    { icon: 'ticket-outline', name: 'Events', color: '' },
    { icon: 'megaphone-outline', name: 'Advertising', color: '' },
    { icon: 'cash-outline', name: 'Sales', color: '' },
    { icon: 'bar-chart-outline', name: 'Investment', color: '' },
    { icon: 'bulb-outline', name: 'Services', color: '' },
    { icon: 'help-outline', name: 'Others', color: '' }
  ];

  constructor(
    @Inject(StorageService) private storage: StorageService
  ) {
    this.setDefaultCategories();
  }

  async setDefaultCategories() {
    let categories = await this.storage.get(STORAGE_KEYS.CATEGORIES);
    if (categories) {
      return;
    }

    categories = [];

    for (let i = 0; i < COLORS.length; i++) {
      this.DEFAULT_CATEGORIES[i].color = COLORS[i];
      categories.push({ ...this.DEFAULT_CATEGORIES[i], id: uuidv4() });
      if (!this.DEFAULT_CATEGORIES[i + 1]) {
        break;
      }
    }

    this.storage.set(STORAGE_KEYS.CATEGORIES, categories);
  }

  getCategories(ids?: Array<string>) {
    return new Promise<Array<ICategory>>(async resolve => {
      const categories: Array<ICategory> = await this.storage.get(STORAGE_KEYS.CATEGORIES);
      if (!categories) {
        resolve([]);
      } else {
        if (ids) {
          resolve(categories.filter(_category => ids.includes(_category.id)));
        }

        resolve(categories);
      }
    });
  }

  postCategory(category: Omit<ICategory, 'id'>) {
    return new Promise<ICategory>(async resolve => {
      let categories = await this.storage.get(STORAGE_KEYS.CATEGORIES);
      const newCategory = {
        id: uuidv4(),
        icon: category.icon,
        name: category.name,
        color: category.color
      };
      if (!categories) {
        categories = [newCategory];
      } else {
        categories.push(newCategory);
      }

      await this.storage.set(STORAGE_KEYS.CATEGORIES, categories);
      resolve(newCategory);
    });
  }

  putCategory = (category: ICategory) => {
    return new Promise<void>(async resolve => {
      const categories: Array<ICategory> = await this.storage.get(STORAGE_KEYS.CATEGORIES);
      const index = categories.findIndex(_category => {
        return _category.id === category.id;
      });
      if (index !== -1) {
        const newCategory = {
          id: category.id,
          icon: category.icon,
          name: category.name,
          color: category.color
        };
        categories[index] = newCategory;
      }

      await this.storage.set(STORAGE_KEYS.CATEGORIES, categories);
      resolve();
    });
  }

  deleteCategories = (categorieIds: Array<string>) => {
    return new Promise<void>(async resolve => {
      const categories: Array<ICategory> = await this.storage.get(STORAGE_KEYS.CATEGORIES) ?? [];
      categorieIds.forEach(_id => {
        const index = categories.findIndex(_catgeory => {
          return _catgeory.id === _id;
        });
        if (index !== -1) {
          categories.splice(index, 1);
        }
      });
      await this.storage.set(STORAGE_KEYS.CATEGORIES, categories);
      resolve();
    });
  }
}
