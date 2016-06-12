using System;

namespace TypedAutobahn.CodeGenerator
{
    internal static class WampSharpAttributes
    {
        public static readonly Type WampTopicAttribute = Type.GetType("WampSharp.V2.PubSub.WampTopicAttribute, WampSharp");
        public static readonly Type WampProcedureAttribute = Type.GetType("WampSharp.V2.Rpc.WampProcedureAttribute, WampSharp");
    }
}