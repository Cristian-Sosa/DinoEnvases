import { Component, Input, inject } from '@angular/core';
import { EnvasesDataService } from '../../services';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.sass'],
})
export class CardComponent {
  private envasesDataService = inject(EnvasesDataService);

  public remove: boolean = false;

  @Input() card!: any;

  removeEnvase = (): void => {
    this.remove = true;
    let interval = setInterval(() => {
      this.envasesDataService.removeEnvase(this.card);
      clearInterval(interval);
    }, 250);
  };
}
