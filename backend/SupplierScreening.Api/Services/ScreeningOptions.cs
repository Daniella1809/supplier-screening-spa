namespace SupplierScreening.Api.Services;

public class ScreeningOptions
{
    public const string SectionName = "Screening";
    
    public string ApiBaseUrl { get; set; } = string.Empty;
    public string ApiKey { get; set; } = string.Empty;
}
