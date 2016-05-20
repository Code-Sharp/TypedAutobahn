using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using WampSharp.V2.Rpc;

namespace TypedAutobahn.CodeGenerator
{
    internal enum ContractType
    {
        Callee,
        CalleeProxy
    }

    internal class ProxyImplementationGenerator
    {
        public ProxyImplementationGenerator()
        {
        }

        public string GenerateProxyImplementation(Type contractType)
        {
            IEnumerable<MethodInfo> methods =
                contractType.GetMethods().
                             Where(x => x.IsDefined(typeof(WampProcedureAttribute)));

            List<string> fields = new List<string>();

            foreach (MethodInfo method in methods)
            {
                string fieldDeclaration = GenerateMethodDeclaration(FunctionMetadata.FromProcedure(method));
                fields.Add(fieldDeclaration);
            }

            string methodDeclarations = String.Join(Environment.NewLine, fields);

            var metadataClass =
                $@"class {contractType.Name}ProxyImpl extends CalleeProxyBase implements {contractType.Name}Proxy {{
    constructor(session: autobahn.Session) {{
        super(session);
    }}
{methodDeclarations}
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

    internal class ContractGenerator
    {
        private readonly ContractType mContractType;

        public ContractGenerator(ContractType contractType)
        {
            mContractType = contractType;
        }

        public string GenerateInterface(Type contractType)
        {
            IEnumerable<MethodInfo> methods = contractType.GetMethods();

            if (mContractType == ContractType.CalleeProxy)
            {
                methods =
                    contractType.GetMethods().
                                 Where(x => x.IsDefined(typeof(WampProcedureAttribute)));
            }

            List<string> fields = new List<string>();

            foreach (MethodInfo method in methods)
            {
                string fieldDeclaration = GenerateMethodDeclaration(FunctionMetadata.FromProcedure(method));
                fields.Add(fieldDeclaration);
            }

            string methodDeclarations = String.Join(Environment.NewLine, fields);

            string suffix = string.Empty;

            if (mContractType == ContractType.CalleeProxy)
            {
                suffix = "Proxy";
            }
            

            var metadataClass =
                $@"interface {contractType.Name}{suffix} {{{methodDeclarations}
}}";

            return metadataClass;
        }

        private string GenerateMethodDeclaration(FunctionMetadata metadata)
        {
            string parameters = string.Join(", ", metadata.Parameters.Select(x => $"{x.Alias}{(x.Optional ? "?" : string.Empty)} : {x.Type}"));

            if (this.mContractType == ContractType.CalleeProxy)
            {
                return $@"
    {metadata.Alias}({parameters}): When.Promise<{metadata.ReturnValueType}>;";
            }
            else if (this.mContractType == ContractType.Callee)
            {
                return $@"
    {metadata.Alias}({parameters}): When.Promise<{metadata.ReturnValueType}> | {metadata.ReturnValueType};";
            }

            return null;
        }
    }
}