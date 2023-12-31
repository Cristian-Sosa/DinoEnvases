import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./index').then((m) => m.AuthModule),
    title: 'Dino Envases - inicio de sesión'
  },
  {
    path: 'carga',
    loadChildren: () => import('./index').then((m) => m.MainModule),
    title: 'Dino Envases - Vales'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
