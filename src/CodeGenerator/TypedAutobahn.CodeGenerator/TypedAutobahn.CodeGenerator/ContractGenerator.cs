using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace TypedAutobahn.CodeGenerator
{
    internal class ContractGenerator
    {
        private readonly ContractMapper mMapper;
        private readonly ContractType mContractType;
        private readonly bool mNodeJs;

        public ContractGenerator(ContractMapper mapper, ContractType contractType, bool nodeJs)
        {
            mMapper = mapper;
            mContractType = contractType;
            mNodeJs = nodeJs;
        }

        public string GenerateInterface(Type contractType)
        {
            IEnumerable<MethodInfo> methods =
                contractType.GetMethods().Where(x => x.IsDefined(WampSharpAttributes.WampProcedureAttribute) ||
                                                     x.IsDefined(WampSharpAttributes.WampTopicAttribute));

            if (mContractType == ContractType.CalleeProxy)
            {
                methods =
                    contractType.GetMethods().
                                 Where(x => x.IsDefined(WampSharpAttributes.WampProcedureAttribute));
            }

            List<string> fields = new List<string>();

            foreach (MethodInfo method in methods)
            {
                string fieldDeclaration = GenerateMethodDeclaration(mMapper.MapMethod(method));
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

            if (mNodeJs)
            {
                metadataClass = "export " + metadataClass;
            }

            return metadataClass;
        }

        private string GenerateMethodDeclaration(FunctionMetadata metadata)
        {
            string parameters = string.Join(", ", metadata.Parameters.Select(x => $"{x.Alias}{(x.Optional ? "?" : string.Empty)} : {x.Type}"));

            string returnType = null;

            if (metadata.EventHandler)
            {
                returnType = "void";
            }
            else if (this.mContractType == ContractType.CalleeProxy)
            {
                returnType = $"When.Promise<{metadata.ReturnValueType}>";
            }
            else if (this.mContractType == ContractType.Callee)
            {
                returnType = $"When.Promise<{metadata.ReturnValueType}> | {metadata.ReturnValueType}";
            }

            return $@"
    {metadata.Alias}({parameters}): {returnType};";
        }
    }
}