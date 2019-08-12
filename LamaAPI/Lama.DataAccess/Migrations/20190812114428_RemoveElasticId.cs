using Microsoft.EntityFrameworkCore.Migrations;

namespace Lama.DataAccess.Migrations
{
    public partial class RemoveElasticId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ElasticId",
                table: "Photos");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ElasticId",
                table: "Photos",
                nullable: false,
                defaultValue: 0);
        }
    }
}
