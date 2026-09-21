using System.Text.Json.Serialization;

namespace SupplierScreening.Api.Models;

/// <summary>
/// Fuente de screening disponible para el cruce con listas de alto riesgo.
/// </summary>
public class ScreeningSource
{
    public string Key { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public bool Available { get; set; } = true;
}

/// <summary>
/// Resultado individual devuelto por la fuente de screening.
/// </summary>
public class ScreeningHit
{
    public string Name { get; set; } = string.Empty;
    public Dictionary<string, string> Attributes { get; set; } = new();
}

/// <summary>
/// Resultado del cruce de una entidad contra una fuente.
/// </summary>
public class SourceScreeningResult
{
    public string Source { get; set; } = string.Empty;
    public string SourceDisplayName { get; set; } = string.Empty;
    public string Query { get; set; } = string.Empty;
    public int Hits { get; set; }
    public List<ScreeningHit> Results { get; set; } = new();
    public string? Error { get; set; }
}

/// <summary>
/// Respuesta completa del screening de un proveedor contra una o más fuentes.
/// </summary>
public class ScreeningResponse
{
    public int SupplierId { get; set; }
    public string EntityName { get; set; } = string.Empty;
    public DateTime RetrievedAtUtc { get; set; }
    public List<SourceScreeningResult> Sources { get; set; } = new();
}

// --- Modelos para deserializar la respuesta de la API OFAC externa ---

public class OfacApiResponse
{
    [JsonPropertyName("source")]
    public string Source { get; set; } = string.Empty;

    [JsonPropertyName("query")]
    public string Query { get; set; } = string.Empty;

    [JsonPropertyName("hits")]
    public int Hits { get; set; }

    [JsonPropertyName("results")]
    public List<OfacApiResult> Results { get; set; } = new();
}

public class OfacApiResult
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("attributes")]
    public Dictionary<string, string> Attributes { get; set; } = new();
}
