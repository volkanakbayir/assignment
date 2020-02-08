using FishMarket.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FishMarket.Repositories
{
    public class FishMarketContext : DbContext
    {
        public FishMarketContext(DbContextOptions<FishMarketContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<SpeciesModel>().HasData(new SpeciesModel
            {
                Id = 1,
                Name = "Seabass",
                ImageSrc = "https://media.istockphoto.com/photos/three-fresh-seabass-fish-on-plate-picture-id466288735"
            },
           new SpeciesModel
           {
               Id = 2,
               Name = "Perch",
               ImageSrc = "https://media.istockphoto.com/photos/three-fresh-seabass-fish-on-plate-picture-id466288735"
           },
           new SpeciesModel
           {
               Id = 3,
               Name = "Tuna",
               ImageSrc = "https://5.imimg.com/data5/YA/LX/MY-8948116/tuna-fish-500x500.jpg"
           },
           new SpeciesModel
           {
               Id = 4,
               Name = "Kefal",
               ImageSrc = "https://5.imimg.com/data5/YA/LX/MY-8948116/tuna-fish-500x500.jpg"
           });

            modelBuilder.Entity<FishStockModel>()
                .HasOne(s => s.Specie)
                .WithMany()
                .HasForeignKey(s => s.SpecieId);

            modelBuilder.Entity<FishStockModel>().HasData(new FishStockModel
            {
                Id = 1,
                Quantity = 10000,
                LatestPrice = 10,
                SpecieId = 1
            },
            new FishStockModel
            {
                Id = 2,
                Quantity = 20000,
                LatestPrice = 25,
                SpecieId = 2
            },
            new FishStockModel
            {
                Id = 3,
                Quantity = 10000,
                LatestPrice = 75,
                SpecieId = 3
            });
        }

        public DbSet<SpeciesModel> Species { get; set; }
        public DbSet<FishStockModel> FishStocks { get; set; }
    }
}
