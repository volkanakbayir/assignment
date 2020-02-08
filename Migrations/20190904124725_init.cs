using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace FishMarket.Migrations
{
    public partial class init : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Species",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(nullable: true),
                    ImageSrc = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Species", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FishStocks",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Quantity = table.Column<double>(nullable: false),
                    LatestPrice = table.Column<double>(nullable: false),
                    SpecieId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FishStocks", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FishStocks_Species_SpecieId",
                        column: x => x.SpecieId,
                        principalTable: "Species",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Species",
                columns: new[] { "Id", "ImageSrc", "Name" },
                values: new object[] { 1, "https://media.istockphoto.com/photos/three-fresh-seabass-fish-on-plate-picture-id466288735", "Seabass" });

            migrationBuilder.InsertData(
                table: "Species",
                columns: new[] { "Id", "ImageSrc", "Name" },
                values: new object[] { 2, "https://media.istockphoto.com/photos/three-fresh-seabass-fish-on-plate-picture-id466288735", "Perch" });

            migrationBuilder.InsertData(
                table: "Species",
                columns: new[] { "Id", "ImageSrc", "Name" },
                values: new object[] { 3, "https://5.imimg.com/data5/YA/LX/MY-8948116/tuna-fish-500x500.jpg", "Tuna" });

            migrationBuilder.InsertData(
                table: "FishStocks",
                columns: new[] { "Id", "LatestPrice", "Quantity", "SpecieId" },
                values: new object[] { 1, 10.0, 10000.0, 1 });

            migrationBuilder.InsertData(
                table: "FishStocks",
                columns: new[] { "Id", "LatestPrice", "Quantity", "SpecieId" },
                values: new object[] { 2, 25.0, 20000.0, 2 });

            migrationBuilder.InsertData(
                table: "FishStocks",
                columns: new[] { "Id", "LatestPrice", "Quantity", "SpecieId" },
                values: new object[] { 3, 75.0, 10000.0, 3 });

            migrationBuilder.CreateIndex(
                name: "IX_FishStocks_SpecieId",
                table: "FishStocks",
                column: "SpecieId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FishStocks");

            migrationBuilder.DropTable(
                name: "Species");
        }
    }
}
