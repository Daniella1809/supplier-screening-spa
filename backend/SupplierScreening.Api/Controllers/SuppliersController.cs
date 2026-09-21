using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SupplierScreening.Api.Data;
using SupplierScreening.Api.Dtos;
using SupplierScreening.Api.Models;
using SupplierScreening.Api.Services;

namespace SupplierScreening.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class SuppliersController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IScreeningService _screening;

    public SuppliersController(AppDbContext db, IScreeningService screening)
    {
        _db = db;
        _screening = screening;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResult<SupplierDto>>> GetAll(
        [FromQuery] string? search = null,
        [FromQuery] string sortBy = "lastEditedAt",
        [FromQuery] string sortDir = "desc",
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10,
        CancellationToken ct = default)
    {
        if (page < 1) page = 1;
        if (pageSize < 1 || pageSize > 100) pageSize = 10;

        var query = _db.Suppliers.AsNoTracking()
            .Join(_db.Countries, s => s.CountryCode, c => c.Code, (s, c) => new { Supplier = s, Country = c })
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLowerInvariant();
            query = query.Where(sc =>
                sc.Supplier.LegalName.ToLower().Contains(term) ||
                sc.Supplier.CommercialName.ToLower().Contains(term) ||
                sc.Supplier.TaxId.ToLower().Contains(term) ||
                sc.Supplier.Email.ToLower().Contains(term) ||
                sc.Supplier.Phone.ToLower().Contains(term) ||
                sc.Supplier.Address.ToLower().Contains(term) ||
                sc.Supplier.CountryCode.ToLower().Contains(term) ||
                sc.Country.Name.ToLower().Contains(term));
        }

        var descending = !string.Equals(sortDir, "asc", StringComparison.OrdinalIgnoreCase);

        query = sortBy.ToLowerInvariant() switch
        {
            "legalname" => descending ? query.OrderByDescending(sc => sc.Supplier.LegalName) : query.OrderBy(sc => sc.Supplier.LegalName),
            "commercialname" => descending ? query.OrderByDescending(sc => sc.Supplier.CommercialName) : query.OrderBy(sc => sc.Supplier.CommercialName),
            "annualrevenue" => descending ? query.OrderByDescending(sc => sc.Supplier.AnnualRevenue) : query.OrderBy(sc => sc.Supplier.AnnualRevenue),
            "countrycode" => descending ? query.OrderByDescending(sc => sc.Supplier.CountryCode) : query.OrderBy(sc => sc.Supplier.CountryCode),
            "createdat" => descending ? query.OrderByDescending(sc => sc.Supplier.CreatedAt) : query.OrderBy(sc => sc.Supplier.CreatedAt),
            _ => descending ? query.OrderByDescending(sc => sc.Supplier.LastEditedAt) : query.OrderBy(sc => sc.Supplier.LastEditedAt)
        };

        var total = await query.CountAsync(ct);

        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(sc => new SupplierDto
            {
                Id = sc.Supplier.Id,
                LegalName = sc.Supplier.LegalName,
                CommercialName = sc.Supplier.CommercialName,
                TaxId = sc.Supplier.TaxId,
                Phone = sc.Supplier.Phone,
                Email = sc.Supplier.Email,
                Website = sc.Supplier.Website,
                Address = sc.Supplier.Address,
                CountryCode = sc.Supplier.CountryCode,
                CountryName = sc.Country.Name,
                AnnualRevenue = sc.Supplier.AnnualRevenue,
                LastEditedAt = sc.Supplier.LastEditedAt,
                CreatedAt = sc.Supplier.CreatedAt
            })
            .ToListAsync(ct);

        return Ok(new PagedResult<SupplierDto>
        {
            Items = items,
            Total = total,
            Page = page,
            PageSize = pageSize
        });
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<SupplierDto>> GetById(int id, CancellationToken ct = default)
    {
        var dto = await MapToDto(id, ct);
        if (dto is null)
            return NotFound(new { message = $"No se encontró el proveedor con id {id}." });

        return Ok(dto);
    }

    [HttpPost]
    public async Task<ActionResult<SupplierDto>> Create([FromBody] SupplierInputDto input, CancellationToken ct = default)
    {
        var validationError = await ValidateBusinessRules(input, null, ct);
        if (validationError is not null)
            return BadRequest(validationError);

        var now = DateTime.UtcNow;
        var supplier = new Supplier
        {
            LegalName = input.LegalName.Trim(),
            CommercialName = input.CommercialName.Trim(),
            TaxId = input.TaxId.Trim(),
            Phone = input.Phone.Trim(),
            Email = input.Email.Trim(),
            Website = string.IsNullOrWhiteSpace(input.Website) ? null : input.Website.Trim(),
            Address = input.Address.Trim(),
            CountryCode = input.CountryCode.Trim().ToUpperInvariant(),
            AnnualRevenue = input.AnnualRevenue,
            CreatedAt = now,
            LastEditedAt = now
        };

        _db.Suppliers.Add(supplier);
        await _db.SaveChangesAsync(ct);

        var dto = await MapToDto(supplier.Id, ct);
        return CreatedAtAction(nameof(GetById), new { id = supplier.Id }, dto);
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<SupplierDto>> Update(int id, [FromBody] SupplierInputDto input, CancellationToken ct = default)
    {
        var supplier = await _db.Suppliers.FirstOrDefaultAsync(s => s.Id == id, ct);
        if (supplier is null)
            return NotFound(new { message = $"No se encontró el proveedor con id {id}." });

        var validationError = await ValidateBusinessRules(input, id, ct);
        if (validationError is not null)
            return BadRequest(validationError);

        supplier.LegalName = input.LegalName.Trim();
        supplier.CommercialName = input.CommercialName.Trim();
        supplier.TaxId = input.TaxId.Trim();
        supplier.Phone = input.Phone.Trim();
        supplier.Email = input.Email.Trim();
        supplier.Website = string.IsNullOrWhiteSpace(input.Website) ? null : input.Website.Trim();
        supplier.Address = input.Address.Trim();
        supplier.CountryCode = input.CountryCode.Trim().ToUpperInvariant();
        supplier.AnnualRevenue = input.AnnualRevenue;
        supplier.LastEditedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync(ct);

        var dto = await MapToDto(supplier.Id, ct);
        return Ok(dto);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken ct = default)
    {
        var supplier = await _db.Suppliers.FirstOrDefaultAsync(s => s.Id == id, ct);
        if (supplier is null)
            return NotFound(new { message = $"No se encontró el proveedor con id {id}." });

        _db.Suppliers.Remove(supplier);
        await _db.SaveChangesAsync(ct);

        return NoContent();
    }

    [HttpGet("{id:int}/screening")]
    public async Task<ActionResult<ScreeningResponse>> Screening(
        int id,
        [FromQuery] string? sources = null,
        CancellationToken ct = default)
    {
        var supplier = await _db.Suppliers.AsNoTracking().FirstOrDefaultAsync(s => s.Id == id, ct);
        if (supplier is null)
            return NotFound(new { message = $"No se encontró el proveedor con id {id}." });

        var sourceKeys = (sources ?? "ofac")
            .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

        var result = await _screening.ScreenAsync(supplier.Id, supplier.LegalName, sourceKeys, ct);
        return Ok(result);
    }

    private async Task<SupplierDto?> MapToDto(int id, CancellationToken ct)
    {
        return await _db.Suppliers.AsNoTracking()
            .Where(s => s.Id == id)
            .Join(_db.Countries, s => s.CountryCode, c => c.Code, (s, c) => new SupplierDto
            {
                Id = s.Id,
                LegalName = s.LegalName,
                CommercialName = s.CommercialName,
                TaxId = s.TaxId,
                Phone = s.Phone,
                Email = s.Email,
                Website = s.Website,
                Address = s.Address,
                CountryCode = s.CountryCode,
                CountryName = c.Name,
                AnnualRevenue = s.AnnualRevenue,
                LastEditedAt = s.LastEditedAt,
                CreatedAt = s.CreatedAt
            })
            .FirstOrDefaultAsync(ct);
    }

    private async Task<object?> ValidateBusinessRules(SupplierInputDto input, int? excludeId, CancellationToken ct)
    {
        var errors = new List<string>();

        var countryCode = input.CountryCode.Trim().ToUpperInvariant();
        var countryExists = await _db.Countries.AnyAsync(c => c.Code == countryCode, ct);
        if (!countryExists)
            errors.Add($"El país '{input.CountryCode}' no es válido. Seleccione un país de la lista.");

        var taxId = input.TaxId.Trim();
        var taxIdTaken = await _db.Suppliers.AnyAsync(s => s.TaxId == taxId && (excludeId == null || s.Id != excludeId), ct);
        if (taxIdTaken)
            errors.Add($"Ya existe un proveedor con la identificación tributaria '{taxId}'.");

        if (errors.Count == 0)
            return null;

        return new
        {
            message = "La solicitud contiene datos inválidos.",
            errors
        };
    }
}
