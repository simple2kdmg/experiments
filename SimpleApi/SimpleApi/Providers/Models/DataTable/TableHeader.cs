namespace SimpleApi.Providers.Models.DataTable
{
    public class TableHeader
    {
        public int Level { get; set; }
        public int Id { get; set; }
        public string Type { get; set; }
        public int ColSpan { get; set; }
        public int RowSpan { get; set; }
        public string Name { get; set; }
        public int? SortOrder { get; set; }
        public TableHeader() { }

        public TableHeader(ColumnHeader colHeader, int level)
        {
            Level = level;
            Id = colHeader.Id;
            Name = colHeader.Name;
            SortOrder = colHeader.SortOrder;
            Type = colHeader.Type;
            ColSpan = 1;
            RowSpan = 1;
        }
        public TableHeader(int level, int id, string type, int colSpan, int rowSpan, string name, int? sortOrder)
        {
            Level = level;
            Id = id;
            Type = type;
            ColSpan = colSpan;
            RowSpan = rowSpan;
            Name = name;
            SortOrder = sortOrder;
        }
    }
}
