import { Inject, Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Plugins } from '@capacitor/core';
import { Platform } from '@ionic/angular';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
const { Storage } = Plugins;

const helper = new JwtHelperService();
const TOKEN_KEY = 'JWT-TOKEN';
@Injectable()
export class AuthService {
  private userData: BehaviorSubject<boolean> = new BehaviorSubject(false as boolean);
  token: string | null = '';

  public user$: Observable<any>;

  constructor(
    @Inject(Platform) private platform: Platform
  ) {
    this.loadToken();
  }

  async loadToken() {
    const platformObs = from(this.platform.ready());
    this.user$ = platformObs.pipe(
      switchMap(async () => {
        const token = await Storage.get({ key: TOKEN_KEY });
        this.token = token.value;
        return token;
      }),
      map((token: {value: string | null}) => {
        if (token && token.value) {
          const decoded = helper.decodeToken(token.value);
          this.userData.next(decoded);
          return true;
        }

        return null;
      })
    );
  }

  login(email: string, password: string): Observable<any> {
    console.log(`Email: ${email} - Password: ${password}`);
    return of('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1Njc2NjU3MDYsImV4cCI6MTU5OTIwMTcwNiwiYXVkIjoid3d3LmJpenkuY29tIiwic3ViIjoiMTIzNDUiLCJmaXJzdF9uYW1lIjoiQml6eSIsImxhc3RfbmFtZSI6IkFkbWluIiwiZW1haWwiOiJhZG1pbkBlbWFpbC5jb20ifQ.XevXVjXLqM1_qWlEU0ieINqCsn6L1KMvA5uMONUn8QQ').pipe(
      switchMap((token: string) => {
        const decoded = helper.decodeToken(token);
        this.userData.next(decoded);
        return from(Storage.set({ key: TOKEN_KEY, value: token }));
      })
    );
  }

  register(email: string, password: string): Observable<any> {
    console.log(`Email: ${email} - Password: ${password}`);
    return of('eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1Njc2NjU3MDYsImV4cCI6MTU5OTIwMTcwNiwiYXVkIjoid3d3LmJpenkuY29tIiwic3ViIjoiMTIzNDUiLCJmaXJzdF9uYW1lIjoiQml6eSIsImxhc3RfbmFtZSI6IkFkbWluIiwiZW1haWwiOiJhZG1pbkBlbWFpbC5jb20ifQ.XevXVjXLqM1_qWlEU0ieINqCsn6L1KMvA5uMONUn8QQ').pipe(
      switchMap((token: string) => {
        const decoded = helper.decodeToken(token);
        this.userData.next(decoded);
        return from(Storage.set({ key: TOKEN_KEY, value: token }));
      })
    );
  }

  getUser() {
    return this.userData.getValue();
  }

  logout() {
    return new Promise<void>(resolve => {
      Storage.remove({ key: TOKEN_KEY }).then(() => {
        this.userData.next(false);
        resolve();
      });
    });
  }
}
