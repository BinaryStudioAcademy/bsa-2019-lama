using Microsoft.EntityFrameworkCore.Migrations;

namespace Lama.DataAccess.Migrations
{
    public partial class NotificationPayload : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Photos_Notifications_NotificationId",
                table: "Photos");

            migrationBuilder.DropIndex(
                name: "IX_Photos_NotificationId",
                table: "Photos");

            migrationBuilder.DropColumn(
                name: "NotificationId",
                table: "Photos");

            migrationBuilder.AddColumn<string>(
                name: "Payload",
                table: "Notifications",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Payload",
                table: "Notifications");

            migrationBuilder.AddColumn<int>(
                name: "NotificationId",
                table: "Photos",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Photos_NotificationId",
                table: "Photos",
                column: "NotificationId");

            migrationBuilder.AddForeignKey(
                name: "FK_Photos_Notifications_NotificationId",
                table: "Photos",
                column: "NotificationId",
                principalTable: "Notifications",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
