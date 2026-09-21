using SupplierScreening.Api.Models;

namespace SupplierScreening.Api.Services;

public interface IScreeningService
{
    /// <summary>Devuelve las fuentes de screening disponibles.</summary>
    IReadOnlyList<ScreeningSource> GetSources();

    /// <summary>
    /// Ejecuta el cruce del nombre de una entidad contra una o más fuentes (1 a 3).
    /// </summary>
    Task<ScreeningResponse> ScreenAsync(int supplierId, string entityName, IEnumerable<string> sourceKeys, CancellationToken ct = default);
}
