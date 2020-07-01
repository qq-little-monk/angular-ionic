import { Pipe, PipeTransform } from '@angular/core';
import { GlobalData } from '../../providers/GlobalData';
import { CommonStatusEnum } from '../../providers/common.statusenum';
@Pipe({
  name: 'price'
})
export class PricePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if(!GlobalData.microMembership) {
      //未登录 返回原价
      return value;
    } else {
      if(!value) {
        return 0;
      }
      if(Number(GlobalData.microMembership.disCountType) === CommonStatusEnum.DisCountType.rp) {  // 无会员价/优惠
        return value;
      } else if (Number(GlobalData.microMembership.disCountType) === CommonStatusEnum.DisCountType.dc && Number(args.isEnjoyVIPPrice) === 1) {  //零售折扣  价格（原价*折扣）
        return Math.round(parseFloat(value) * GlobalData.microMembership.discountRate *100 /100)/100;
        // return Number(value * GlobalData.microMembership.discountRate / 100).toFixed(2);
      } else if (Number(GlobalData.microMembership.disCountType) === CommonStatusEnum.DisCountType.v1) {
        return args.vipPrice1?args.vipPrice1: value;
      } else if (Number(GlobalData.microMembership.disCountType) === CommonStatusEnum.DisCountType.v2) {
        return args.vipPrice2?args.vipPrice2: value;
      } else if (Number(GlobalData.microMembership.disCountType) === CommonStatusEnum.DisCountType.v3) {
        return args.vipPrice3?args.vipPrice3: value;
      } else if (Number(GlobalData.microMembership.disCountType) === CommonStatusEnum.DisCountType.v4) {
        return args.vipPrice4?args.vipPrice4: value;
      } else if (Number(GlobalData.microMembership.disCountType) === CommonStatusEnum.DisCountType.v5) {
        return args.vipPrice5?args.vipPrice5: value;
      } else {
        return value;
      }
    }
  }

}
