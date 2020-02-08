using System;
using System.Collections.Generic;
using System.Linq;
using FishMarket.Infrastructure;
using FishMarket.Models;
using FishMarket.Repositories;

namespace FishMarket.Services
{
    public class FishMarketService : ServiceBase
    {
        private readonly StockRepository stockRepository;
        private readonly SpeciesRepository speciesRepository;

        public FishMarketService(StockRepository stockRepository, SpeciesRepository speciesRepository)
        {
            this.stockRepository = stockRepository;
            this.speciesRepository = speciesRepository;
        }

        public virtual Result<PaginatedModel<FishStockModel>> Search(string searchTerm = null, int limit = 10, int offset = 0)
        {
            return Ok(this.stockRepository.Search(searchTerm, limit, offset));
        }

        public virtual Result AddSellOrder(SellOrderModel sellOrder)
        {
            if (!sellOrder.Specie.Id.HasValue)
            {
                return Error("Specie.Id Required");
            }

            var species = this.speciesRepository.FindById(sellOrder.Specie.Id.Value);

            if (species == null)
            {
                return Error("Species not found");
            }

            var speciesStock = this.stockRepository.FindStockBySpecieId(sellOrder.Specie.Id.Value);


            if (speciesStock != null)
            {
                speciesStock.Quantity += sellOrder.Quantity;
                speciesStock.LatestPrice = sellOrder.Price;
                this.stockRepository.Update(speciesStock);
                return Ok(speciesStock);
            }
            else
            {
                speciesStock = new FishStockModel
                {
                    LatestPrice = sellOrder.Price,
                    Quantity = sellOrder.Quantity,
                    SpecieId = sellOrder.Specie.Id.Value
                };

                this.stockRepository.CreateStock(speciesStock);
                return Ok(speciesStock);
            }
        }

        public virtual Result AddBuyOrder(BuyOrderModel buyOrder)
        {
            if (!buyOrder.Specie.Id.HasValue)
            {
                return Error("Specie.Id Required");
            }

            var species = this.speciesRepository.FindById(buyOrder.Specie.Id.Value);

            if (species == null)
            {
                return Error("Species not found");
            }

            var speciesStock = this.stockRepository.FindStockBySpecieId(buyOrder.Specie.Id.Value);

            if (speciesStock == null)
            {
                return Error("There aren't any stock for this species");
            }

            if (speciesStock.Quantity < buyOrder.Quantity)
            {
                return Error("Tere aren't enough stock to complete this operation");
            }


            speciesStock.Quantity -= buyOrder.Quantity;
            this.stockRepository.Update(speciesStock);
            return Ok(speciesStock);


        }
    }
}
