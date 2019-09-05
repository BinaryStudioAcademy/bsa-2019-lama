using Microsoft.EntityFrameworkCore.Migrations;

namespace Lama.DataAccess.Migrations
{
    public partial class locationID : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "LocationId",
                table: "Photos",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Photos_LocationId",
                table: "Photos",
                column: "LocationId");

            migrationBuilder.AddForeignKey(
                name: "FK_Photos_Locations_LocationId",
                table: "Photos",
                column: "LocationId",
                principalTable: "Locations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Photos_Locations_LocationId",
                table: "Photos");

            migrationBuilder.DropIndex(
                name: "IX_Photos_LocationId",
                table: "Photos");

            migrationBuilder.DropColumn(
                name: "LocationId",
                table: "Photos");
        }
    }
}
