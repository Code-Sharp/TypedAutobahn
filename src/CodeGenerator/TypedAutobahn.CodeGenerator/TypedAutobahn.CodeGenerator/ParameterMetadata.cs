namespace TypedAutobahn.CodeGenerator
{
    internal class ParameterMetadata
    {
        public string Alias { get; set; }
        public string Type { get; set; }
        public string Keyword { get; set; }
        public int? Position { get; set; }
        public bool Optional { get; set; }
    }
}