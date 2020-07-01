import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the KeyboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-keyboard',
  templateUrl: 'keyboard.html',
})
export class KeyboardPage {

  str: string ='';
  keyboardNum: Array<number> = [1,2,3,4,5,6,7,8,9];

  constructor(public navCtrl: NavController, 
    public viewCtrl:ViewController,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad KeyboardPage');
  }

  close(){
    this.viewCtrl.dismiss(null);
  }

  addStr(n) {
    this.str += n.toString();
    if(this.str.length == 6) {
      this.viewCtrl.dismiss(this.str);
    }
  }

  clear(){
    this.str = this.str.substring(0,this.str.length-1)
  }

}
