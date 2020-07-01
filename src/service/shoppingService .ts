import { LoadingController, AlertController, ToastController, ModalController } from 'ionic-angular';
import { Injectable } from '@angular/core';
// import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { HttpProvider } from '../providers/http';
import { Observable } from 'rxjs';
import { AppCache } from '../app/app.cache';
import { SALES_DETAIL_PAGE } from '../pages/pages.constants';

@Injectable()
export class ShoppingService  {
    constructor(public http: HttpProvider, public appCache: AppCache, public modalCtrl: ModalController, ) {

    }
    startTime: Date = new Date();
    endTime: Date = new Date();
    currPage: number = 1;
    pageSize: number = 20;
    last: boolean;

  

    getSalesBody() {

    }
    openSellInfoModal(item) {
        let myModal = this.modalCtrl.create(SALES_DETAIL_PAGE, item);
        myModal.present();
    }
}
