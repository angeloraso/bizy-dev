import { Component, Inject } from '@angular/core';
import { ICategory } from '@cash-flow/model';
import { RouterService, ToastService } from '@core/services';
import { CACHE_KEYS } from '@core/services/cache.service';
import { BottomBarService } from '@home/bottomBar.service';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'categories',
  templateUrl: 'categories.html',
  styleUrls: ['categories.scss'],
  providers: [RouterService]
})
export class CategoriesComponent {
  categories: Array<ICategory> = [];
  search: string;
  deleteMode: boolean;

  constructor(
    @Inject(BottomBarService) private bottomBarService: BottomBarService,
    @Inject(AppService) private appService: AppService,
    @Inject(RouterService) private router: RouterService,
    @Inject(ToastService) private toastService: ToastService
  ) {}

  ionViewWillEnter() {
    this.bottomBarService.hide();
    this.deleteMode = false;

    this.appService.getCategories().then(categories => {
      this.categories = categories;
    });
  }

  selectCategory(category: ICategory) {
    if (this.router.getURL().indexOf('cash-flow/categories') === -1) {
      this.router.goBack({ [CACHE_KEYS.CATEGORIES]: [category] } as {[key in CACHE_KEYS]: any});
      return;
    }

    this.editCategory(category);
  }

  goBack() {
    this.router.goBack();
  }

  createCategory() {
    this.router.goTo('new');
  }

  editCategory(category: ICategory) {
    this.router.goTo(category.id, { [CACHE_KEYS.CATEGORIES]: [category] } as {[key in CACHE_KEYS]: any});
  }

  cancelDelete() {
    this.categories.forEach(_category => {
      (<any>_category).checked = false;
    });
    this.deleteMode = false;
  }

  delete() {
    const ids: Array<string> = [];
    this.categories.forEach(_category => {
      if ((<any>_category).checked) {
        ids.push(_category.id);
      }
    });
    this.appService.deleteCategories(ids).then(() => {
      ids.forEach(_id => {
        const index = this.categories.findIndex(_category => {
          return _category.id === _id;
        });
        this.categories.splice(index, 1);
      });
      // Force change detection
      this.categories = [...this.categories];
      this.toastService.success('Categories was deleted!');
      this.deleteMode = false;
    });
  }
}
