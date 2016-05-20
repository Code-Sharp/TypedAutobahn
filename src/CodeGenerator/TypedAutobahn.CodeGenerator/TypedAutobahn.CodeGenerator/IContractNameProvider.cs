using System;
using System.Reflection;

namespace TypedAutobahn.CodeGenerator
{
    public interface IContractNameProvider
    {
        string ProvideName(MethodInfo method);
        string ProvideName(ParameterInfo parameter);
        string ProvideName(Type type);
        string ProvideName(PropertyInfo property);
    }
}