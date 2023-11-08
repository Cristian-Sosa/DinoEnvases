import { Component, OnInit, inject } from '@angular/core';
import { CargaEnvaseService } from 'src/app/shared';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass'],
})
export class MainComponent implements OnInit {
  private cargaEnvaseService = inject(CargaEnvaseService);

  public showModal: string = 'none';

  public cargaExist: boolean = false;
  public tipoEnvase: any;
  private nombreEnvase!: string;
  public envases: any;

  public carga = JSON.parse(localStorage.getItem('carga')!);

  constructor() {
    this.envases = this.cargaEnvaseService.getTipoEnvases();
  }

  ngOnInit(): void {
    this.cargaEnvaseService.observableEnvases().subscribe((envases) => {
      if (envases.length > 0) {
        this.cargaExist = true;
        this.notificacionPush();
      } else {
        this.cargaExist = false;
      }
    });
  }

  print = async () => {
    const printContent = document.getElementById('CargaEnvases');
    const WindowPrt = window.open(
      '',
      '',
      'left=0,top=50,width=900,height=900,toolbar=0,scrollbars=0,status=0'
    );
    WindowPrt?.document.write(`
    <html>
    <head>
    <title>asdasdasd</title>
    </head>
    <body>
    ${printContent}
    </body>
    </html>
    `);
    WindowPrt?.document.close();
    WindowPrt?.focus();
    WindowPrt?.print();
    WindowPrt?.close();
  };

  generateDynamicHTML = () => {
    // const printContent = document.getElementById("CargaEnvases")?.innerHTML.toString();
    // const printContent = `<html><head><title>Vale</title></head><body><div><table><thead><tr><th>Cant.</th><th>Descripción</th><th>Tipo</th></tr></thead><tbody>${this.carga.forEach((item: any) => {return `<tr><td>${item.cardEnvase.cantidad}</td><td>${item.cardEnvase.nombre}</td><td>${item.cardEnvase.tipo}</td></tr>`;})}</tbody></table></div></body></html>`;
    // const printContent = `<h1>Color%20Verde</h1>`;

    // let dynHtml = "print://escpos.org/escpos/bt/print/?srcTp=uri&srcObj=html&src='data:text/html,<h1>Color%20Verde</h1>'";
    // dynHtml = dynHtml.concat(printContent)
    // dynHtml += "'";
    // console.log(dynHtml);
    window.location.href = "print://escpos.org/escpos/bt/print/?srcTp=uri&srcObj=html&src='data:text/html,<h1>Color%20Verde</h1>'";
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
