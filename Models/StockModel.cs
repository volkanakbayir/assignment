namespace FishMarket.Models
{
    public class FishStockModel
    {
        public int? Id { get; set; }
        public double Quantity { get; set; }
        public double LatestPrice { get; set; }
        public int SpecieId { get; set; }
        public SpecieModel Specie { get; set; }

        public FishStockModel()
        {

        }

        public FishStockModel(SpecieModel specie, double quantity, double latestPrice, int id)
        {
            Id = id;
            Specie = specie;
            Quantity = quantity;
            LatestPrice = latestPrice;
        }

        public FishStockModel(SpecieModel specie, double quantity, double latestPrice)
        {
            Specie = specie;
            Quantity = quantity;
            LatestPrice = latestPrice;
        }
       
    }
}
