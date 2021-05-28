using System;

namespace SimpleApi.Providers.Models.SQL
{
    public class DatabaseNameAttribute : Attribute
    {
        public string Name { get; set; }
    }
}
