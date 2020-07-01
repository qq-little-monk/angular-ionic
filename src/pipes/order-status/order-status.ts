import { Pipe, PipeTransform } from '@angular/core';
import { CommonStatusEnum } from '../../providers/common.statusenum';
@Pipe({
  name: 'orderStatus'
})
export class OrderStatusPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return CommonStatusEnum.OrderStatus[value];
  }

}
