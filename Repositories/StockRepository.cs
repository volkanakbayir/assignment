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

        public PaginatedModel<FishStockModel> Search(string searchTerm, int limit, int offset)
        {
            var stock = this
                .fishMarketContext
                .FishStocks
                .Include(s => s.Specie)
                .OrderBy(d => d.Id);

            var result = new PaginatedModel<FishStockModel>();

            if (string.IsNullOrEmpty(searchTerm))
            {
                result.Data = stock.Skip(offset).Take(limit).ToList();
                result.Total = stock.Count();
                return result;
            }


            var filteredStock = result.Data = stock
                .Where(s => s.Specie.Name.ToLower().Contains(searchTerm.ToLower()));

            result.Total = filteredStock.Count();
            result.Data = filteredStock.Skip(offset).Take(limit).ToList();

            return result;
        }

        public bool Update(FishStockModel specieStock)
        {
            fishMarketContext.FishStocks.Update(specieStock);
            fishMarketContext.SaveChanges();
            return true;
        }

        public int CreateStock(FishStockModel specieStock)
        {
            fishMarketContext.FishStocks.Add(specieStock);
            fishMarketContext.SaveChanges();
            return specieStock.Id.Value;
        }

        public FishStockModel FindStockBySpecieId(int id)
        {
            return this.fishMarketContext.FishStocks.FirstOrDefault(d => d.SpecieId == id);
        }
    }
}
