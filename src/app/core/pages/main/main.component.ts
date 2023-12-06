import { Component, OnInit, inject } from '@angular/core';
import { AuthService, EnvasesDataService } from 'src/app/shared';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass'],
})
export class MainComponent implements OnInit {
  private envasesDataService = inject(EnvasesDataService);
  private authService = inject(AuthService);

  public showModal: string = 'none';
  public generateTicket: boolean = false;

  public cargaExist: boolean = false;
  public cabecera: { fecha: string; sucursal: string; ticket: string } = {
    fecha: DateTime.now().toFormat('LLL dd/MM/yyyy, hh:mm'),
    sucursal: this.authService.getDataUser()?.sucursal!,
    ticket: 'xxxxxxxxxxxx',
  };

  public envaseDTO: {
    envaseId: number | null;
    tipoEnvaseId: number | null;
    cantidad: number | null;
  } = {
    envaseId: null,
    tipoEnvaseId: null,
    cantidad: null,
  };

  ngOnInit(): void {
    this.envasesDataService.getEnvasesObservable().subscribe({
      next: (res) => {
        res.length > 0 ? (this.cargaExist = true) : (this.cargaExist = false);
      },
      error: () => {
        this.cargaExist = false;
      },
    });

    if (localStorage.getItem('carga_pendiente')) {
      this.notificacionPush(
        'Hay cargas pendientes de subir, conectate a internet para subirlas'
      );
    }
  }

  generarCodigoAleatorio = (): number => {
    const codigo = Math.floor(100000 + Math.random() * 900000);
    return codigo;
  }

  printCarga = () => {
    this.cabecera.fecha = DateTime.now().toFormat('LLL dd/MM/yyyy, hh:mm');
    this.cabecera.sucursal = this.authService.getDataUser()?.sucursal!;
    this.cabecera.ticket = this.generarCodigoAleatorio().toString().concat(DateTime.now().toFormat('hhmmss'));

    const printWindow = window.open('', '_blank');

    printWindow!.document.write(`<html>
    <head>
      <title>Vale de envases - preview</title>
      <style type="text/css">
      * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
          color: #000;
        }
        
        body {
          width: 100%;
          height: auto;
        }
        
        .ticket_header {  
          padding: 24px 0 8px;
          
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
        }

        .ticket_header .logo {
          width: 100%;
          margin-bottom: 8px;
          object-fit: container;
        }

        .ticket_header .title {
          margin-bottom: 2px;
          font-size: 14px;
        }
        
        .ticket_header .sub-title {
          font-size: 10px;
          font-weight: 500;
        }
        
        .cabecera {
          padding-top: 16px;
        
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: stretch;
          gap: 2px;

          font-size: 8px;
          font-weight: 500;
        }
        
        .cuerpo {
          padding: 16px 0;
        
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: stretch;

          font-size: 10px;
          font-weight: 500;
        }
        
        .cuerpo .separador {
          margin-bottom: 8px;
          font-size: 8px;
        }
        
        .card {        
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: strech;
        }

        .card_header {     
          width: 100%;

          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
        }
        
        .footer {
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          align-items: center;
        }
        
        .firma-container {
          width: 100%;
          margin-top: 8px;

          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
        }
        
        .footer-firma {
          width: 80%;
        
          margin: 32px auto 0;
        
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        
          border-top: 1px solid #000;
        }
        
        .footer-firma.caja {
          width: 40%;
        }
        
        .footer-firma p {
          margin-top: 4px;
          text-align: center;
          font-size: 8px;
        }

        main svg {
          margin: 8px auto 16px;
        }
      </style>
    </head>
    <body>`);

    printWindow!.document.write(
      document.querySelector('#ticketPrintComponent')?.innerHTML!
    );

    printWindow!.document.write(`</body></html>`);

    printWindow!.document.close();
    printWindow!.print();
  };

  notificacionPush = (message: string): void => {
    navigator.serviceWorker
      .getRegistration()
      .then((reg) => reg?.showNotification(message));
  };

  newEnvase = (): string => (this.showModal = 'tipoEnvase');

  tipoEnvaseSelected = (tipoEnvaseId: number): void => {
    if (tipoEnvaseId !== 0) {
      this.envaseDTO.tipoEnvaseId = tipoEnvaseId!;
      this.showModal = 'cantidadEnvase';
    } else {
      this.showModal = 'none';
    }
  };

  cantidadEnvaseSelected = (
    obj:
      | {
          envaseId: number;
          cantidad: number;
        }
      | 0
  ): void => {
    if (obj) {
      this.envaseDTO.envaseId = obj.envaseId!;
      this.envaseDTO.cantidad = obj.cantidad!;
      this.envasesDataService.cargarEnvase(this.envaseDTO);
      this.showModal = 'none';
    } else {
      this.showModal = 'tipoEnvase';
    }
  };
}
