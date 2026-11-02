namespace pss.Models.Download;

public class PdfTrajectoryRow
    {
        public int Frame { get; set; }
        public double Time { get; set; }
        public double X { get; set; }
        public double Y { get; set; }
        public double Vx { get; set; }
        public double Vy { get; set; }
        public double Speed { get; set; }
    }