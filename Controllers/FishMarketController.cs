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
        public IActionResult Search([FromQuery]string term = null)
        {
            return Json(fishMarketService.Search(term));
        }
    }
}
