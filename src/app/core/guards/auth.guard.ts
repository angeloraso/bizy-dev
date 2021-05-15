import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanLoad, CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private alertCtrl: AlertController
  ) { }

  canLoad() {
    return this.authService.user$.pipe(
      take(1),
      map(user => {
        if (!user) {
          this.router.navigateByUrl('/auth', { replaceUrl: true });
          return false;
        }

        return true;
      })
    );
  }

  canActivate(_next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.user$.pipe(
      take(1),
      map(user => {
        if (!user) {
          this.alertCtrl.create({
            header: 'Not authorized',
            message: 'You are not allowed to access this page',
            buttons: ['OK']
          }).then(alert => alert.present());
          this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
          return false;
        }

        return true;
      })
    );
  }
}
