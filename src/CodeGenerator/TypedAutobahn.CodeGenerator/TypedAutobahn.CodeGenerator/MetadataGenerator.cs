using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace TypedAutobahn.CodeGenerator
{
    public class MetadataGenerator
    {
        public static string GenerateMetadata(Type contractType)
        {
            MethodInfo[] methods = contractType.GetMethods();

            List<string> fields = new List<string>();

            foreach (MethodInfo method in methods)
            {
                string fieldDeclaration = WriteMethodInfoDeclaration(FunctionMetadata.FromProcedure(method));
                fields.Add(fieldDeclaration);
            }

            string allFields = String.Join(Environment.NewLine, fields);

            var metadataClass =
                $@"class {contractType.Name}Metadata {{{allFields}
}}";

            return metadataClass;
        }

        private static string WriteMethodInfoDeclaration(FunctionMetadata metadata)
        {
            string result =
                $@"
    static {metadata.Alias}: IMethodInfo = {{
        uri: ""{metadata.Uri}"",
        methodArguments: [{String.Join(", ", metadata.Parameters.Select(parameter => $@"""{parameter.Alias}"""))}],
        endpointProvider: (instance: {metadata.ContractName}) => instance.{metadata.Alias}
    }};";

            return result;
        }
    }
}