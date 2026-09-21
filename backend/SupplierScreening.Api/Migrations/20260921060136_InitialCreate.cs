using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace SupplierScreening.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Countries",
                columns: table => new
                {
                    Code = table.Column<string>(type: "nvarchar(2)", maxLength: 2, nullable: false),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Countries", x => x.Code);
                });

            migrationBuilder.CreateTable(
                name: "Suppliers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    LegalName = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    CommercialName = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    TaxId = table.Column<string>(type: "nvarchar(11)", maxLength: 11, nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Website = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true),
                    Address = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    CountryCode = table.Column<string>(type: "nvarchar(2)", maxLength: 2, nullable: false),
                    AnnualRevenue = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    LastEditedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Suppliers", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Suppliers_Countries_CountryCode",
                        column: x => x.CountryCode,
                        principalTable: "Countries",
                        principalColumn: "Code",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "Countries",
                columns: new[] { "Code", "Name" },
                values: new object[,]
                {
                    { "AR", "Argentina" },
                    { "BR", "Brasil" },
                    { "CL", "Chile" },
                    { "CN", "China" },
                    { "CO", "Colombia" },
                    { "CU", "Cuba" },
                    { "DE", "Alemania" },
                    { "EC", "Ecuador" },
                    { "ES", "España" },
                    { "FR", "Francia" },
                    { "GB", "Reino Unido" },
                    { "IR", "Irán" },
                    { "MX", "México" },
                    { "PA", "Panamá" },
                    { "PE", "Perú" },
                    { "RU", "Rusia" },
                    { "US", "Estados Unidos" },
                    { "VE", "Venezuela" }
                });

            migrationBuilder.InsertData(
                table: "Suppliers",
                columns: new[] { "Id", "Address", "AnnualRevenue", "CommercialName", "CountryCode", "CreatedAt", "Email", "LastEditedAt", "LegalName", "Phone", "TaxId", "Website" },
                values: new object[,]
                {
                    { 1, "Av. Javier Prado 1234, San Isidro, Lima", 2500000.00m, "Andina Trade", "PE", new DateTime(2026, 1, 15, 12, 0, 0, 0, DateTimeKind.Utc), "contacto@andinatrade.com", new DateTime(2026, 1, 15, 12, 0, 0, 0, DateTimeKind.Utc), "Comercializadora Andina S.A.C.", "+51 1 4567890", "20123456789", "https://www.andinatrade.com" },
                    { 2, "1200 Brickell Ave, Miami, FL", 14750000.50m, "GlobalLog", "US", new DateTime(2026, 1, 16, 12, 0, 0, 0, DateTimeKind.Utc), "info@globallog.com", new DateTime(2026, 1, 16, 12, 0, 0, 0, DateTimeKind.Utc), "Global Logistics Corporation", "+1 305 5551234", "98765432101", "https://www.globallog.com" },
                    { 3, "Calle 13 #504 e/ D y E, Vedado, La Habana", 850000.00m, "Amistur", "CU", new DateTime(2026, 1, 17, 12, 0, 0, 0, DateTimeKind.Utc), "ventas@amistur.cu", new DateTime(2026, 1, 17, 12, 0, 0, 0, DateTimeKind.Utc), "Amistur Cuba S.A.", "+53 7 8320000", "11223344556", "https://www.amistur.cu" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Suppliers_CountryCode",
                table: "Suppliers",
                column: "CountryCode");

            migrationBuilder.CreateIndex(
                name: "IX_Suppliers_LastEditedAt",
                table: "Suppliers",
                column: "LastEditedAt");

            migrationBuilder.CreateIndex(
                name: "IX_Suppliers_TaxId",
                table: "Suppliers",
                column: "TaxId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Suppliers");

            migrationBuilder.DropTable(
                name: "Countries");
        }
    }
}
