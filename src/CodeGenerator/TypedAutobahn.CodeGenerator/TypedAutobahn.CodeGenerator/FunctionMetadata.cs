using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using WampSharp.Core.Utilities;
using WampSharp.V2.Rpc;

namespace TypedAutobahn.CodeGenerator
{
    class FunctionMetadata
    {
        public string Alias { get; set; }
        public string Uri { get; set; }
        public IEnumerable<ParameterMetadata> Parameters { get; set; }
        public string ContractName { get; set; }
        public string ReturnValueType { get; set; }

        public static FunctionMetadata FromProcedure(MethodInfo method)
        {
            IEnumerable<ParameterMetadata> parameterNames = method.GetParameters().Select
                (x => new ParameterMetadata()
                {
                    Alias = x.Name,
                    Type = ConvertType(x.ParameterType)
                });

            WampProcedureAttribute attribute = method.GetCustomAttribute<WampProcedureAttribute>();
            string interfaceName = method.DeclaringType.Name;

            return new FunctionMetadata()
            {
                Alias = method.Name,
                ContractName = interfaceName,
                Parameters = parameterNames,
                Uri = attribute.Procedure,
                ReturnValueType = ConvertType(UnwrapReturnType(method.ReturnType))
            };
        }

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
        private static Type UnwrapReturnType(Type returnType)
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

        private static string ConvertType(Type parameterType)
        {
            if (parameterType.IsGenericType && parameterType.GetGenericTypeDefinition() == typeof(Nullable<>))
            {
                return ConvertType(parameterType.GetGenericArguments()[0]);
            }

            if (parameterType == typeof(void))
            {
                return "void";
            }
            else if (parameterType == typeof(bool))
            {
                return "boolean";
            }
            else if (parameterType == typeof(string))
            {
                return "string";
            }
            else if (parameterType.IsPrimitive)
            {
                return "number";
            }
            else if (parameterType.IsArray)
            {
                Type elementType = parameterType.GetElementType();
                object arrayType;
                if (!elementType.IsGenericParameter && elementType != typeof(object))
                {
                    arrayType = ConvertType(elementType);
                }
                else
                {
                    arrayType = "any";
                }
                return arrayType + "[]";
            }

            return "any";
        }
    }
}