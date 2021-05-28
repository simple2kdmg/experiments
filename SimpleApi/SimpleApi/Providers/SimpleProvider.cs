using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using SimpleApi.Providers.Models.Test;

namespace SimpleApi.Providers
{
    public class SimpleProvider : SqlProvider
    {
        public SimpleProvider(string connectionString) : base(connectionString)
        {

        }

        public List<string> Test()
        {
            var result = new List<string>();
            result.Add("API WORKS!");
            return result;
        }

        public List<ForecastValue> GetTestData(string userName)
        {
            var command = new SqlCommand
            {
                CommandText = "test.GetForecastRow_Test",
                CommandType = CommandType.StoredProcedure,
                Parameters =
                {
                    new SqlParameter("@WinLogin", userName)
                }
            };
            return ExecuteQuery<ForecastValue>(command);
        }
    }
}
