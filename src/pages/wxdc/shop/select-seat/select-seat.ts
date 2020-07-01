import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, App } from 'ionic-angular';
import { WoShopService } from '../../../../service/wo.shop.service';
import { WoShopDetailPage } from '../wo-shop-detail/wo-shop-detail';


/**
 * Generated class for the SelectSeatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-select-seat',
  templateUrl: 'select-seat.html',
})
export class SelectSeatPage {

  @ViewChild('container') container: any;
  @ViewChild('header') header: any;
  @ViewChild('center') center: any;
  peopleList: Array<number> = [1, 2, 3, 4, 5, 6, 7];
  // selectPeople:number = 1;

  nav: any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    public app: App,
    public shopSer: WoShopService) {
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad SelectSeatPage');
  }

  ionViewDidEnter() {
    setTimeout(() => {
      this.header.nativeElement.style.height = `${this.container.nativeElement.clientHeight - this.center.nativeElement.clientHeight - 60}px`;
    }, 200);
  }

  selectMore() {
    let alert = this.alertCtrl.create({
      title: '就餐人数',
      inputs: [
        {
          name: 'dinersNum',
          placeholder: '请输入就餐人数',
          type: 'number'
        }
      ],
      buttons: [
        {
          text: '取消',
          role: 'cancel',
          handler: data => {
          }
        },
        {
          text: '确定',
          handler: data => {
            if(!data.dinersNum) {
              // this.helper.toast('就餐人数不能为空');
              return false;
            }
            this.shopSer.diners.dinersNum = data.dinersNum;
            this.submit();
          }
        }
      ]
    });
    alert.present();
  }


  submit(){   
    // this.app.getRootNav().setRoot('WoShopDetailPage');
    this.nav = this.app.getActiveNavs();
    this.nav[0].setRoot(WoShopDetailPage);
  }
}
