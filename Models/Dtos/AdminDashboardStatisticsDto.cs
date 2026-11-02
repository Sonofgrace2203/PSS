namespace pss.Models.Dtos;

public sealed class AdminDashboardStatisticsDto
{
    public string Period { get; set; } = "week";
    public int TotalUsers { get; set; }
    public int ActiveUsers { get; set; }
    public int TotalSimulations { get; set; }
    public int SimulationsInPeriod { get; set; }

    public List<DashboardDailyActivityDto> DailyActivity { get; set; } = new();

    public List<DashboardModuleBreakdownDto> ModuleBreakdown { get; set; } = new();
}