import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { IUsuario } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usuario: IUsuario | undefined = undefined;
  private _usuario: BehaviorSubject<IUsuario | undefined> = new BehaviorSubject(
    this.usuario
  );

  private http = inject(HttpClient);

  // Obtener usuario desde API
  getUser = (usuario: IUsuario): Observable<any> => {
    return this.http.get<any>('urlAPI');
  };

  // Validar formulario auth 
  userValidation = (usuario: IUsuario): boolean => {
    let tempUser: IUsuario | undefined = {
      Usuario: usuario.Usuario,
      Password: usuario.Password,
      Sucursal: usuario.Sucursal,
    };

    // this.getUser(usuario).subscribe((res) => (tempUser = res));

    if (tempUser) {
      this.usuario = tempUser;
      this._usuario.next(this.usuario);
      return true;
    } else {
      return false;
    }
  };
}