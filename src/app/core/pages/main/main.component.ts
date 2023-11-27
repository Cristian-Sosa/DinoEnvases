import { Component, OnInit, inject } from '@angular/core';
import { AuthService, CargaEnvaseService, ToastService } from 'src/app/shared';
import { DateTime } from 'luxon';
import ConectorPluginV3 from './ConectorPluginV3';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass'],
})
export class MainComponent implements OnInit {
  private cargaEnvaseService = inject(CargaEnvaseService);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);

  public showModal: string = 'none';

  public cargaExist: boolean = false;
  public tipoEnvase: any;
  public envases: any;

  private nombreEnvase: any;

  public carga = JSON.parse(localStorage.getItem('carga')!);

  private printCharacteristic: any;
  private printerUUID: any = undefined;

  private bluetooth = (navigator as any).bluetooth;

  constructor() {
    this.envases = this.cargaEnvaseService.getTipoEnvases();
  }

  ngOnInit(): void {
    this.cargaEnvaseService.observableEnvases().subscribe((envases) => {
      if (envases.length > 0) {
        this.cargaExist = true;
      } else {
        this.cargaExist = false;
      }
    });
  }

  print = (): void => {
    this.bluetooth
      .requestDevice({
        filters: [
          {
            services: ['000018f0-0000-1000-8000-00805f9b34fb'],
          },
        ],
      })
      .then((device: any) => {
        this.toastService.setToastState(true, 'Conectando a ' + device?.uuid);
        this.printerUUID = device?.BluetoothUUID.id;
        console.log(device)
        return device?.gatt?.connect();
      })
      .then((server: any) =>
        server?.getPrimaryService('000018f0-0000-1000-8000-00805f9b34fb')
      )
      .then((service: any) =>
        service?.getCharacteristic('00002af1-0000-1000-8000-00805f9b34fb')
      )
      .then((characteristic: any) => {
        this.printCharacteristic = characteristic;
        this.generateMessageToPrint();
      })
      .catch(() => this.toastService.setToastState(true, 'Error Imprimiendo'));
  };

  generateMessageToPrint = async (): Promise<any> => {
    const conector = new ConectorPluginV3();

    conector
      .Iniciar()
      .EstablecerAlineacion(ConectorPluginV3.ALINEACION_CENTRO)
      .EscribirTexto('Hola Angular desde parzibyte.me')
      .Feed(1)
      .EscribirTexto('Prueba de impresión')
      .Feed(1)
      .DescargarImagenDeInternetEImprimir(
        'https://pedroerlopez.shop/lander/ar-white/images/logo-super-mami.png',
        ConectorPluginV3.TAMAÑO_IMAGEN_NORMAL,
        400
      )
      .Iniciar()
      .Feed(1);

    const respuesta = await conector.imprimirEn(this.printerUUID);
  };

  notificacionPush = (): void => {
    navigator.serviceWorker
      .getRegistration()
      .then((reg) =>
        reg?.showNotification(`Se recuperó una carga pendiente de imprimir`)
      );
  };

  newEnvase = (): string => (this.showModal = 'tipoEnvase');

  tipoEnvaseSelected = (envase: string | null): void => {
    this.tipoEnvase = {};
    switch (envase) {
      case 'cerveza':
        this.tipoEnvase = this.envases.cerveza;
        this.showModal = 'cantidadEnvase';
        this.nombreEnvase = envase!;
        break;

      case 'gaseosa':
        this.tipoEnvase = this.envases.gaseosa;
        this.showModal = 'cantidadEnvase';
        this.nombreEnvase = envase!;
        break;

      case 'drago':
        this.tipoEnvase = this.envases.drago;
        this.showModal = 'cantidadEnvase';
        this.nombreEnvase = envase!;
        break;

      case 'cajon':
        this.tipoEnvase = this.envases.cajones;
        this.showModal = 'cantidadEnvase';
        this.nombreEnvase = envase!;
        break;

      default:
        this.showModal = 'none';
        break;
    }
  };

  cantidadEnvaseSelected = (
    obj: { tipo: any; cantidad: string | number } | null
  ): void => {
    if (obj) {
      let envaseDTO: any = {
        nombre: this.nombreEnvase,
        tipo: obj?.tipo,
        cantidad: obj.cantidad,
      };
      this.cargaEnvaseService.setEnvase(envaseDTO);
      this.showModal = 'none';
    } else {
      this.showModal = 'tipoEnvase';
    }
  };
}
