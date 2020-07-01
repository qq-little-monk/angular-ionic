import {ModalController } from 'ionic-angular';
import { Injectable } from '@angular/core';
// import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { HttpProvider } from '../providers/http';
// import { Observable } from 'rxjs';
import { AppCache } from '../app/app.cache';
import { SALES_DETAIL_PAGE } from '../pages/pages.constants';

@Injectable()
export class SaleService {
    constructor(public http: HttpProvider, public appCache: AppCache, public modalCtrl: ModalController, ) {

    }
    startTime: Date = new Date();
    endTime: Date = new Date();
    currPage: number = 1;
    pageSize: number = 20;
    last: boolean;

    // getSalesList(page, condition, detailVO, infiniteScroll): Observable<any> {
    //     // let detailVO=[];
    //     return Observable.create(observer => {
    //         this.http.getSalesList(condition).subscribe(res => {
    //             //第一页重新加载订单 配合下拉事件
    //             if (this.currPage == 1) {
    //                 detailVO = []
    //             }
    //             for (var i = 0; i < res["records"].length; i++) {
    //                 detailVO.push(res["records"][i]);
    //             }
    //             this.last = res["total"] <= this.currPage * this.pageSize;
    //             infiniteScroll.enable(!this.last);
    //             observer.next(this.last);
    //         }, error => {
    //             if (this.currPage == 1) {
    //                 detailVO = []
    //             }
    //         })
    //         observer.next(true);
    //     });
    // }

    getSalesBody() {

    }
    openSellInfoModal(item) {
        let myModal = this.modalCtrl.create(SALES_DETAIL_PAGE, item);
        myModal.present();
    }
}
