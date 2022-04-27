import { Injectable, TemplateRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  toasts: any[] = [];

  show(textOrTpl: string | TemplateRef<any>, headerText: string, error: boolean) {
    var options = {
      classname: error ? 'bg-danger text-light' : 'bg-success text-light',
      delay: 5000,
      autohide: true,
      headertext: headerText
    };

    this.toasts.push({ textOrTpl, ...options });
  }

  remove(toast: any) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }
}
