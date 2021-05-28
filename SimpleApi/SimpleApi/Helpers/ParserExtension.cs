using System;
using Enum = System.Enum;

namespace SimpleApi.Helpers
{
    public static class ParserExtension
    {
        public static int? ParseInt(this object value)
        {
            if (value == null)
                return null;
            int temp;
            return int.TryParse(value.ToString(), out temp) ? temp : (int?)null;
        }

        public static double? ParseDouble(this object value)
        {
            if (value == null)
                return null;
            double temp;
            return double.TryParse(value.ToString(), out temp) ? temp : (double?)null;
        }

        public static double? ParseDecimal(this object value)
        {
            if (value == null)
                return null;
            decimal temp;
            return decimal.TryParse(value.ToString(), out temp) ? (double?)temp : (double?)null;
        }

        public static bool? ParseBool(this object value)
        {
            if (value == null)
                return null;
            bool temp;
            return bool.TryParse(value.ToString(), out temp) ? temp : (bool?)null;
        }

        public static int? ParseEnum(this object value, Type enumType)
        {
            if (value == null || value == DBNull.Value)
                return null;
            return (int)Enum.Parse(enumType, value.ToString());
        }
    }
}
