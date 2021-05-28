using System;
using System.Collections.Generic;
using System.Linq;

namespace SimpleApi.Helpers
{
    public class DataTableNew
    {
        public List<List<TableHeadCell>> HeadRows { get; set; }
        public List<List<TableBodyCell>> BodyRows { get; set; }

        public DataTableNew(List<HeadCell> headCells, List<BodyCell> bodyCells)
        {
            HeadRows = GetTableHeadRows(headCells);
            BodyRows = GetTableBodyRows(bodyCells);
        }

        private List<List<TableHeadCell>> GetTableHeadRows(List<HeadCell> headCells)
        {
            var firstRow = new List<TableHeadCell>();
            var secondRow = new List<TableHeadCell>();

            foreach (var headCell in headCells)
            {
                if (String.IsNullOrEmpty(headCell.GroupName))
                {
                    firstRow.Add(new TableHeadCell(headCell, 2));
                }
                else
                {
                    var groupCell = firstRow.FirstOrDefault(firstRowCell => firstRowCell.Name == headCell.GroupName);
                    if (groupCell != null)
                    {
                        ++groupCell.ColSpan;
                    }
                    else
                    {
                        firstRow.Add(new TableHeadCell(headCell, 1, headCell.GroupName));
                    }
                    secondRow.Add(new TableHeadCell(headCell));
                }
            }

            firstRow = firstRow.OrderBy(headCell => headCell.ColNum).ToList();
            secondRow = secondRow.OrderBy(headCell => headCell.ColNum).ToList();

            return new List<List<TableHeadCell>>()
            {
                firstRow,
                secondRow
            };
        }

        private List<List<TableBodyCell>> GetTableBodyRows(List<BodyCell> bodyCells)
        {
            return bodyCells.OrderBy(cell => cell.RowNum).GroupBy(cell => cell.RowNum).Select(groupByRow =>
                groupByRow.ToList().OrderBy(cell => cell.ColNum).GroupBy(cell => cell.ColNum).Select(groupByCol =>
                {
                    var columnData = groupByCol.ToList();
                    var data = columnData.OrderBy(cell => cell.ValueNum).Select(bodyCell =>
                            new CellData(bodyCell.StringValue, bodyCell.NumberValue, bodyCell.ValueType, bodyCell.Color))
                        .ToList();
                    return new TableBodyCell(columnData[0].CellType, columnData[0].ColNum, columnData[0].RowNum, data);
                }).ToList()
            ).ToList();
        }
    }

    public class HeadCell
    {
        public string Name { get; set; }
        public int ColNum { get; set; }
        public string GroupName { get; set; }
        public string Color { get; set; }

        public HeadCell(string name, int colNum, string groupName, string color)
        {
            Name = name;
            ColNum = colNum;
            GroupName = groupName;
            Color = color;
        }
    }

    public class TableHeadCell
    {
        public string Name { get; set; }
        public int ColNum { get; set; }
        public string Color { get; set; }
        public int RowSpan { get; set; }
        public int ColSpan { get; set; }

        public TableHeadCell(HeadCell headCell)
        {
            Name = headCell.Name;
            ColNum = headCell.ColNum;
            Color = headCell.Color;
            RowSpan = 1;
            ColSpan = 1;
        }

        public TableHeadCell(HeadCell headCell, int rowSpan) : this(headCell)
        {
            RowSpan = rowSpan;
        }

        public TableHeadCell(HeadCell headCell, int rowSpan, string name) : this(headCell, rowSpan)
        {
            Name = name;
        }
    }

    public class CellData
    {
        public string StringValue { get; set; }
        public double? NumberValue { get; set; }
        public string ValueType { get; set; }
        public string Color { get; set; }

        public CellData(string stringValue, double? numberValue, string valueType, string color)
        {
            StringValue = stringValue;
            NumberValue = numberValue;
            ValueType = valueType;
            Color = color;
        }
    }

    public class BodyCell : CellData
    {
        public string CellType { get; set; }
        public int ColNum { get; set; }
        public int RowNum { get; set; }
        public int ValueNum { get; set; }

        public BodyCell(string cellType, int colNum, int rowNum, int valueNum, string stringValue, double? numberValue,
            string valueType, string color)
            : base(stringValue, numberValue, valueType, color)
        {
            CellType = cellType;
            ColNum = colNum;
            RowNum = rowNum;
            ValueNum = valueNum;
        }
    }

    public class TableBodyCell
    {
        public string CellType { get; set; }
        public int ColNum { get; set; }
        public int RowNum { get; set; }
        public List<CellData> Data { get; set; }

        public TableBodyCell(string cellType, int colNum, int rowNum, List<CellData> data)
        {
            CellType = cellType;
            ColNum = colNum;
            RowNum = rowNum;
            Data = data;
        }
    }
}
