import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IToast } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toast: IToast;
  private _toast: BehaviorSubject<IToast>;

  constructor() {
    this.toast = {
      text: '',
      show: false,
    };
    this._toast = new BehaviorSubject(this.toast);
  }

  getToastObservable = (): Observable<IToast> => this._toast.asObservable();

  setToastState = (newState: boolean, title = 'Cargando mensaje...'): void => {
    this.toast.text = title;
    this.toast.show = newState;
    this._toast.next(this.toast);

    setTimeout(() => {
      this.toast.show = false;
      this._toast.next(this.toast);
    }, 3500);
  };
}
