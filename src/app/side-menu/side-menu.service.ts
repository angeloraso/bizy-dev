import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SideMenuService {
  private _open = new BehaviorSubject<boolean>(false);
  // _option value has to be a valid path
  private _option = new BehaviorSubject<string>('');

  get open() {
    return this._open.asObservable();
  }

  setOpen(isOpen: any) {
    this._open.next(isOpen);
  }

  get option() {
    return this._option.asObservable();
  }

  setOption(option: any) {
    this._option.next(option);
  }
}
