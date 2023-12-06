import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EnvasesDataService, ToastService } from 'src/app/shared';

@Component({
  selector: 'app-cantidad-envase-modal',
  templateUrl: './cantidad-envase-modal.component.html',
  styleUrls: ['./cantidad-envase-modal.component.sass'],
})
export class CantidadEnvaseModalComponent implements OnInit {
  private toastService = inject(ToastService);
  private envasesDataService = inject(EnvasesDataService);

  public envases2: any = [];

  @Output() cantidadEnvase: EventEmitter<
    { envaseId: number; cantidad: number } | 0
  > = new EventEmitter();

  @Input() tipoEnvaseId: number | null = null;

  tipoEnvaseForm = new FormGroup({
    tipoControl: new FormControl('', [
      Validators.required,
      Validators.nullValidator,
    ]),
    cantidadControl: new FormControl('', [
      Validators.required,
      Validators.nullValidator,
      Validators.min(1),
      Validators.max(5000),
    ]),
  });

  ngOnInit(): void {
    // { value: string; description: string }
    this.envasesDataService.getEnvases().map((envase) => {
      if (envase.tipoEnvaseID === this.tipoEnvaseId) {
        let envaseTemp: { value: number; description: string } = {
          value: envase.id,
          description: this.capitalizarTexto(envase.descripcion),
        };

        this.envases2.push(envaseTemp);
      }
    });

    this.tipoEnvaseForm.controls['tipoControl'].setValue(
      this.envases2[0].value
    );
  }

  capitalizarTexto(texto: string): string {
    if (texto.length === 0) return texto;

    return texto.charAt(0).toUpperCase() + texto.slice(1);
  }

  returnProcess = (): void => this.cantidadEnvase.emit(0);

  forwardProcess = (): void => {
    let envase: string | null =
      this.tipoEnvaseForm.controls['tipoControl'].value;
    let cantidad: string | null =
      this.tipoEnvaseForm.controls['cantidadControl'].value;

    if (!cantidad) {
      this.toastService.setToastState(true, 'Cantidad inválida');
    } else {
      let obj: { envaseId: number; cantidad: number } = {
        envaseId: parseInt(envase!),
        cantidad: parseInt(cantidad),
      };

      this.cantidadEnvase.emit(obj);
    }
  };
}
