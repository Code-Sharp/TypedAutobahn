using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using WampSharp.V2.Rpc;

namespace TypedAutobahn.CodeGenerator
{
    internal class ProxyImplementationGenerator
    {
        private readonly ContractMapper mContractMapper;

        public ProxyImplementationGenerator(ContractMapper contractMapper)
        {
            mContractMapper = contractMapper;
        }

        public string GenerateProxyImplementation(Type contractType)
        {
            IEnumerable<MethodInfo> methods =
                contractType.GetMethods().
                             Where(x => CustomAttributeExtensions.IsDefined((MemberInfo) x, typeof(WampProcedureAttribute)));

            List<string> generatedMethods = new List<string>();

            foreach (MethodInfo method in methods)
            {
                string methodDeclaration = GenerateMethodDeclaration(mContractMapper.MapMethod(method));
                generatedMethods.Add(methodDeclaration);
            }

            string methodDeclarations = String.Join(string.Empty, generatedMethods);

            var metadataClass =
                $@"class {contractType.Name}ProxyImpl extends CalleeProxyBase implements {contractType.Name}Proxy {{
    constructor(session: autobahn.Session) {{
        super(session);
    }}{methodDeclarations}
}}";

            return metadataClass;
        }

        private string GenerateMethodDeclaration(FunctionMetadata metadata)
        {
            string parameters = string.Join(", ", metadata.Parameters.Select(x => $"{x.Alias}{(x.Optional ? "?" : string.Empty)} : {x.Type}"));

            return $@"

    {metadata.Alias}({parameters}): When.Promise<{metadata.ReturnValueType}> {{
        return super.singleInvokeAsync<{metadata.ReturnValueType}>({metadata.ContractName}Metadata.{metadata.Alias}, [{string.Join(", ", metadata.Parameters.Select(x => x.Alias))}]);
    }}";
        }
    }
}