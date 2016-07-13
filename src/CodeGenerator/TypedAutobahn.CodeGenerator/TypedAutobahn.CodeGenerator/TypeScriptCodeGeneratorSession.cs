using System;
using System.Collections.Generic;
using System.Linq;

namespace TypedAutobahn.CodeGenerator
{
    public class TypeScriptCodeGeneratorSession
    {
        private readonly IContractNameProvider mNameProvider;
        private readonly ContractMapper mMapper;
        private readonly bool mNodeJs;

        public TypeScriptCodeGeneratorSession(IContractNameProvider nameProvider, bool nodeJs)
        {
            mNameProvider = nameProvider;
            mNodeJs = nodeJs;
            mMapper = new ContractMapper(nameProvider);
        }

        public string GenerateCode(Type[] contractTypes, Type[] dataContracts)
        {
            string contractsCode =
                string.Join(Environment.NewLine+ Environment.NewLine,
                            contractTypes.Select(x => GenerateContractTypeCode(x)));

            string commonCode = GenerateCommonCode(contractTypes, dataContracts);

            return $@"{contractsCode}{commonCode}";
        }

        private string GenerateCommonCode(Type[] contractTypes, Type[] dataContracts)
        {
            DataContractGenerator generator = new DataContractGenerator(mMapper, mNameProvider, mNodeJs);

            return generator.GenerateDataContracts(contractTypes, dataContracts);
        }

        private string GenerateContractTypeCode(Type contractType)
        {
            string metadata = GenerateMetadata(contractType);

            string calleeInterface = GenerateCalleeInterface(contractType);

            string proxyInterface = GenerateProxy(contractType);

            string proxyImplementation = GenerateProxyImplementation(contractType);

            string serviceProvider = GenerateServiceProvider(contractType);

            return $@"{metadata}

{calleeInterface}

{proxyInterface}

{proxyImplementation}

{serviceProvider}";
        }

        private string GenerateMetadata(Type type)
        {
            MetadataGenerator metadataGenerator = new MetadataGenerator(mMapper);

            return metadataGenerator.GenerateMetadata(type);
        }

        private string GenerateProxy(Type type)
        {
            ContractGenerator contractGenerator = new ContractGenerator(mMapper, ContractType.CalleeProxy, mNodeJs);

            return contractGenerator.GenerateInterface(type);
        }

        private string GenerateProxyImplementation(Type type)
        {
            ProxyImplementationGenerator contractGenerator = new ProxyImplementationGenerator(mMapper);

            return contractGenerator.GenerateProxyImplementation(type);
        }

        private string GenerateCalleeInterface(Type type)
        {
            ContractGenerator contractGenerator = new ContractGenerator(mMapper, ContractType.Callee, mNodeJs);

            return contractGenerator.GenerateInterface(type);
        }

        private string GenerateServiceProvider(Type contractType)
        {
            ServiceProviderGenerator serviceProviderGenerator = new ServiceProviderGenerator(mMapper, mNodeJs);

            return serviceProviderGenerator.GenerateProvider(contractType);
        }
    }
}