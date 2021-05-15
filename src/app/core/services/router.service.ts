import { Inject, Injectable } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { CacheService, CACHE_KEYS } from './cache.service';
@Injectable()
export class RouterService {
  constructor(
    @Inject(CacheService) private cache: CacheService,
    @Inject(Router) private router: Router,
    @Inject(ActivatedRoute) private activatedRoute: ActivatedRoute
  ) {}

  getURL() {
    return this.router.url;
  }

  getId = (param: string) => {
    return this.activatedRoute.snapshot.paramMap.get(param);
  }

  goTo = (path: string, data?: Record<CACHE_KEYS, Array<any>>) => {
    if (data) {
      Object.keys(data).forEach((_cacheKey: string) => {
        this.cache.setData((<CACHE_KEYS>_cacheKey), data[(<CACHE_KEYS>_cacheKey)]);
      });
    }

    if (path[0] === '/') {
      this.router.navigateByUrl(path, { replaceUrl: true });
      return;
    }

    if (path.indexOf('..') !== -1) {
      let i = 0;
      while (path.indexOf('..') !== -1) {
        path = path.replace('../', '');
        i++;
      }

      history.go(-i);
    }

    const navigationExtras: NavigationExtras = {
      relativeTo: this.activatedRoute
    };

    this.router.navigate([path], navigationExtras);
  }

  goBack(data?: {[key in CACHE_KEYS]: Array<any>}) {
    if (data) {
      // @ts-ignore
      Object.keys(data).forEach((_cacheKey: CACHE_KEYS) => {
        this.cache.setData(_cacheKey, data[_cacheKey]);
      });
    }

    if (history.state.navigationId > 1) {
      history.back();
      return;
    }

    const index = this.router.url.lastIndexOf('/');
    const backURL = this.router.url.substring(0, index);
    this.router.navigateByUrl(backURL, { replaceUrl: true });
  }
}
