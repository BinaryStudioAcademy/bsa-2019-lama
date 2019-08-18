using Microsoft.EntityFrameworkCore.Migrations;

namespace Lama.DataAccess.Migrations
{
    public partial class AlbumCover : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Albums_CoverId",
                table: "Albums");

            migrationBuilder.CreateIndex(
                name: "IX_Albums_CoverId",
                table: "Albums",
                column: "CoverId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Albums_CoverId",
                table: "Albums");

            migrationBuilder.CreateIndex(
                name: "IX_Albums_CoverId",
                table: "Albums",
                column: "CoverId",
                unique: true,
                filter: "[CoverId] IS NOT NULL");
        }
    }
}
