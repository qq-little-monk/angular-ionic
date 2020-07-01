import { Injectable } from '@angular/core';
import { QRScanner } from '@ionic-native/qr-scanner';
import { Observable } from 'rxjs';

/*
  Generated class for the UtilProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class QrScanUtilProvider {
  alert: any;
  constructor(public qrScanner: QRScanner, ) {
  }

  public scan() {
    let code = '';
    return Observable.create(observer => {
      this.qrScanner.scan().subscribe((text: string) => {
        if (text.length == 13 && text[0] == '0') {
          text = text.substr(1, text.length - 1);
        }
        code = text;
        observer.next(code);
      }, error => {
        observer.next(error);
      });
    });
  }

}
