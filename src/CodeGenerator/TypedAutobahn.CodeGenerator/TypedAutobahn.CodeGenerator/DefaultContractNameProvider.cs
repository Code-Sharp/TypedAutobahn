using System;
using System.Reflection;
using System.Runtime.Serialization;

namespace TypedAutobahn.CodeGenerator
{
    public class DefaultContractNameProvider : IContractNameProvider
    {
        public static string CamelCase(string value)
        {
            if (string.IsNullOrEmpty(value))
            {
                return value;
            }

            return char.ToLower(value[0]) + value.Substring(1);
        }

        public string ProvideName(MethodInfo method)
        {
            return CamelCase(method.Name);
        }

        public string ProvideName(ParameterInfo parameter)
        {
            return parameter.Name;
        }

        public string ProvideName(Type type)
        {
            string typeName = type.Name;

            if (type.IsGenericType)
            {
                return typeName.Substring(0, typeName.IndexOf("`"));
            }
            else
            {
                return typeName;
            }
        }

        public string ProvideName(PropertyInfo property)
        {
            if (property.IsDefined(typeof(DataMemberAttribute)))
            {
                DataMemberAttribute attribute = property.GetCustomAttribute<DataMemberAttribute>();
                return attribute.Name;
            }

            return property.Name;
        }
    }
}