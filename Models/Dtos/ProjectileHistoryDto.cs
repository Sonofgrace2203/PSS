namespace pss.Models.Dtos;

public sealed class ProjectileHistoryDto
{
    public Guid SimulationId { get; set; }
    public string? Name { get; set; }
    public string ModuleId { get; set; } = string.Empty;
    public DateTime CreatedAtUtc { get; set; }
    public double Range { get; set; }
    public double MaximumHeight { get; set; }
}