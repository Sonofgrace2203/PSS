namespace pss.Models.Settings;

public sealed class GeneralSettingsResponse
{
    public bool ShowTipsOnStartup { get; set; }
    public bool AutoSaveResults { get; set; }
    public bool ConfirmBeforeDeleting { get; set; }
    public DateTime UpdatedAtUtc { get; set; }
}
