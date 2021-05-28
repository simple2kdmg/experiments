namespace SimpleApi.Providers.Models.Test
{
    public class ForecastValue
    {
        public int? Id { get; set; }
        public int? ParentId { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public int? SortOrder { get; set; }
        public TargetStatus Status { get; set; }
    }
}
