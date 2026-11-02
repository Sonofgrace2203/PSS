namespace pss.Models.SimulationModuleDto;

public sealed class SimulationModuleDto
{
    public Guid Id { get; set; }
    public string Slug { get; set; } = "";
    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    public string Category { get; set; } = "";
    public string ImageUrl { get; set; } = "";
    public string WorkflowKey { get; set; } = "";
    public bool IsImplemented { get; set; }
    public int DisplayOrder { get; set; }
}