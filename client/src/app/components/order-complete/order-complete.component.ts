import { Component, OnInit, Input } from '@angular/core';
import { of } from 'rxjs';
import { ShoppingCartItemModel } from 'src/app/models/shopping-cart-item-model';
import { store } from 'src/app/redux/store';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-complete',
  templateUrl: './order-complete.component.html',
  styleUrls: ['./order-complete.component.css']
})
export class OrderCompleteComponent implements OnInit {

  public orderItems: ShoppingCartItemModel[];

  constructor(private myRouter: Router, ) { }

  ngOnInit(): void {
    // returns client to shop if orderItems is empty
    if (store.getState().orderItems.length === 0) {
      this.myRouter.navigateByUrl("/shop");
    }
    this.orderItems = store.getState().orderItems;

  }

  // buildng the txt file content
  public constructTXTExport() {
    let textData = 'Thank you for ordering with us!';
    textData += '\r\n';
    textData += '\r\n';
    textData += 'Bellow are your ordered items:';
    textData += '\r\n';
    let totalPrice = 0;
    for (let i = 0; i < this.orderItems.length; i++) {
      totalPrice = totalPrice + this.orderItems[i].totalPrice;
      textData += this.orderItems[i].quantity + " X " + this.orderItems[i].productName + " = " + "₪" + this.orderItems[i].totalPrice;
      textData += '\r\n';
    }
    textData += '\r\n';
    textData += "Total Price of the order: " + "₪" + totalPrice;
    return textData;
  }

  // set up setting parameter
  private setting = {
    element: {
      dynamicDownload: null as HTMLElement
    }
  }

  // creation of the txt file
  private dyanmicDownloadByHtmlTag(arg: {
    fileName: string,
    text: string
  }) {
    if (!this.setting.element.dynamicDownload) {
      this.setting.element.dynamicDownload = document.createElement('a');
    }
    const element = this.setting.element.dynamicDownload;
    const fileType = arg.fileName.indexOf('.json') > -1 ? 'text/json' : 'text/plain';
    element.setAttribute('href', `data:${fileType};charset=utf-8,${encodeURIComponent(arg.text)}`);
    element.setAttribute('download', arg.fileName);

    var event = new MouseEvent("click");
    element.dispatchEvent(event);
  }

  // call and pass of values for the export
  public dynamicDownloadTxt() {
    this.dyanmicDownloadByHtmlTag({
      fileName: 'Order Details',
      text: this.constructTXTExport()
    });

  }

}
