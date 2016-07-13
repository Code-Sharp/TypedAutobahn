using System;

namespace TypedAutobahn.CodeGenerator
{
    internal static class NewtonsoftJsonAttributes
    {
        public static readonly Type JsonPropertyAttribute = Type.GetType("Newtonsoft.Json.JsonPropertyAttribute, Newtonsoft.Json");
        public static readonly Type JsonIgnoreAttribute = Type.GetType("Newtonsoft.Json.JsonIgnoreAttribute, Newtonsoft.Json");
    }
}