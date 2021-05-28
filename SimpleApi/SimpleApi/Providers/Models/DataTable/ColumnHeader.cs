namespace SimpleApi.Providers.Models.DataTable
{
    public class ColumnHeader
    {
        public int Id { get; set; }
        public int? ParentId { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public int? SortOrder { get; set; }
        public ColumnHeader() { }
        public ColumnHeader(int id, int? parentId, string name, string type, int? sortOrder)
        {
            Id = id;
            ParentId = parentId;
            Name = name;
            Type = type;
            SortOrder = sortOrder;
        }
    }
}
