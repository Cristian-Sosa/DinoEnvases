import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import * as JsBarcode from 'jsbarcode';
import { EnvasesDataService, ValeService } from 'src/app/shared';

@Component({
  selector: 'app-ticket-layout',
  templateUrl: './ticket-layout.component.html',
  styleUrls: ['./ticket-layout.component.sass'],
})
export class TicketLayoutComponent implements OnInit, OnChanges {
  private envasesDataService = inject(EnvasesDataService);
  private valeService = inject(ValeService);

  public envases: any = [];

  private ean: string = '';

  @Input() cabecera!: {
    fecha: string;
    usuario: string | undefined;
    ticket: string;
  };

  ngOnInit(): void {
    this.envasesDataService.getEnvasesObservable().subscribe({
      next: (envases) => {
        this.envases = envases;
      },
      error: (err) => {
        this.envases = [];
      },
    });
    this.valeService.getEAN().subscribe(res => this.ean = res)
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.generateEAN13Barcode();
  }

  generateEAN13Barcode = () => {
    console.log(this.ean);
    if (this.ean) {
      JsBarcode('#barcode', this.ean, {
        format: 'EAN13',
        lineColor: '#333',
        width: 1.5,
        height: 20,
        displayValue: true,
      });
    }
  };
}
