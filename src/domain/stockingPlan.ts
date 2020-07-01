import { IBaseEntity } from "./iBaseEntity";

export interface IStockingPlan extends IBaseEntity {
  id: string,
  stkType: string,
  storeId: string,
  stkNo: string,
  stkItemId: string,
  stkItemName: string,
  storeName:string,
  handlerBy:string,
}

export class StockingPlan implements IStockingPlan {
  id: string;
  stkType: string;
  storeId: string;
  stkNo: string;
  stkItemId: string;
  stkItemName: string;
  storeName:string;
  handlerBy:string;


  static tableName: string = 'tb_stocking_plan';
  static create: string = 'CREATE TABLE IF NOT EXISTS [tb_stocking_plan] (' +
    '[id] VARCHAR2(50) PRIMARY KEY UNIQUE NOT NULL, ' +
    '[stkType] VARCHAR2(10), ' +
    '[storeId] VARCHAR2(50), ' +
    '[stkNo] VARCHAR2(50),' +
    '[storeName] VARCHAR2(50),' +
    '[handlerBy] VARCHAR2(50),' +
    '[stkItemId] VARCHAR2(2000),' +
    '[stkItemName] VARCHAR2(2000) ' +
    ')';


  static toJson() {
    return {
      id: null,
      storeId: null,
      stkType: null,
      stkNo: null,
      stkDate: null,
      stkItemName: null,
      storeName:null,
      handlerBy:null,
    }
  }
}
