import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { take } from 'rxjs';
import { AuthService, ToastService } from 'src/app/shared';
import { IUserToVerify } from 'src/app/shared/models';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.sass'],
})
export class AuthPage implements OnInit {
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  authForm = new FormGroup({
    userControl: new FormControl('', [
      Validators.required,
      Validators.nullValidator,
    ]),
    passControl: new FormControl('', [
      Validators.required,
      Validators.nullValidator,
    ]),
  });

  ngOnInit(): void {
    this.authService.clearUser();
  }

  submitForm = () => {
    let usuario: IUserToVerify = {
      Usuario: this.authForm.get('userControl')?.value!,
      Password: this.authForm.get('passControl')?.value!,
    };

    let isUserRegistered!: boolean;

    this.authService
      .validateUser(usuario)
      .pipe(take(1))
      .subscribe({
        next: (res) => {
          if (res.status === 200) {
            isUserRegistered = true;
            console.log(res.data);
            this.authService.setUsuario(res.data);
          } else {
            isUserRegistered = false;
          }
        },
        error: (err) => {
          if (err.error.mensaje === 'Usuario no encontrado') {
            isUserRegistered = false;
          } else if (err.error.mensaje.includes('son obligatorios')) {
            this.toastService.setToastState('Campos vacíos o inválidos');
          } else {
            isUserRegistered = this.authService.userValidation(usuario);
          }
        },
      })
      .add(() => {
        if (isUserRegistered) {
        } else {
          this.router.navigate(['carga']);
          this.toastService.setToastState('El usuario no existe');
        }
      });
  };
}
