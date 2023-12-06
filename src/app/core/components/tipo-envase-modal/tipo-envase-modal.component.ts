import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EnvasesDataService } from 'src/app/shared';
import { ToastService } from 'src/app/shared';

@Component({
  selector: 'app-tipo-envase-modal',
  templateUrl: './tipo-envase-modal.component.html',
  styleUrls: ['./tipo-envase-modal.component.sass'],
})
export class TipoEnvaseModalComponent implements OnInit {
  private toastService = inject(ToastService);
  private cargaEnvaseService = inject(EnvasesDataService);

  public tipoEnvases2: any[] = [];

  @Output() tipoEnvase: EventEmitter<number> = new EventEmitter();

  tipoEnvaseForm = new FormGroup({
    envaseControl: new FormControl(null, [
      Validators.required,
      Validators.nullValidator,
    ]),
  });

  ngOnInit(): void {
    this.cargaEnvaseService.getTiposEnvases().map((envase) => {
      let envaseTemp: any = {
        id: envase.id,
        title: this.capitalizarTexto(envase.nombre),
        name: envase.nombre,
      };

      this.tipoEnvases2.push(envaseTemp);
    });
  }

  capitalizarTexto(texto: string): string {
    if (texto.length === 0) return texto;

    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  returnProcess = (): void => this.tipoEnvase.emit(0);

  forwardProcess = (): void => {
    let envase: string | null | undefined =
      this.tipoEnvaseForm.get('envaseControl')?.value;

    if (!envase) {
      this.toastService.setToastState(true, 'Seleccioná un envase para seguir');
    } else {
      this.tipoEnvase.emit(envase);
    }
  };
}
