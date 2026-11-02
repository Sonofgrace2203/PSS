namespace pss.Models.SavedSimulationDetails;

public class SavedSimulationDetails
{
    public Guid SimulationId { get; set; }
    public DateTime CreatedAtUtc { get; set; }
    public string Name { get; set; } = "Projectile Motion";
    public string ModuleId { get; set; } = "projectile";
    public double InitialVelocity { get; set; }
    public double LaunchAngle { get; set; }
    public double Gravity { get; set; }
    public double InitialHeight { get; set; }
    public double TimeStep { get; set; }
    public double TimeOfFlight { get; set; }
    public double Range { get; set; }
    public double MaximumHeight { get; set; }
    public double MaximumHeightTime { get; set; }
    public double FinalHorizontalVelocity { get; set; }
    public double FinalVerticalVelocity { get; set; }
    public double FinalSpeed { get; set; }
    public string NotesTitle { get; set; } = "";
    public string SimulationNotes { get; set; } = "";
}