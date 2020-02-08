using Microsoft.AspNetCore.Mvc;
using FishMarket.Models;
using FishMarket.Services;

namespace FishMarket.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FishMarketController : ControllerBase
    {
        private readonly FishMarketService fishMarketService;

        public FishMarketController(FishMarketService fishMarketService)
        {
            this.fishMarketService = fishMarketService;
        }

        [HttpGet("[action]")]
        public IActionResult Search([FromQuery]string term = null, [FromQuery]int limit = 10, [FromQuery]int offset = 0)
        {
            return Json(fishMarketService.Search(term, limit, offset));
        }


        [HttpPost("[action]")]
        public IActionResult CreateSellOrder([FromBody]SellOrderModel sellOrder)
        {
            return Json(fishMarketService.AddSellOrder(sellOrder));
        }

        [HttpPost("[action]")]
        public IActionResult CreateBuyOrder([FromBody]BuyOrderModel buyOrder)
        {
            return Json(fishMarketService.AddBuyOrder(buyOrder));
        }
    }
}
