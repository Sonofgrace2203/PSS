namespace pss.Models.Dtos;

public sealed class DashboardModuleDto
{
    public Guid Id { get; set; }
    public string Slug { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public bool IsImplemented { get; set; }
    public int DisplayOrder { get; set; }
}