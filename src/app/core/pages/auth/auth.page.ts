import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, ToastService } from 'src/app/shared';
import { ISelect, IUsuario } from 'src/app/shared/models';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.sass'],
})
export class AuthPage implements OnInit {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  public selectContent: ISelect = {
    name: 'sucursalName',
    options: [
      { value: 'AV', description: 'Alto Verde' },
      { value: 'R20', description: 'Ruta 20' },
      { value: 'SV', description: 'San Vicente' },
      { value: 'SAL', description: 'Salsipuedes' },
      { value: 'CVL', description: 'Circunvalación' },
      { value: '60C', description: '60 Cuadras' },
      { value: 'AG', description: 'Alta Gracia' },
      { value: 'TLH', description: 'Las Heras' },
      { value: 'TSM', description: 'San Martin' },
    ],
  };

  authForm = new FormGroup({
    userControl: new FormControl('', [
      Validators.required,
      Validators.nullValidator,
    ]),
    passControl: new FormControl('', [
      Validators.required,
      Validators.nullValidator,
    ]),
    sucursalControl: new FormControl(this.selectContent.options[0].value, [
      Validators.required,
      Validators.nullValidator,
    ]),
  });

  ngOnInit(): void {
    this.authService.clearUser();
  }

  submitForm = () => {
    let usuario: IUsuario = {
      usuario: this.authForm.get('userControl')?.value!,
      password: this.authForm.get('passControl')?.value!,
      sucursal: this.authForm.get('sucursalControl')?.value!,
    };

    let isUserRegistered: boolean =
      this.authService.userValidation(usuario).status === 200 ? true : false;

    if (isUserRegistered) {
      this.router.navigate(['carga']);
    } else {
      this.toastService.setToastState(true, 'El usuario no existe');
    }
  };
}
