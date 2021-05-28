using System;

namespace SimpleApi.Exceptions
{
    public class CustomDatabaseException : Exception
    {
        public CustomDatabaseException() : base()
        {

        }

        public CustomDatabaseException(string message) : base(message)
        {

        }

        public CustomDatabaseException(string message, Exception exception) : base(message, exception)
        {

        }
    }
}
