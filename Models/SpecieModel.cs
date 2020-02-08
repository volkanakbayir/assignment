using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FishMarket.Models
{
    public class SpecieModel
    {
        public int? Id { get; set; }
        public string Name { get; set; }
        public string ImageSrc { get; set; }

        public SpecieModel()
        {

        }

        public SpecieModel(string name, string imageSrc, int id)
        {
            Name = name;
            ImageSrc = imageSrc;
            Id = id;
        }

        public SpecieModel(string name, string imageSrc)
        {
            Name = name;
            ImageSrc = imageSrc;
        }
    }
}
