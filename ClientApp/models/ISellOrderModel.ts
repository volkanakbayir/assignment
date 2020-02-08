import { ISpecieModel } from "./ISpecieModel";

export interface ISellOrderModel {
    id?: number;
    specie: ISpecieModel;
    quantity: number;
    price: number;
}