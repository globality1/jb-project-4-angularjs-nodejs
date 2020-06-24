import { Component, Input, OnInit } from '@angular/core';
import { apiBaseURL } from 'src/environments/environment';

@Component({
  selector: 'app-system-information',
  templateUrl: './system-information.component.html',
  styleUrls: ['./system-information.component.css']
})
export class SystemInformationComponent implements OnInit {
  
  public apiBaseURL;
  constructor() { }

  ngOnInit() {
   this.apiBaseURL = apiBaseURL;
  }

  @Input()
  public productsCount?: number;

  @Input()
  public ordersCount?: number;

}
