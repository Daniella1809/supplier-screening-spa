using System.Text.Json;
using Microsoft.Extensions.Options;
using SupplierScreening.Api.Models;

namespace SupplierScreening.Api.Services;

public class ScreeningService : IScreeningService
{
    private readonly HttpClient _httpClient;
    private readonly ScreeningOptions _options;
    private readonly ILogger<ScreeningService> _logger;

    private static readonly JsonSerializerOptions JsonOpts = new()
    {
        PropertyNameCaseInsensitive = true
    };

    private static readonly ScreeningSource[] AllSources =
    {
        new() { Key = "ofac", DisplayName = "OFAC - Sanctions List Search (EE.UU.)", Available = true },
        new() { Key = "worldbank", DisplayName = "World Bank - Listed Firms", Available = false },
        new() { Key = "offshoreleaks", DisplayName = "ICIJ Offshore Leaks", Available = false }
    };

    public ScreeningService(HttpClient httpClient, IOptions<ScreeningOptions> options, ILogger<ScreeningService> logger)
    {
        _httpClient = httpClient;
        _options = options.Value;
        _logger = logger;
    }

    public IReadOnlyList<ScreeningSource> GetSources() => AllSources;

    public async Task<ScreeningResponse> ScreenAsync(int supplierId, string entityName, IEnumerable<string> sourceKeys, CancellationToken ct = default)
    {
        var response = new ScreeningResponse
        {
            SupplierId = supplierId,
            EntityName = entityName,
            RetrievedAtUtc = DateTime.UtcNow
        };

        var requested = sourceKeys
            .Select(s => s?.Trim().ToLowerInvariant())
            .Where(s => !string.IsNullOrWhiteSpace(s))
            .Distinct()
            .Take(3)
            .ToList();

        if (requested.Count == 0)
        {
            requested.Add("ofac");
        }

        foreach (var key in requested)
        {
            var meta = AllSources.FirstOrDefault(s => s.Key == key);
            var result = new SourceScreeningResult
            {
                Source = key!,
                SourceDisplayName = meta?.DisplayName ?? key!,
                Query = entityName
            };

            if (meta is null)
            {
                result.Error = $"La fuente '{key}' no existe.";
                response.Sources.Add(result);
                continue;
            }

            if (!meta.Available)
            {
                result.Error = "Fuente no disponible actualmente (sin acceso público confiable).";
                response.Sources.Add(result);
                continue;
            }

            try
            {
                var apiResult = await QueryOfacAsync(entityName, key!, ct);
                result.Hits = apiResult.Hits;
                result.Results = apiResult.Results
                    .Select(r => new ScreeningHit { Name = r.Name, Attributes = r.Attributes })
                    .ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error consultando la fuente {Source} para '{Entity}'", key, entityName);
                result.Error = "No se pudo obtener respuesta de la fuente de screening.";
            }

            response.Sources.Add(result);
        }

        return response;
    }

    private async Task<OfacApiResponse> QueryOfacAsync(string entityName, string source, CancellationToken ct)
    {
        var url = $"{_options.ApiBaseUrl.TrimEnd('/')}/api/search?name={Uri.EscapeDataString(entityName)}&source={Uri.EscapeDataString(source)}";

        using var request = new HttpRequestMessage(HttpMethod.Get, url);
        if (!string.IsNullOrWhiteSpace(_options.ApiKey))
        {
            request.Headers.Add("X-API-Key", _options.ApiKey);
        }

        using var httpResponse = await _httpClient.SendAsync(request, ct);
        httpResponse.EnsureSuccessStatusCode();

        var json = await httpResponse.Content.ReadAsStringAsync(ct);
        var parsed = JsonSerializer.Deserialize<OfacApiResponse>(json, JsonOpts);
        return parsed ?? new OfacApiResponse { Source = source, Query = entityName };
    }
}
