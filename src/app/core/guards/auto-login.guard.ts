import { Injectable } from '@angular/core';
import { CanLoad, Router } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AutoLoginGuard implements CanLoad {
  constructor(private authService: AuthService, private router: Router) { }

  canLoad(): Observable<boolean> {
    return this.authService.user$.pipe(
      take(1), // Otherwise the Observable doesn't complete!
      map(user => {
        if (user) {
          this.router.navigateByUrl('/-', { replaceUrl: true });
          return false;
        }

        // Simply allow access to the login
        return true;
      })
    );
  }
}
