using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Globalization;
using System.Linq;
using SimpleApi.Exceptions;
using SimpleApi.Helpers;
using SimpleApi.Providers.Models.SQL;

namespace SimpleApi.Providers
{
    public class SqlProvider
    {
        protected readonly string ConnectionString;

        public SqlProvider(string connectionString)
        {
            ConnectionString = connectionString;
        }

        protected T ExecuteScalar<T>(SqlCommand command) where T : IConvertible
        {
            using (var sqlConnection = new SqlConnection(ConnectionString))
            {
                sqlConnection.Open();
                command.Connection = sqlConnection;
                try
                {
                    var result = command.ExecuteScalar();
                    return (T)result;
                }
                catch (Exception ex)
                {
                    if (ex.Message.StartsWith("[USERMSG]", true, CultureInfo.InvariantCulture))
                    {
                        throw new CustomDatabaseException(ex.Message);
                    }
                    throw;
                }

            }
        }

        protected void ExecuteNotQuery(SqlCommand command)
        {
            using (var sqlConnection = new SqlConnection(ConnectionString))
            {
                sqlConnection.Open();
                command.Connection = sqlConnection;
                try
                {
                    command.ExecuteNonQuery();
                }
                catch (Exception ex)
                {
                    if (ex.Message.StartsWith("[USERMSG]", true, CultureInfo.InvariantCulture))
                    {
                        throw new CustomDatabaseException(ex.Message);
                    }
                    throw;
                }
            }
        }

        protected List<T> ExecuteQuery<T>(SqlCommand command) where T : new()
        {

            using (var sqlConnection = new SqlConnection(ConnectionString))
            {
                sqlConnection.Open();
                command.Connection = sqlConnection;
                try
                {
                    return ReadData<T>(command);
                }
                catch (Exception ex)
                {
                    if (ex.Message.StartsWith("[USERMSG]", true, CultureInfo.InvariantCulture))
                    {
                        throw new CustomDatabaseException(ex.Message);
                    }
                    throw;
                }
            }


        }

        protected DataTable ReadDataRows(SqlCommand command)
        {
            using (var sqlConnection = new SqlConnection(ConnectionString))
            {
                sqlConnection.Open();
                command.Connection = sqlConnection;
                using (var reader = command.ExecuteReader())
                {
                    var dataTable = new DataTable();
                    dataTable.Load(reader);

                    return dataTable;
                }

            }
        }

        private static List<T> ReadData<T>(SqlCommand command) where T : new()
        {

            using (var reader = command.ExecuteReader())
            {
                return GetValueFromReader<T>(reader);
            }
        }

        protected static List<T> GetValueFromReader<T>(SqlDataReader reader) where T : new()
        {
            var result = new List<T>();
            while (reader.Read())
            {
                var value = new T();
                result.Add(value);


                foreach (var fieldInfo in typeof(T).GetProperties().Where(f => f.PropertyType.IsPublic))
                {
                    if (fieldInfo.GetCustomAttributes(true).Any(x => x.GetType() == typeof(NotInDatabaseAttribute)))
                    {
                        continue;
                    }

                    var databaseNameAttribute =
                        fieldInfo.GetCustomAttributes(true)
                            .FirstOrDefault(x => x.GetType() == typeof(DatabaseNameAttribute)) as DatabaseNameAttribute;

                    var fieldName = databaseNameAttribute != null ? databaseNameAttribute.Name : fieldInfo.Name;

                    Type propertyType = fieldInfo.PropertyType;

                    try
                    {
                        if (propertyType == typeof(int?))
                        {
                            fieldInfo.SetValue(value, reader[fieldName].ParseInt());
                        }
                        else if (propertyType == typeof(double?))
                        {
                            fieldInfo.SetValue(value, reader[fieldName].ParseDouble());
                        }
                        else if (propertyType == typeof(bool?))
                        {
                            fieldInfo.SetValue(value, reader[fieldName].ParseBool());
                        }
                        else if (propertyType == typeof(DateTime))
                        {
                            fieldInfo.SetValue(value, DateTime.Parse(reader[fieldName].ToString()));
                        }
                        else if (propertyType == typeof(DateTime?))
                        {
                            fieldInfo.SetValue(value,
                                reader[fieldName].ToString() == string.Empty
                                    ? (DateTime?)null
                                    : DateTime.Parse(reader[fieldName].ToString()));
                        }
                        else if (propertyType == typeof(byte[]))
                        {
                            fieldInfo.SetValue(value, reader[fieldName] as byte[]);
                        }
                        else if (propertyType.IsEnum)
                        {
                            fieldInfo.SetValue(value, reader[fieldName].ParseEnum(propertyType));
                        }
                        else
                        {
                            fieldInfo.SetValue(value, reader[fieldName].ToString());
                        }
                    }
                    catch (Exception ex)
                    {
                        throw new FieldAccessException($"Field {fieldName} is not present in the data set", ex);
                    }

                }
            }
            return result;
        }
    }
}
