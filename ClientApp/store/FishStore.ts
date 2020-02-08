import { ISpecieModel } from "@Models/ISpecieModel";
import { ISellOrderModel } from "@Models/ISellOrderModel";
import { IBuyOrderModel } from "@Models/IBuyOrderModel";
import { AppThunkAction, AppThunkActionAsync } from "@Store/index";
import Result from "@Models/Result";
import { Reducer, Action } from "redux";
import { clone } from "@Utils";
import { IStockModel } from "@Models/IStockModel";
import FishMarketService from "@Services/FishMarketService";
import { wait } from "domain-wait";

export namespace FishStore {
    export interface IState {
        species: ISpecieModel[];
        stock: IStockModel[];
        sellOrders: ISellOrderModel[];
        buyOrders: IBuyOrderModel[];
        indicators: {
            operationLoading: boolean;
        };
    }

    export enum Actions {
        Search = "Search",
        AddSpecie = "ADD_SPECIE",
        AddSellOrder = "ADD_SELL_ORDER",
        AddBuyOrder = "ADD_BUY_ORDER"
    }

    interface ISearch {
        type: Actions.Search;
        payload: IStockModel[];
    }

    interface IAddSpecie {
        type: Actions.AddSpecie;
        payload: ISpecieModel;
    }

    interface IAddSellOrder {
        type: Actions.AddSellOrder;
        payload: ISellOrderModel;
    }

    interface IAddBuyOrder {
        type: Actions.AddBuyOrder;
        payload: IBuyOrderModel;
    }

    type KnownAction = IAddBuyOrder | IAddSellOrder | IAddSpecie | ISearch;

    export const actionsCreators = {
        search: (searchTerm: string): AppThunkAction<KnownAction> => async (
            dispatch,
            getState
        ) => {
            await wait(async transformUrl => {
                const result = await FishMarketService.search(searchTerm);

                if (!result.hasErrors) {
                    dispatch({ type: Actions.Search, payload: result.value });
                }
            });
        },
        addSpeie: (
            specie: ISpecieModel
        ): AppThunkActionAsync<KnownAction, Result<number>> => async (
            dispatch,
            getState
        ) => {
                dispatch({ type: Actions.AddSpecie, payload: specie });

                return new Promise(resolve => {
                    resolve({
                        errors: [],
                        hasErrors: false,
                        value: specie.id
                    } as Result<number>);
                });
            },

        addSellOrder: (
            order: ISellOrderModel
        ): AppThunkActionAsync<KnownAction, Result<number>> => async (
            dispatch,
            getState
        ) => {
                dispatch({ type: Actions.AddSellOrder, payload: order });

                return new Promise(resolve => {
                    resolve({
                        errors: [],
                        hasErrors: false,
                        value: order.id
                    } as Result<number>);
                });
            },

        addBuyOrder: (
            order: IBuyOrderModel
        ): AppThunkActionAsync<KnownAction, Result<number>> => async (
            dispatch,
            getState
        ) => {
                dispatch({ type: Actions.AddBuyOrder, payload: order });

                return new Promise(resolve => {
                    resolve({
                        errors: [],
                        hasErrors: false,
                        value: order.id
                    } as Result<number>);
                });
            }
    };

    const initialState: IState = {
        species: [
            {
                id: 1,
                name: "Seabass",
                imageSrc:
                    "https://media.istockphoto.com/photos/three-fresh-seabass-fish-on-plate-picture-id466288735"
            },
            {
                id: 2,
                name: "Perch",
                imageSrc:
                    "https://media.istockphoto.com/photos/three-fresh-seabass-fish-on-plate-picture-id466288735"
            },
            {
                id: 3,
                name: "Tuna",
                imageSrc:
                    "https://5.imimg.com/data5/YA/LX/MY-8948116/tuna-fish-500x500.jpg"
            },
            {
                id: 4,
                name: "Kefal",
                imageSrc:
                    "https://5.imimg.com/data5/YA/LX/MY-8948116/tuna-fish-500x500.jpg"
            }
        ],
        stock: [],
        sellOrders: [],
        buyOrders: [],
        indicators: {
            operationLoading: false
        }
    };

    export const reducer: Reducer<IState> = (
        currentState: IState = initialState,
        incomingAction: Action
    ) => {
        const action = incomingAction as KnownAction;

        const { indicators, species, sellOrders, buyOrders, stock } = currentState;

        var cloneIndicators = () => clone(indicators);

        switch (action.type) {
            case Actions.AddSpecie: {
                const indicators = cloneIndicators();
                indicators.operationLoading = false;
                return {
                    ...currentState,
                    species: [...species, action.payload],
                    indicators
                };
            }
            case Actions.AddSellOrder: {
                const indicators = cloneIndicators();
                indicators.operationLoading = false;
                const specieStock = stock.find(
                    s => s.specie.id === action.payload.specie.id
                );

                return {
                    ...currentState,
                    stock: [
                        ...stock.filter((_, index) => index !== stock.indexOf(specieStock)),
                        {
                            specie: action.payload.specie,
                            quantity:
                                (specieStock ? specieStock.quantity : 0) +
                                action.payload.quantity,
                            latestPrice: action.payload.price
                        }
                    ],
                    sellOrders: [...sellOrders, action.payload],
                    indicators
                };
            }
            case Actions.AddBuyOrder: {
                const indicators = cloneIndicators();
                indicators.operationLoading = false;
                const specieStock = stock.find(
                    s => s.specie.id === action.payload.specie.id
                );

                return {
                    ...currentState,
                    stock: [
                        ...stock.filter((_, index) => index !== stock.indexOf(specieStock)),
                        {
                            ...specieStock,
                            quantity: specieStock.quantity - action.payload.quantity
                        }
                    ],
                    buyOrders: [...buyOrders, action.payload],
                    indicators
                };
            }
            case Actions.Search: {
                const indicators = cloneIndicators();
                indicators.operationLoading = false;

                return { ...currentState, stock: action.payload };
            }
            default:
                const exhaustiveCheck: never = action;
        }

        return currentState;
    };
}
