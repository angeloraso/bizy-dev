import { Injectable } from '@angular/core';
@Injectable()
export class LogService {
  debug(log: any) {
    console.log(log);
  }

  info(log: string) {
    console.log('%c' + log, 'font-size: 0.8rem; color: #2484C6;');
  }

  success(log: string) {
    console.log('%c' + log, 'font-size: 0.8rem; color: #65BF6C;');
  }

  warning(log: string) {
    console.log('%c' + log, 'font-size: 0.8rem; color: #F7A64C;');
  }

  error(log: string) {
    console.log('%c' + log, 'font-size: 0.8rem; color: #EF4C59;');
  }
}
