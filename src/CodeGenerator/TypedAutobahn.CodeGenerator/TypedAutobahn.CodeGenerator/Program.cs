using System;

namespace TypedAutobahn.CodeGenerator
{
    class Program
    {
        static void Main(string[] args)
        {
            TypeScriptCodeGeneratorSession session =
                new TypeScriptCodeGeneratorSession(new DefaultContractNameProvider());

            var generatedCode =
                session.GenerateCode(new Type[] {typeof(IArgumentsService),typeof(IMySubscriber)});
        }
    }
}