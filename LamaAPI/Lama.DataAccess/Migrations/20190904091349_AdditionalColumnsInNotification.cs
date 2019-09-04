using Microsoft.EntityFrameworkCore.Migrations;

namespace Lama.DataAccess.Migrations
{
    public partial class AdditionalColumnsInNotification : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "Notifications",
                nullable: true,
                oldClrType: typeof(int));

            migrationBuilder.AddColumn<int>(
                name: "Activity",
                table: "Notifications",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Payload",
                table: "Notifications",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Activity",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "Payload",
                table: "Notifications");

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "Notifications",
                nullable: false,
                oldClrType: typeof(int),
                oldNullable: true);
        }
    }
}
