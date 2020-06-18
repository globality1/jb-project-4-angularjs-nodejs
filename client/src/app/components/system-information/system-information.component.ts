import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-system-information',
  templateUrl: './system-information.component.html',
  styleUrls: ['./system-information.component.css']
})
export class SystemInformationComponent {

  constructor() { }

  @Input()
  public productsCount?: number;

  @Input()
  public ordersCount?: number;

}
