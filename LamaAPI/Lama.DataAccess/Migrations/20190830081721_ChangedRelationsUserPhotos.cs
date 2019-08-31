using Microsoft.EntityFrameworkCore.Migrations;

namespace Lama.DataAccess.Migrations
{
    public partial class ChangedRelationsUserPhotos : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Photos_AvatarId",
                table: "Users");

            migrationBuilder.DropIndex(
                name: "IX_Users_AvatarId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "AvatarId",
                table: "Users");

            migrationBuilder.AddColumn<string>(
                name: "AvatarUrl",
                table: "Users",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "Photos",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Photos_UserId",
                table: "Photos",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Photos_Users_UserId",
                table: "Photos",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Photos_Users_UserId",
                table: "Photos");

            migrationBuilder.DropIndex(
                name: "IX_Photos_UserId",
                table: "Photos");

            migrationBuilder.DropColumn(
                name: "AvatarUrl",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Photos");

            migrationBuilder.AddColumn<int>(
                name: "AvatarId",
                table: "Users",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_AvatarId",
                table: "Users",
                column: "AvatarId",
                unique: true,
                filter: "[AvatarId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Photos_AvatarId",
                table: "Users",
                column: "AvatarId",
                principalTable: "Photos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
