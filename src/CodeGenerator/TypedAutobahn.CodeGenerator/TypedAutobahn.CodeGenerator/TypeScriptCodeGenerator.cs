using System;

namespace TypedAutobahn.CodeGenerator
{
    public class TypeScriptCodeGenerator
    {
        public string GenerateServiceProvider(Type[] contractTypes)
        {
            TypeScriptCodeGeneratorSession session = new TypeScriptCodeGeneratorSession(contractTypes);

            return session.GenerateServiceProvider();
        }
    }
}