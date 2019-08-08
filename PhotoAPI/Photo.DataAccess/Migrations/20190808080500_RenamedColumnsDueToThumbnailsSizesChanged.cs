using Microsoft.EntityFrameworkCore.Migrations;

namespace Photo.DataAccess.Migrations
{
    public partial class RenamedColumnsDueToThumbnailsSizesChanged : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Blob32Id",
                table: "Photos",
                newName: "Blob64Id");

            migrationBuilder.RenameColumn(
                name: "Blob16Id",
                table: "Photos",
                newName: "Blob256Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Blob64Id",
                table: "Photos",
                newName: "Blob32Id");

            migrationBuilder.RenameColumn(
                name: "Blob256Id",
                table: "Photos",
                newName: "Blob16Id");
        }
    }
}
