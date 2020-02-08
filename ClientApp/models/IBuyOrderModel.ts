import { ISpecieModel } from "./ISpecieModel";

export interface IBuyOrderModel {
    id?: number;
    specie: ISpecieModel;
    quantity: number;
}