using System.ComponentModel.DataAnnotations;

namespace SupplierScreening.Api.Dtos;

public class SupplierInputDto
{
    [Required(ErrorMessage = "La razón social es obligatoria.")]
    [StringLength(250, MinimumLength = 2, ErrorMessage = "La razón social debe tener entre 2 y 250 caracteres.")]
    public string LegalName { get; set; } = string.Empty;

    [Required(ErrorMessage = "El nombre comercial es obligatorio.")]
    [StringLength(250, MinimumLength = 2, ErrorMessage = "El nombre comercial debe tener entre 2 y 250 caracteres.")]
    public string CommercialName { get; set; } = string.Empty;

    [Required(ErrorMessage = "La identificación tributaria es obligatoria.")]
    [RegularExpression(@"^\d{11}$", ErrorMessage = "La identificación tributaria debe tener exactamente 11 dígitos numéricos.")]
    public string TaxId { get; set; } = string.Empty;

    [Required(ErrorMessage = "El número telefónico es obligatorio.")]
    [Phone(ErrorMessage = "El número telefónico no tiene un formato válido.")]
    [StringLength(30, ErrorMessage = "El número telefónico no puede superar los 30 caracteres.")]
    public string Phone { get; set; } = string.Empty;

    [Required(ErrorMessage = "El correo electrónico es obligatorio.")]
    [EmailAddress(ErrorMessage = "El correo electrónico no tiene un formato válido.")]
    [StringLength(200, ErrorMessage = "El correo electrónico no puede superar los 200 caracteres.")]
    public string Email { get; set; } = string.Empty;

    [Url(ErrorMessage = "El sitio web debe ser una URL válida (ej. https://ejemplo.com).")]
    [StringLength(300, ErrorMessage = "El sitio web no puede superar los 300 caracteres.")]
    public string? Website { get; set; }

    [Required(ErrorMessage = "La dirección física es obligatoria.")]
    [StringLength(500, MinimumLength = 3, ErrorMessage = "La dirección debe tener entre 3 y 500 caracteres.")]
    public string Address { get; set; } = string.Empty;

    [Required(ErrorMessage = "El país es obligatorio.")]
    [StringLength(2, MinimumLength = 2, ErrorMessage = "El país debe indicarse con su código de 2 letras.")]
    public string CountryCode { get; set; } = string.Empty;

    [Required(ErrorMessage = "La facturación anual es obligatoria.")]
    [Range(0, 999999999999.99, ErrorMessage = "La facturación anual debe ser un valor positivo.")]
    public decimal AnnualRevenue { get; set; }
}

public class SupplierDto
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
    public string? CountryName { get; set; }
    public decimal AnnualRevenue { get; set; }
    public DateTime LastEditedAt { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class PagedResult<T>
{
    public IEnumerable<T> Items { get; set; } = Enumerable.Empty<T>();
    public int Total { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
}
