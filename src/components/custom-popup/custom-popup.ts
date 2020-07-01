import { Component, OnInit, Input, ViewChild, Output, EventEmitter, forwardRef } from '@angular/core';
import { HttpProvider } from '../../providers/http';
@Component({
    selector: 'custom-popup',
    templateUrl: 'custom-popup.html',
  })

  export class CustomPopupComponent implements OnInit{
      
    public qrCodeValue:string;//付款二维码
    public reMarkValue:string;//备注
    public isAppear:boolean = false;//隐藏弹框
    @Input() qrCode;
    
    @Output() private outer = new EventEmitter<string>();
    @Output()  toParent= new EventEmitter();
    @Output() noAppear = new EventEmitter();
    constructor(public http: HttpProvider){

      }
    ngOnInit(){
      this.qrCodeValue = this.qrCode;
    }
    cancels(){
      this.noAppear.emit(this.isAppear);
    }
    according(){
      if(this.reMarkValue&&this.reMarkValue.replace(/(^\s*)|(\s*$)/g, "")){
        let data ={
          'text': this.qrCodeValue,
          'textarea': this.reMarkValue
        }
        this.toParent.emit(data);
        localStorage.setItem('isPay','y');//支付成功后
      }else{
        this.http.showToast('备注不能为空');
      }
      
    }

  }