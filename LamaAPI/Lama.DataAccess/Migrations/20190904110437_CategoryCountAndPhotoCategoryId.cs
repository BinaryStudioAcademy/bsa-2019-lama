using Microsoft.EntityFrameworkCore.Migrations;

namespace Lama.DataAccess.Migrations
{
    public partial class CategoryCountAndPhotoCategoryId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CategoryId",
                table: "Photos",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Count",
                table: "Categories",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "Photos");

            migrationBuilder.DropColumn(
                name: "Count",
                table: "Categories");
        }
    }
}
