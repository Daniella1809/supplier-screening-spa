namespace SupplierScreening.Api.Models;

public class Supplier
{
    public int Id { get; set; }
    public string LegalName { get; set; } = string.Empty;
    public string CommercialName { get; set; } = string.Empty;
    public string TaxId { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Website { get; set; }
    public string Address { get; set; } = string.Empty;
    public string CountryCode { get; set; } = string.Empty;
    public decimal AnnualRevenue { get; set; }
    public DateTime LastEditedAt { get; set; }
    public DateTime CreatedAt { get; set; }
}
