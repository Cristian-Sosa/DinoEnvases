import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EnvasesDataService {
  private tipoEnvases: TipoEnvase[] = [
    {
      id: 1,
      nombre: 'cerveza',
      habilitado: true,
    },
    {
      id: 2,
      nombre: 'gaseosa',
      habilitado: true,
    },
    {
      id: 3,
      nombre: 'drago',
      habilitado: true,
    },
    {
      id: 4,
      nombre: 'cajón',
      habilitado: true,
    },
  ];

  private envases: Envase[] = [
    {
      id: 1,
      codigo: '3110001',
      ean: '3311000100001',
      descripcion: 'Cerveza 1L (Marrón)',
      tipoEnvaseID: 1,
      precio: 1000.0,
    },
    {
      id: 2,
      codigo: '3110001',
      ean: '3311000100001',
      descripcion: 'Cerveza 1L (Verde)',
      tipoEnvaseID: 1,
      precio: 1000.0,
    },
    {
      id: 3,
      codigo: '3110003',
      ean: '3110003000000',
      descripcion: 'Gaseosa Coca Cola 2/2.5 L',
      tipoEnvaseID: 2,
      precio: 1000.0,
    },
    {
      id: 4,
      codigo: '3110005',
      ean: '3311000500009',
      descripcion: 'Garrafa Drago 250 CC',
      tipoEnvaseID: 3,
      precio: 2900.0,
    },
    {
      id: 5,
      codigo: '3110006',
      ean: '3311000600006',
      descripcion: 'Garrafa Drago 1 KG',
      tipoEnvaseID: 3,
      precio: 4900.0,
    },
    {
      id: 6,
      codigo: '3110012',
      ean: '3311001200007',
      descripcion: 'Cerveza Quilmes 340 CC',
      tipoEnvaseID: 1,
      precio: 300.0,
    },
    {
      id: 7,
      codigo: '3110015',
      ean: '3311001500008',
      descripcion: 'Cajón Coca Cola 2500 CC',
      tipoEnvaseID: 4,
      precio: 8000.0,
    },
    {
      id: 8,
      codigo: '9999998',
      ean: '9999998123453',
      descripcion: 'Cajón Quilmes 340 CC',
      tipoEnvaseID: 4,
      precio: 5000.0,
    },
    {
      id: 9,
      codigo: '9999999',
      ean: '9999001321425',
      descripcion: 'Cajón Cerveza 1 Lt',
      tipoEnvaseID: 4,
      precio: 8000.0,
    },
  ];

  private cargaEnvases: Envase[] = [];
  private _cargaEnvases: BehaviorSubject<Envase[]> = new BehaviorSubject(
    this.cargaEnvases
  );

  constructor() {}

  getEnvases = (): Array<Envase> => this.envases;

  getTiposEnvases = (): Array<TipoEnvase> =>
    this.tipoEnvases.filter((envase) => envase.habilitado === true);

  getEnvasesObservable = () => {
    if (this.cargaEnvases && localStorage.getItem('carga_actual')) {
      this.cargaEnvases = JSON.parse(localStorage.getItem('carga_actual')!);
      this._cargaEnvases.next(this.cargaEnvases);
    }

    return this._cargaEnvases.asObservable();
  };

  cargarEnvase = (envaseDTO: EnvaseDTO): void => {
    let envaseFiltrado: Envase[] = [];
    let envaseTemp: Envase | null = null;

    try {
      envaseFiltrado = this.envases.filter(
        (item) => item.id === envaseDTO.envaseId
      );

      envaseTemp = envaseFiltrado[0];
      envaseTemp.cantidades = envaseDTO.cantidad!;

      this.addEnvase(envaseTemp);
    } catch (error) {
      throw new Error('Error al cargar item de vale');
    }
  };

  addEnvase = (envase: Envase): void => {
    this.cargaEnvases.push(envase);
    this._cargaEnvases.next(this.cargaEnvases);
    localStorage.setItem('carga_actual', JSON.stringify(this.cargaEnvases));
  };

  removeEnvase = (envaseObj: any): void => {
    let index: number = -1; // Inicializa el índice en -1 para verificar si se encontró una coincidencia

  for (let i = 0; i < this.cargaEnvases.length; i++) {
    const element = this.cargaEnvases[i];
    if (
      element.descripcion === envaseObj.descripcion &&
      element.id === envaseObj.id &&
      element.cantidades === envaseObj.cantidades
    ) {
      index = i;
      break; // Termina el bucle cuando se encuentra la coincidencia
    }
  }

  if (index !== -1) {
    this.cargaEnvases.splice(index, 1);
    this._cargaEnvases.next(this.cargaEnvases);

    localStorage.setItem('carga_actual', JSON.stringify(this.cargaEnvases));
  }
  };

  sendCarga = (): void => {
    try {
      if (!localStorage.getItem('carga_pendiente')) {
        console.log(this.envases);
      } else {
        let cargasPendientes: Array<Envase[]> = JSON.parse(
          localStorage.getItem('cargaPendiente')!
        );
        cargasPendientes.push(this.cargaEnvases);

        for (let i = 0; i < cargasPendientes.length; i++) {
          const element = cargasPendientes[i];

          // console.log(element);
        }
      }
    } catch (error) {
      if (localStorage.getItem('carga_pendiente')) {
        let cargaPendiente: Array<Envase[]> = JSON.parse(
          localStorage.getItem('carga_pendiente')!
        );

        cargaPendiente.push(this.cargaEnvases);

        localStorage.setItem('carga_pendiente', JSON.stringify(cargaPendiente));
      } else {
        localStorage.setItem(
          'carga_pendiente',
          JSON.stringify(this.cargaEnvases)
        );
      }
    }
  };
}

export interface EnvaseDTO {
  envaseId: number | null;
  tipoEnvaseId: number | null;
  cantidad: number | null;
}

export interface Envase {
  id: number;
  codigo: string;
  descripcion: string;
  ean: string;
  precio?: number;
  tipoEnvaseID: number;
  cantidades?: number;
}

export interface TipoEnvase {
  id: number;
  nombre: 'cerveza' | 'gaseosa' | 'drago' | 'cajón';
  habilitado: boolean;
}

export interface IEnvaseResponse {
  status: number;
  data: Envase[] | null;
}
