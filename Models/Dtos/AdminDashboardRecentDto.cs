namespace pss.Models.Dtos;

public sealed class AdminDashboardRecentDto
{
    public Guid SimulationId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ModuleId { get; set; } = string.Empty;
    public string ModuleTitle { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; }

    public string? UserId { get; set; }
    public string? UserName { get; set; }
    public string? UserEmail { get; set; }
}