using Microsoft.EntityFrameworkCore.Migrations;

namespace Lama.DataAccess.Migrations
{
    public partial class notificationSender : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "SendedId",
                table: "Notifications",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SenderId",
                table: "Notifications",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_SendedId",
                table: "Notifications",
                column: "SendedId");

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_Users_SendedId",
                table: "Notifications",
                column: "SendedId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_Users_SendedId",
                table: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_Notifications_SendedId",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "SendedId",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "SenderId",
                table: "Notifications");
        }
    }
}
