import { Injectable } from '@angular/core';
import { IUsuario, IUsuarioResponse } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userData: IUsuario | null = null;

  private usuarios: IUsuario[] = [
    { usuario: 'AV', password: '1234' },
    { usuario: 'R20', password: '1234' },
    { usuario: 'SV', password: '1234' },
    { usuario: 'CVL', password: '1234' },
    { usuario: 'SAL', password: '1234' },
    { usuario: '60C', password: '1234' },
    { usuario: 'AG', password: '1234' },
    { usuario: 'TLH', password: '1234' },
    { usuario: 'TSM', password: '1234' },
    { usuario: 'COC', password: '1234' },
    { usuario: 'csosa', password: '1234' },
    { usuario: 'momolina', password: '1234' },
    { usuario: 'mcastillo', password: '1234' },
    { usuario: 'lmartini', password: '1234' },
    { usuario: 'rbuttiero', password: '1234' },
    { usuario: 'murriche', password: '1234' },
    { usuario: 'jrojas', password: '1234' },
    { usuario: 'potro', password: '1234' },
    { usuario: 'ehuanco', password: 'huanco28' },
    { usuario: 'ebarrera', password: '1234' },
    { usuario: 'mchavez', password: '1234' },
    { usuario: 'pmarino', password: '1234' },
    { usuario: 'gtevez', password: '1234' },
  ];

  userValidation = (usuario: IUsuario): IUsuarioResponse => {
    const userToSearch: any = this.usuarios.find(
      (u) =>
        u.usuario.toUpperCase() === usuario.usuario.toUpperCase() &&
        u.password.toUpperCase() === usuario.password.toUpperCase()
    );
    if (userToSearch) {
      this.userData = usuario;
      localStorage.setItem('usuario', JSON.stringify(usuario));
      return { status: 200, data: this.userData };
    } else {
      return { status: 401, data: null };
    }
  };

  clearUser = (): void => localStorage.removeItem('usuario');

  getDataUser = (): IUsuario | null => {
    if (this.userData) {
      return this.userData;
    } else if (localStorage.getItem('usuario')) {
      this.userData = JSON.parse(localStorage.getItem('usuario')!);
      return this.userData;
    } else {
      return null;
    }
  };
}
