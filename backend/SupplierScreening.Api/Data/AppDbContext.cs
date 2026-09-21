using Microsoft.EntityFrameworkCore;
using SupplierScreening.Api.Models;

namespace SupplierScreening.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Supplier> Suppliers => Set<Supplier>();
    public DbSet<Country> Countries => Set<Country>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Country>(entity =>
        {
            entity.HasKey(c => c.Code);
            entity.Property(c => c.Code).HasMaxLength(2).IsRequired();
            entity.Property(c => c.Name).HasMaxLength(100).IsRequired();
        });

        modelBuilder.Entity<Supplier>(entity =>
        {
            entity.HasKey(s => s.Id);
            entity.Property(s => s.LegalName).HasMaxLength(250).IsRequired();
            entity.Property(s => s.CommercialName).HasMaxLength(250).IsRequired();
            entity.Property(s => s.TaxId).HasMaxLength(11).IsRequired();
            entity.Property(s => s.Phone).HasMaxLength(30).IsRequired();
            entity.Property(s => s.Email).HasMaxLength(200).IsRequired();
            entity.Property(s => s.Website).HasMaxLength(300);
            entity.Property(s => s.Address).HasMaxLength(500).IsRequired();
            entity.Property(s => s.CountryCode).HasMaxLength(2).IsRequired();
            entity.Property(s => s.AnnualRevenue).HasColumnType("decimal(18,2)");
            entity.Property(s => s.LastEditedAt).IsRequired();
            entity.Property(s => s.CreatedAt).IsRequired();

            entity.HasIndex(s => s.TaxId).IsUnique();
            entity.HasIndex(s => s.LastEditedAt);

            entity.HasOne<Country>()
                  .WithMany()
                  .HasForeignKey(s => s.CountryCode)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        SeedData(modelBuilder);
    }

    private static void SeedData(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Country>().HasData(
            new Country { Code = "US", Name = "Estados Unidos" },
            new Country { Code = "PE", Name = "Perú" },
            new Country { Code = "EC", Name = "Ecuador" },
            new Country { Code = "CO", Name = "Colombia" },
            new Country { Code = "MX", Name = "México" },
            new Country { Code = "AR", Name = "Argentina" },
            new Country { Code = "CL", Name = "Chile" },
            new Country { Code = "BR", Name = "Brasil" },
            new Country { Code = "ES", Name = "España" },
            new Country { Code = "CU", Name = "Cuba" },
            new Country { Code = "VE", Name = "Venezuela" },
            new Country { Code = "PA", Name = "Panamá" },
            new Country { Code = "GB", Name = "Reino Unido" },
            new Country { Code = "DE", Name = "Alemania" },
            new Country { Code = "FR", Name = "Francia" },
            new Country { Code = "CN", Name = "China" },
            new Country { Code = "RU", Name = "Rusia" },
            new Country { Code = "IR", Name = "Irán" }
        );

        var seedDate = new DateTime(2026, 1, 15, 12, 0, 0, DateTimeKind.Utc);

        modelBuilder.Entity<Supplier>().HasData(
            new Supplier
            {
                Id = 1,
                LegalName = "Comercializadora Andina S.A.C.",
                CommercialName = "Andina Trade",
                TaxId = "20123456789",
                Phone = "+51 1 4567890",
                Email = "contacto@andinatrade.com",
                Website = "https://www.andinatrade.com",
                Address = "Av. Javier Prado 1234, San Isidro, Lima",
                CountryCode = "PE",
                AnnualRevenue = 2500000.00m,
                CreatedAt = seedDate,
                LastEditedAt = seedDate
            },
            new Supplier
            {
                Id = 2,
                LegalName = "Global Logistics Corporation",
                CommercialName = "GlobalLog",
                TaxId = "98765432101",
                Phone = "+1 305 5551234",
                Email = "info@globallog.com",
                Website = "https://www.globallog.com",
                Address = "1200 Brickell Ave, Miami, FL",
                CountryCode = "US",
                AnnualRevenue = 14750000.50m,
                CreatedAt = seedDate.AddDays(1),
                LastEditedAt = seedDate.AddDays(1)
            },
            new Supplier
            {
                Id = 3,
                LegalName = "Amistur Cuba S.A.",
                CommercialName = "Amistur",
                TaxId = "11223344556",
                Phone = "+53 7 8320000",
                Email = "ventas@amistur.cu",
                Website = "https://www.amistur.cu",
                Address = "Calle 13 #504 e/ D y E, Vedado, La Habana",
                CountryCode = "CU",
                AnnualRevenue = 850000.00m,
                CreatedAt = seedDate.AddDays(2),
                LastEditedAt = seedDate.AddDays(2)
            }
        );
    }
}
