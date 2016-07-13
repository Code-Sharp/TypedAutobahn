using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Runtime.Serialization;
using System.Threading.Tasks;

namespace TypedAutobahn.CodeGenerator
{
    internal class DataContractGenerator
    {
        private readonly ContractMapper mMapper;
        private readonly IContractNameProvider mProvider;
        private readonly bool mNodeJs;

        public DataContractGenerator(ContractMapper mapper, IContractNameProvider provider, bool nodeJs)
        {
            mMapper = mapper;
            mProvider = provider;
            mNodeJs = nodeJs;
        }

        private Type[] GatherDataContracts(Type[] interfaces)
        {
            IEnumerable<Type> initialTypes =
                interfaces.SelectMany(x => x.GetMethods())
                          .Where(x => x.IsDefined(WampSharpAttributes.WampProcedureAttribute, true) ||
                                      x.IsDefined(WampSharpAttributes.WampTopicAttribute, true))
                          .SelectMany(x => x.GetParameters().Select(parameter => parameter.ParameterType)
                                            .Concat(new[] {TaskExtensions.UnwrapReturnType(x.ReturnType)}));

            TypeExplorer typeExplorer =
                new TypeExplorer(type => type.IsPrimitive ||
                                         type == typeof(string) ||
                                         type == typeof(Nullable<>) ||
                                         type == typeof(DateTime) ||
                                         type == typeof(object),
                                 property => !property.IsDefined(typeof(IgnoreDataMemberAttribute)) &&
                                 !((NewtonsoftJsonAttributes.JsonIgnoreAttribute != null) && 
                                 property.IsDefined(NewtonsoftJsonAttributes.JsonIgnoreAttribute)));

            foreach (Type type in initialTypes)
            {
                typeExplorer.Explore(type);
            }

            Func<Type, bool> predicate = x => !typeof(ICollection<>).IsGenericAssignableFrom(x) &&
                                              (x != typeof(string)) &&
                                              (x != typeof(DateTime)) &&
                                              !x.IsPrimitive &&
                                              (x != typeof(void)) &&
                                              !typeof(Task).IsAssignableFrom(x);

            IEnumerable<Type> exploredTypes = typeExplorer.ExploredTypes;

            IEnumerable<Type> gatherDataContracts =
                exploredTypes.Where(predicate);

            return gatherDataContracts.ToArray();
        }

        public string GenerateDataContracts(Type[] interfaces)
        {
            Type[] dataContracts = GatherDataContracts(interfaces);

            List<string> generatedContracts = new List<string>();

            foreach (Type dataContract in dataContracts)
            {
                string generated = GenerateDataContract(dataContract);

                generatedContracts.Add(generated);
            }

            string result = string.Join(string.Empty,
                                        generatedContracts);

            return result;
        }

        private string GenerateDataContract(Type dataContract)
        {
            string interfaceName = mProvider.ProvideName(dataContract);

            string genericArguments = string.Empty;

            if (dataContract.IsGenericType)
            {
                genericArguments =
                    string.Join(", ",
                                dataContract.GetGenericArguments()
                                            .Select(genericArgument => mProvider.ProvideName(genericArgument)));

                genericArguments = $"<{genericArguments}>";
            }


            IEnumerable<PropertyInfo> properties =
                dataContract.GetProperties(BindingFlags.Instance | BindingFlags.Public)
                            .Where(x => !x.IsDefined(typeof(IgnoreDataMemberAttribute)) &&
                                        !(NewtonsoftJsonAttributes.JsonIgnoreAttribute != null &&
                                         x.IsDefined(NewtonsoftJsonAttributes.JsonIgnoreAttribute)));

            IEnumerable<string> generatedProperties = 
                properties.Select(x => $"    {mProvider.ProvideName(x)} : {mMapper.MapType(x.PropertyType)};");

            string result = $@"

{(mNodeJs ?"export ":string.Empty)}interface {interfaceName}{genericArguments} {{
{string.Join(Environment.NewLine, generatedProperties)}
}}";

            return result;
        }
    }
}