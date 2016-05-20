using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using WampSharp.V2.PubSub;
using WampSharp.V2.Rpc;

namespace TypedAutobahn.CodeGenerator
{
    public class DataContractGenerator
    {
        private readonly IContractNameProvider mProvider;

        public DataContractGenerator(IContractNameProvider provider)
        {
            mProvider = provider;
        }

        public string GenerateDataContracts(Type[] interfaces)
        {
            var dataContracts = GatherDataContracts(interfaces);
            return null;
        }

        private Type[] GatherDataContracts(Type[] interfaces)
        {
            IEnumerable<Type> initialTypes =
                interfaces.SelectMany(x => x.GetMethods())
                          .Where(x => x.IsDefined(typeof(WampProcedureAttribute), true) ||
                                      x.IsDefined(typeof(WampTopicAttribute), true))
                          .SelectMany(x => x.GetParameters().Select(parameter => parameter.ParameterType)
                                            .Concat(new[] {x.ReturnType}));

            return null;
        }
    }
}