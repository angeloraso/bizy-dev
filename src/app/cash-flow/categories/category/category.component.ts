import { Component, Inject } from '@angular/core';
import { ICategory } from '@cash-flow/model';
import { ToastService } from '@core/services';
import { CacheService, CACHE_KEYS } from '@core/services/cache.service';
import { RouterService } from '@core/services/router.service';
import { BottomBarService } from '@home/bottomBar.service';
import { AlertController } from '@ionic/angular';
import { AppService } from 'src/app/app.service';
@Component({
  selector: 'category',
  templateUrl: 'category.html',
  styleUrls: ['category.scss'],
  providers: [RouterService]
})
export class CategoryComponent {
  editMode: boolean;
  fakeCardName: string;
  title: string;
  category: Omit<ICategory, 'id'> = {
    name: '',
    color: '',
    icon: ''
  };;

  constructor(
    @Inject(BottomBarService) private bottomBarService: BottomBarService,
    @Inject(AppService) private appService: AppService,
    @Inject(RouterService) private router: RouterService,
    @Inject(CacheService) private cache: CacheService,
    @Inject(ToastService) private toastService: ToastService,
    @Inject(AlertController) private alertController: AlertController
  ) {}

  ionViewWillEnter() {
    this.bottomBarService.hide();
    this.initCategoryForm();
    this.editMode = false;
    this.title = 'Create category';
    const categoryId = this.router.getId('categoryId');
    if (categoryId) {
      this.title = 'Edit category';
      this.editMode = true;
    }

    const categories = this.cache.getData(CACHE_KEYS.CATEGORIES);
    if (categories.length > 0) {
      this.category = categories[0];
      this.fakeCardName = this.category.name;
    } else if (categoryId) {
      this.appService.getCategories([categoryId]).then(_categories => {
        this.category = _categories[0];
        this.fakeCardName = this.category.name;
      });
    }
  }

  initCategoryForm() {
    this.fakeCardName = 'Nombre de la categoría';
    this.category = {
      name: '',
      color: '#0b7bb5',
      icon: 'help-outline'
    };
  }

  async showDeleteAlert() {
    if (!this.editMode) {
      return;
    }

    const alert = await this.alertController.create({
      header: 'Delete category',
      message: 'The category will be deleted. Do you agree?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        }, {
          text: 'Delete',
          handler: () => {
            this.deleteCategory();
          }
        }
      ]
    });

    await alert.present();
  }

  deleteCategory() {
    this.appService.deleteCategories([(this.category as ICategory).id]).then(() => {
      this.toastService.success('The record was deleted from the library!');
      this.goBack();
    });
  }

  goBack() {
    this.clearCache();
    this.router.goBack();
  }

  save() {
    if (!this.category.name || !this.category.icon || !this.category.color) {
      this.toastService.warning('All fields are required');
      return;
    }

    if (this.editMode) {
      this.appService.editCategory(this.category as ICategory).then(() => {
        this.toastService.success('Category was edited');
        this.goBack();
      });
    } else {
      this.appService.createCategory(this.category).then(() => {
        this.toastService.success('Category was created');
        this.goBack();
      });
    }
  }

  clearCache() {
    this.cache.clear(CACHE_KEYS.CATEGORIES);
  }
}
