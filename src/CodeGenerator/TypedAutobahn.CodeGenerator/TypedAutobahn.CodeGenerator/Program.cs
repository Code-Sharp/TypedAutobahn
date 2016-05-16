using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace TypedAutobahn.CodeGenerator
{
    class Program
    {
        static void Main(string[] args)
        {
            string contract =
                ContractProxyGenerator.GenerateProxy(typeof(IArgumentsService));

            string metadataClass = 
                MetadataGenerator.GenerateMetadata(typeof(IArgumentsService));
        }
    }

    internal class ContractProxyGenerator
    {
        public static string GenerateProxy(Type contractType)
        {
            MethodInfo[] methods = contractType.GetMethods();

            List<string> fields = new List<string>();

            foreach (MethodInfo method in methods)
            {
                string fieldDeclaration = GenerateMethodDeclaration(FunctionMetadata.FromProcedure(method));
                fields.Add(fieldDeclaration);
            }

            string methodDeclarations = String.Join(Environment.NewLine, fields);

            var metadataClass =
                $@"interface {contractType.Name}Proxy {{{methodDeclarations}
}}";

            return metadataClass;
        }

        private static string GenerateMethodDeclaration(FunctionMetadata metadata)
        {
            string parameters = string.Join(", ", metadata.Parameters.Select(x => $"{x.Alias} : {x.Type}"));

            return $@"
    {metadata.Alias}({parameters}): When.Promise<{metadata.ReturnValueType}>;";
        }
    }
}