using System;
using System.Threading.Tasks;
using WampSharp.Core.Utilities;

namespace TypedAutobahn.CodeGenerator
{
    internal class TaskExtensions
    {
        /// <summary>
        /// Unwraps the return type of a given method.
        /// </summary>
        /// <param name="returnType">The given return type.</param>
        /// <returns>The unwrapped return type.</returns>
        /// <example>
        /// void, Task -> object
        /// Task{string} -> string
        /// int -> int
        /// </example>
        public static Type UnwrapReturnType(Type returnType)
        {
            if (returnType == typeof(void) || returnType == typeof(Task))
            {
                return typeof(void);
            }

            Type taskType =
                returnType.GetClosedGenericTypeImplementation(typeof(Task<>));

            if (taskType != null)
            {
                return returnType.GetGenericArguments()[0];
            }

            return returnType;
        }
    }
}