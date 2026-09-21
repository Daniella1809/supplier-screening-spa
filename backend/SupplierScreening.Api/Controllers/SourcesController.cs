using Microsoft.AspNetCore.Mvc;
using SupplierScreening.Api.Services;

namespace SupplierScreening.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class SourcesController : ControllerBase
{
    private readonly IScreeningService _screening;

    public SourcesController(IScreeningService screening)
    {
        _screening = screening;
    }

    [HttpGet]
    public IActionResult GetSources()
    {
        return Ok(_screening.GetSources());
    }
}
