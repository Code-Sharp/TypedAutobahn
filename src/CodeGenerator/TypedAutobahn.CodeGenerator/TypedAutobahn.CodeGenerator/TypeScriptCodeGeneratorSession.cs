using System;
using System.Collections.Generic;

namespace TypedAutobahn.CodeGenerator
{
    public class TypeScriptCodeGeneratorSession
    {
        private readonly Type[] mContractTypes;

        public TypeScriptCodeGeneratorSession(Type[] contractTypes)
        {
            mContractTypes = contractTypes;
        }

        public string GenerateServiceProvider()
        {
            List<string> generatedContracts = new List<string>();

            foreach (Type contractType in mContractTypes)
            {
                string contractCode = GenerateContractCode(contractType);
            }

            List<string> commonContracts = GenerateCommonContracts();

            generatedContracts.AddRange(commonContracts);

            return string.Join(Environment.NewLine, generatedContracts);
        }

        private List<string> GenerateCommonContracts()
        {
            return null;
        }

        private string GenerateContractCode(Type contractType)
        {
            return null;
        }
    }
}