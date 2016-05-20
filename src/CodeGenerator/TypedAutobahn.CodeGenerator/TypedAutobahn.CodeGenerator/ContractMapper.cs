using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using WampSharp.Core.Utilities;
using WampSharp.V2.PubSub;
using WampSharp.V2.Rpc;

namespace TypedAutobahn.CodeGenerator
{
    internal class ContractMapper
    {
        private readonly IContractNameProvider mNameProvider;

        public ContractMapper(IContractNameProvider nameProvider)
        {
            mNameProvider = nameProvider;
        }

        public string MapCompositeType(Type type)
        {
            return mNameProvider.ProvideName(type);
        }

        public FunctionMetadata MapMethod(MethodInfo method)
        {
            IEnumerable<ParameterMetadata> parameters = method.GetParameters().Select
                (x => new ParameterMetadata()
                {
                    Alias = mNameProvider.ProvideName(x),
                    Type = ConvertType(x.ParameterType),
                    Optional = x.HasDefaultValue
                });

            string procedure = null;

            if (method.IsDefined(typeof(WampProcedureAttribute)))
            {
                WampProcedureAttribute attribute = method.GetCustomAttribute<WampProcedureAttribute>();
                procedure = attribute.Procedure;
            }
            else if (method.IsDefined(typeof(WampTopicAttribute)))
            {
                WampTopicAttribute attribute = method.GetCustomAttribute<WampTopicAttribute>();
                procedure = attribute.Topic;
            }

            string interfaceName = mNameProvider.ProvideName(method.DeclaringType);

            return new FunctionMetadata()
            {
                Alias = mNameProvider.ProvideName(method),
                ContractName = interfaceName,
                Parameters = parameters,
                Uri = procedure,
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

        private string ConvertType(Type parameterType)
        {
            if (parameterType.IsGenericType &&
                parameterType.GetGenericTypeDefinition() == typeof(Nullable<>))
            {
                return ConvertType(parameterType.GetGenericArguments()[0]);
            }
            else if (typeof(ICollection<>).IsGenericAssignableFrom(parameterType))
            {
                Type elementType =
                    parameterType.GetClosedGenericTypeImplementation(typeof(ICollection<>))
                                 .GetGenericArguments()[0];

                string arrayType = ConvertType(elementType);

                return arrayType + "[]";
            }
            else if (parameterType.IsGenericType)
            {
                return string.Format("{0}<{1}>",
                                     mNameProvider.ProvideName(parameterType.GetGenericTypeDefinition()),
                                     string.Join(", ", parameterType.GetGenericArguments().Select(x => ConvertType(x))));
            }
            else if (parameterType == typeof(void))
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
            else if (parameterType == typeof(object))
            {
                return "any";
            }
            else
            {
                return MapCompositeType(parameterType);
            }
        }
    }
}