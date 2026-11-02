
namespace pss.Models;

public sealed class RunProjectileSimulationRequest
{
    public string Name { get; set; } = "";

    public string ModuleId { get; set; } = "projectile";

    public double InitialVelocity { get; set; } = 30.0;

    public double LaunchAngle { get; set; } = 45.0;

    public double Gravity { get; set; } = 9.81;

    public double InitialHeight { get; set; } = 0.0;

    public double TimeStep { get; set; } = 0.05;
}
