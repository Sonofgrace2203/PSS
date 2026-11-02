namespace pss.Models.Dtos;

public sealed class DashboardDailyActivityDto
{
    public string Date { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public int Count { get; set; }
}