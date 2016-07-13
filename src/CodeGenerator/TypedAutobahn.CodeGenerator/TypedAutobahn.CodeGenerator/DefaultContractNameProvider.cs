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

        public virtual string ProvideName(MethodInfo method)
        {
            return CamelCase(method.Name);
        }

        public virtual string ProvideName(ParameterInfo parameter)
        {
            return parameter.Name;
        }

        public virtual string ProvideName(Type type)
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

        public virtual string ProvideName(PropertyInfo property)
        {
            if (property.IsDefined(typeof(DataMemberAttribute)))
            {
                DataMemberAttribute attribute = property.GetCustomAttribute<DataMemberAttribute>();

                string attributeName = attribute.Name;

                if (!string.IsNullOrEmpty(attributeName))
                {
                    return attributeName;
                }
            }
            else if (NewtonsoftJsonAttributes.JsonPropertyAttribute != null &&
                     property.IsDefined(NewtonsoftJsonAttributes.JsonPropertyAttribute))
            {
                dynamic attribute = property.GetCustomAttribute(NewtonsoftJsonAttributes.JsonPropertyAttribute);

                string attributeName = attribute.PropertyName;

                if (!string.IsNullOrEmpty(attributeName))
                {
                    return attributeName;
                }
            }

            return property.Name;
        }
    }
}