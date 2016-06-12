using System.Collections.Generic;

namespace TypedAutobahn.CodeGenerator
{
    class FunctionMetadata
    {
        public string Alias { get; set; }
        public string Uri { get; set; }
        public IEnumerable<ParameterMetadata> Parameters { get; set; }
        public string ContractName { get; set; }
        public string ReturnValueType { get; set; }
        public bool EventHandler { get; set; }
    }
}