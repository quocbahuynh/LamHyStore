namespace LamHyStore.Shared.DataTransferObjects
{
    public class BulkOrderForCreationDto
    {
        public string Name { get; set; }

        public string StartDate { get; set; }

        public string EndDate { get; set; }

        public IList<string>? ProductExternalIds { get; set; }
    }
}
