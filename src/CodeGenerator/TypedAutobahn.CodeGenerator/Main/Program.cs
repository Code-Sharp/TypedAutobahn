using System;
using WampSharp.V2.MetaApi;
using WampSharp.V2.PubSub;
using WampSharp.V2.Rpc;

namespace TypedAutobahn.CodeGenerator
{
    class Program
    {
        static void Main(string[] args)
        {
            TypeScriptCodeGeneratorSession session =
                new TypeScriptCodeGeneratorSession(new DefaultContractNameProvider());

            var generatedCode =
                session.GenerateCode(new Type[]
                {
                    typeof(IArgumentsService)
                    //, typeof(IMySubscriber)
                });
        }
    }
}