namespace pss.Models.Dtos;

public sealed class DashboardRecentDto
{
    public Guid SimulationId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ModuleId { get; set; } = string.Empty;
    public string ModuleTitle { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; }
}