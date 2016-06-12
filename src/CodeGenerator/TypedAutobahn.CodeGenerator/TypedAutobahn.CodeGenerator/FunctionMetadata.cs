using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using WampSharp.Core.Utilities;
using WampSharp.V2.Rpc;

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