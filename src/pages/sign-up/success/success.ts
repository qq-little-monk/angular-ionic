import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {SignInPage} from "../../sign-in/sign-in";
import {SellerDao} from "../../../dao/sellerDao";
import {Seller} from "../../../domain/seller";

/**
 * Generated class for the SuccessPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-success',
  templateUrl: 'success.html',
})
export class SuccessPage {
  sellerId: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public sellerDao: SellerDao) {
    // platform.registerBackButtonAction(() => {
    //   this.sellerDao.clear().then(() => {
    //     let seller = Seller.toJson();
    //
    //     seller.id = this.sellerId;
    //
    //     this.sellerDao.set(seller).then(() => {
    //       this.navCtrl.setRoot(SignInPage, {}, {animate: true, direction: 'back'})
    //     })
    //   })
    // })
  }

  ionViewWillEnter() {
    this.sellerId = this.navParams.get('sellerId')
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SuccessPage');
  }

  async ionViewCanLeave() {
    let shouldLeave = await this.confirmLeave();
    return shouldLeave;
  }

  confirmLeave(): Promise<Boolean> {
    return new Promise<Boolean>(resolve => {
      this.sellerDao.clear().then(() => {
        let seller = Seller.toJson();

        seller.id = this.sellerId;

        this.sellerDao.set(seller).then(() => {
          resolve(true)
        })
      })
    })
  }

  goBackToLogin() {
    this.navCtrl.setRoot(SignInPage, {}, {animate: true, direction: 'back'})

    // this.sellerDao.clear().then(() => {
    //   let seller = Seller.toJson();
    //
    //   seller.id = this.sellerId;
    //
    //   this.sellerDao.set(seller).then(() => {
    //     this.navCtrl.setRoot(SignInPage, {}, {animate: true, direction: 'back'})
    //   })
    // })
  }

}
