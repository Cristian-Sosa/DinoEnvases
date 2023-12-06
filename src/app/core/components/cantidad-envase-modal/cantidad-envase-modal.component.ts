import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
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

  esNumeroNegativo(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const value = control.value;

    if (value !== null && value !== undefined && value < 0) {
      return { esNumeroNegativo: true };
    }

    return null;
  }

  esNumeroMayor(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value;

    if (value !== null && value !== undefined && value > 10000) {
      return { esNumeroMayor: true };
    }

    return null;
  }

  // Función de validación personalizada para verificar si es un número flotante
  esNumeroFlotante(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const value = control.value;

    if (value !== null && value !== undefined && value % 1 !== 0) {
      return { esNumeroFlotante: true };
    }

    return null;
  }

  tipoEnvaseForm = new FormGroup({
    tipoControl: new FormControl('', [
      Validators.required,
      Validators.nullValidator,
    ]),
    cantidadControl: new FormControl('', [
      Validators.required,
      Validators.nullValidator,
      Validators.min(1),
      Validators.max(1000),
      this.esNumeroNegativo,
      this.esNumeroFlotante,
      this.esNumeroMayor,
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
    let envase: FormControl = this.tipoEnvaseForm.controls['tipoControl'];
    let cantidad: FormControl = this.tipoEnvaseForm.controls['cantidadControl'];

    if (
      envase.invalid ||
      cantidad.hasError('esNumeroNegativo') ||
      cantidad.hasError('esNumeroFlotante')
    ) {
      this.toastService.setToastState(true, 'Cantidad inválida');
    } else {
      if (cantidad.hasError('esNumeroMayor')) {
        this.toastService.setToastState(true, 'Límite de cantidad superado');
      } else {
        let obj: { envaseId: number; cantidad: number } = {
          envaseId: parseInt(envase.value),
          cantidad: parseInt(cantidad.value),
        };

        this.cantidadEnvase.emit(obj);
      }
    }
  };
}
