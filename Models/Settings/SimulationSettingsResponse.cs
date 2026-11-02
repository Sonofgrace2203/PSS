namespace pss.Models.Settings
{
    public sealed class SimulationSettingsResponse
    {
        public double Gravity { get; set; } = 9.81;
        public double MaximumSimulationTime { get; set; } = 100;
        public int MaximumDataPoints { get; set; } = 10000;
        public double DefaultTimeStep { get; set; } = 0.05;
        public DateTime UpdatedAtUtc { get; set; }
    }
}