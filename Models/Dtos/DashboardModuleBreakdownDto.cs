namespace pss.Models.Dtos;

public sealed class DashboardModuleBreakdownDto
{
    public string ModuleId { get; set; } = string.Empty;
    public string ModuleTitle { get; set; } = string.Empty;
    public int Count { get; set; }
}