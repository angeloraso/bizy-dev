import { Inject, Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

type ToastPosition = 'bottom' | 'middle' | 'top';
type ToastType = 'success' | 'info' | 'default' | 'warning' | 'danger';

@Injectable()
export class ToastService {
  constructor(
    @Inject(ToastController) public toastController: ToastController
  ) {}

  private async show(toast: {text: string, type?: ToastType, header?: string, duration?: number, position?: ToastPosition}) {
    const toastClass = toast.type ? 'toast--' + toast.type : 'toast--success';
    const milliseconds = toast.duration ?? 2000;
    const toastPosition = toast.position ?? 'bottom';
    const TOAST = await this.toastController.create({
      header: toast.header,
      message: toast.text,
      duration: milliseconds,
      cssClass: toastClass,
      position: toastPosition
    });
    TOAST.present();
  }

  success(msg: string) {
    this.show({ text: msg, type: 'success' });
  }

  info(msg: string) {
    this.show({ text: msg, type: 'info' });
  }

  default(msg: string) {
    this.show({ text: msg, type: 'default' });
  }

  warning(msg: string) {
    this.show({ text: msg, type: 'warning' });
  }

  error(msg: string) {
    this.show({ text: msg, type: 'danger' });
  }
}
