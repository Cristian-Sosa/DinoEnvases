import { Component, OnInit, inject } from '@angular/core';
import { EnvasesDataService } from 'src/app/shared';

@Component({
  selector: 'app-lista-envases',
  templateUrl: './lista-envases.component.html',
  styleUrls: ['./lista-envases.component.sass'],
})
export class ListaEnvasesComponent implements OnInit {
  private envasesDataService = inject(EnvasesDataService);

  public envases: any[] = [];

  ngOnInit(): void {
    this.envasesDataService.getEnvasesObservable().subscribe({
      next: (cargaEnvases) => {
        this.envases = cargaEnvases;
      },
      error: () => {
        throw new Error('Error obteniendo carga');
      },
    });
  }
}
