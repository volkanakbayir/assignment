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

        public FishMarketService(StockRepository stockRepository)
        {
            this.stockRepository = stockRepository;
        }

        public virtual Result<List<FishStockModel>> Search(string searchTerm = null)
        {
            return Ok(this.stockRepository.Search(searchTerm));
        }
    }
}
