using System;
using System.Collections.Generic;
using System.Reflection;

namespace TypedAutobahn.CodeGenerator
{
    internal class TypeExplorer
    {
        private readonly HashSet<Type> mExploredTypes = new HashSet<Type>();

        public IEnumerable<Type> ExploredTypes
        {
            get
            {
                return mExploredTypes;
            }
        }

        public void Explore(Type type)
        {
            if (type.IsGenericType && !type.IsGenericTypeDefinition)
            {
                Explore(type.GetGenericTypeDefinition());

                foreach (Type genericArgument in type.GetGenericArguments())
                {
                    Explore(genericArgument);
                }
                
                return;
            }

            if (type.IsArray)
            {
                Explore(type.GetElementType());
                return;
            }

            if (type.IsGenericParameter)
            {
                return;
            }

            if (!mExploredTypes.Add(type))
            {
                return;
            }

            foreach (PropertyInfo property in type.GetProperties())
            {
                Explore(property.PropertyType);
            }
        }        
    }
}