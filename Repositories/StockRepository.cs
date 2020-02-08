using FishMarket.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FishMarket.Repositories
{
    public class StockRepository
    {
        private readonly FishMarketContext fishMarketContext;

        public StockRepository(FishMarketContext fishMarketContext)
        {
            this.fishMarketContext = fishMarketContext;
        }

        public List<FishStockModel> Search(string searchTerm)
        {
            var stock = this
                .fishMarketContext
                .FishStocks
                .Include(s => s.Specie);

            if (string.IsNullOrEmpty(searchTerm))
            {
                return stock.ToList();
            }

            return stock
                .Where(s => s.Specie.Name.ToLower() == searchTerm.ToLower())
                .ToList();
        }
    }
}
