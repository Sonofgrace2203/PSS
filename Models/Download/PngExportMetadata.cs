namespace pss.Models.Download;

public class PngExportMetadata
    {
        public string SimulationName { get; set; } = string.Empty;
        public string ExportedAt { get; set; } = string.Empty;
        public double InitialVelocity { get; set; }
        public double LaunchAngle { get; set; }
        public double Gravity { get; set; }
        public double InitialHeight { get; set; }
        public double TimeStep { get; set; }
        public double Range { get; set; }
        public double MaximumHeight { get; set; }
        public double TimeOfFlight { get; set; }
        public double FinalSpeed { get; set; }
        public int TrajectoryPoints { get; set; }
    }