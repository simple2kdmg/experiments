using System.Collections.Generic;
using System.Linq;
using SimpleApi.Providers;
using Microsoft.AspNetCore.Mvc;
using SimpleApi.Helpers;
using SimpleApi.Providers.Models.DataTable;
using SimpleApi.Providers.Models.Test;

namespace SimpleApi.Controllers
{
    [Route("api")]
    [ApiController]
    public class TargetsController : Controller
    {
        private readonly SimpleProvider _simpleProvider;

        public TargetsController(SimpleProvider simpleProvider)
        {
            _simpleProvider = simpleProvider;
        }
        
        [HttpGet("test")]
        public List<string> Test()
        {
            return _simpleProvider.Test();
        }

        [HttpGet("test-data")]
        public List<ForecastValue> GetTestData()
        {
            return _simpleProvider.GetTestData(User.Identity.Name);
        }

        [HttpGet("table")]
        public List<TableHeader> GetTable()
        {
            var colHeaders = new List<ColumnHeader>()
            {
                new ColumnHeader(1, null, "A", "1-lvl", 1),
                new ColumnHeader(2, null, "B", "1-lvl", 2),
                new ColumnHeader(3, 1, "C", "2-lvl", 3),
                new ColumnHeader(4, 1, "D", "2-lvl", 4),
                new ColumnHeader(5, 1, "E", "2-lvl", 5),
                new ColumnHeader(6, 2, "B", "2-lvl", 6),
                new ColumnHeader(7, 3, "C", "3-lvl", 7),
                new ColumnHeader(8, 4, "D", "3-lvl", 8),
                new ColumnHeader(9, 5, "X", "3-lvl", 9),
                new ColumnHeader(10, 5, "Y", "3-lvl", 10),
                new ColumnHeader(11, 6, "B", "3-lvl", 11)
            };

            return ObtainTableHead(colHeaders);
        }

        private List<TableHeader> ObtainTableHead(List<ColumnHeader> colHeaders)
        {
            int level = -1;
            var tableHeaders = new List<TableHeader>();
            FillTableHeadRow(null, ref colHeaders, ref tableHeaders, ref level);

            return tableHeaders;
        }

        private int FillTableHeadRow(int? parentId, ref List<ColumnHeader> columnHeaders, ref List<TableHeader> tableHeaders, ref int level, int parentPosition = -1, string parentName = "Unknown")
        {
            List<ColumnHeader> childHeaders = columnHeaders.Where(header => header.ParentId == parentId).ToList();
            level++;

            foreach (var childHeader in childHeaders)
            {
                int position;

                if (parentPosition >= 0 & childHeaders.Count == 1 & childHeader.Name == parentName)
                {
                    tableHeaders[parentPosition].RowSpan++;
                    position = parentPosition;
                }
                else
                {
                    tableHeaders.Add(new TableHeader(childHeader, level));
                    position = tableHeaders.Count - 1;
                }

                int colSpanIncrement = FillTableHeadRow(childHeader.Id, ref columnHeaders, ref tableHeaders, ref level,
                    position, childHeader.Name);
                tableHeaders[position].ColSpan += colSpanIncrement;

                if (parentPosition >= 0)
                {
                    tableHeaders[parentPosition].ColSpan += tableHeaders[position].ColSpan - 1;
                }
            }

            level--;

            return childHeaders.Count > 0 ? childHeaders.Count : 1;
        }

        [HttpGet("new-table")]
        public DataTableNew GetNewTable()
        {
            var headCells = new List<HeadCell>()
            {
                new HeadCell("B", 2, "A", "default"),
                // new HeadCell("D", 4, null, "default"),
                new HeadCell("C", 3, "A", "default"),
                new HeadCell("T", 1, null, "default")
            };

            var bodyCells = new List<BodyCell>()
            {
                new BodyCell("tableCell", 2, 2, 3, "B", 55, "number", "default"),
                new BodyCell("tableCell", 2, 2, 1, "cell", 50, "number", "default"),
                new BodyCell("tableCell", 2, 2, 2, "2", 65, "number", "default"),

                new BodyCell("rowHead", 1, 1, 3, "T", null, "text", "default"),
                new BodyCell("rowHead", 1, 1, 1, "row", 1, "number", "default"),
                new BodyCell("rowHead", 1, 1, 2, "1", null, "text", "default"),

                new BodyCell("tableCell", 2, 1, 3, "B", 35, "number", "default"),
                new BodyCell("tableCell", 2, 1, 1, "cell", 40, "number", "default"),
                new BodyCell("tableCell", 2, 1, 2, "1", 45, "number", "default"),

                new BodyCell("tableCell", 3, 2, 3, "C", 5, "number", "default"),
                new BodyCell("tableCell", 3, 2, 1, "cell", 10, "number", "default"),
                new BodyCell("tableCell", 3, 2, 2, "2", 15, "number", "default"),

                new BodyCell("tableCell", 3, 1, 3, "C", 15, "number", "default"),
                new BodyCell("tableCell", 3, 1, 1, "cell", 20, "number", "default"),
                new BodyCell("tableCell", 3, 1, 2, "1", 25, "number", "default"),

                new BodyCell("rowHead", 1, 2, 3, "T", null, "text", "default"),
                new BodyCell("rowHead", 1, 2, 1, "row", 2, "number", "default"),
                new BodyCell("rowHead", 1, 2, 2, "2", null, "text", "default")
            };

            return new DataTableNew(headCells, bodyCells);
        }


    }
}
