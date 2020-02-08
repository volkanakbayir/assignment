import { ISpecieModel } from "./ISpecieModel";

export interface IStockModel {
  id?: number;
  specie: ISpecieModel;
  quantity: number;
  latestPrice: number;
}
