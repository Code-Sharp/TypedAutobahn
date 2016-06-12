using System;
using System.Collections.Generic;
using System.Linq;

namespace TypedAutobahn.CodeGenerator
{
    public class TypeScriptCodeGeneratorSession
    {
        private readonly IContractNameProvider mNameProvider;
        private readonly ContractMapper mMapper;

        public TypeScriptCodeGeneratorSession(IContractNameProvider nameProvider)
        {
            mNameProvider = nameProvider;
            mMapper = new ContractMapper(nameProvider);
        }

        public string GenerateCode(Type[] contractTypes)
        {
            string contractsCode =
                string.Join(Environment.NewLine+ Environment.NewLine,
                            contractTypes.Select(x => GenerateContractTypeCode(x)));

            string commonCode = GenerateCommonCode(contractTypes);

            return $@"{contractsCode}{commonCode}";
        }

        private string GenerateCommonCode(Type[] contractTypes)
        {
            DataContractGenerator generator = new DataContractGenerator(mMapper, mNameProvider);

            return generator.GenerateDataContracts(contractTypes);
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
            ContractGenerator contractGenerator = new ContractGenerator(mMapper, ContractType.CalleeProxy);

            return contractGenerator.GenerateInterface(type);
        }

        private string GenerateProxyImplementation(Type type)
        {
            ProxyImplementationGenerator contractGenerator = new ProxyImplementationGenerator(mMapper);

            return contractGenerator.GenerateProxyImplementation(type);
        }

        private string GenerateCalleeInterface(Type type)
        {
            ContractGenerator contractGenerator = new ContractGenerator(mMapper, ContractType.Callee);

            return contractGenerator.GenerateInterface(type);
        }

        private string GenerateServiceProvider(Type contractType)
        {
            ServiceProviderGenerator serviceProviderGenerator = new ServiceProviderGenerator(mMapper);

            return serviceProviderGenerator.GenerateProvider(contractType);
        }
    }
}