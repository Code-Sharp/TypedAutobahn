namespace TypedAutobahn.CodeGenerator
{
    class Program
    {
        static void Main(string[] args)
        {
            string contract =
                new ContractGenerator(ContractType.CalleeProxy).
                GenerateInterface(typeof(IArgumentsService));

            string calleeContract =
                new ContractGenerator(ContractType.Callee).
                GenerateInterface(typeof(IArgumentsService));

            var generator = 
                new ProxyImplementationGenerator();

            var proxyImplementation =
                generator.GenerateProxyImplementation(typeof(IArgumentsService));

            string metadataClass = 
                MetadataGenerator.GenerateMetadata(typeof(IArgumentsService));
        }
    }
}