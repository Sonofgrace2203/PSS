
namespace pps.Model.SavedSimulationRow;

public class SavedSimulationRow
{
    public Guid SimulationId { get; set; }
    public DateTime CreatedAtUtc { get; set; }

    public string Name { get; set; } = "Projectile Motion";
    public string ModuleId { get; set; } = "projectile";

    public double InitialVelocity { get; set; }
    public double LaunchAngle { get; set; }
    public double Gravity { get; set; }
    public double Range { get; set; }
}
