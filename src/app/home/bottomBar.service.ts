import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class BottomBarService {
  public _bottomBar: BehaviorSubject<boolean> = new BehaviorSubject(true as boolean);

  get bottomBar() {
    return this._bottomBar.asObservable();
  }

  hide() {
    this._bottomBar.next(false);
  }

  show() {
    this._bottomBar.next(true);
  }
}
