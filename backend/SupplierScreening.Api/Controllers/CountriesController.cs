using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SupplierScreening.Api.Data;

namespace SupplierScreening.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class CountriesController : ControllerBase
{
    private readonly AppDbContext _db;

    public CountriesController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct = default)
    {
        var countries = await _db.Countries
            .AsNoTracking()
            .OrderBy(c => c.Name)
            .Select(c => new { c.Code, c.Name })
            .ToListAsync(ct);

        return Ok(countries);
    }
}
