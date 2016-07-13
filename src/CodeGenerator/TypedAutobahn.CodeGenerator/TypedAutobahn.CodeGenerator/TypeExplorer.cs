using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace TypedAutobahn.CodeGenerator
{
    internal class TypeExplorer
    {
        private readonly Func<Type, bool> mIgnoreTypePredicate;
        private readonly HashSet<Type> mExploredTypes = new HashSet<Type>();
        private readonly Func<PropertyInfo, bool> mPropertyFilter;

        public TypeExplorer(Func<Type, bool> ignoreTypePredicate,
                            Func<PropertyInfo, bool> propertyFilter)
        {
            mIgnoreTypePredicate = ignoreTypePredicate;
            mPropertyFilter = propertyFilter;
        }

        public IEnumerable<Type> ExploredTypes
        {
            get
            {
                return mExploredTypes;
            }
        }

        public void Explore(Type type)
        {
            if (mIgnoreTypePredicate(type))
            {
                return;
            }

            if (typeof(IDictionary<,>).IsGenericAssignableFrom(type))
            {
                ExplorePredefinedGenericType(type, typeof(IDictionary<,>));
                return;
            }
            else if (typeof(IEnumerable<>).IsGenericAssignableFrom(type))
            {
                ExplorePredefinedGenericType(type, typeof(IEnumerable<>));
                return;
            }
            else if (type.IsGenericType && !type.IsGenericTypeDefinition)
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

            foreach (PropertyInfo property in 
                type.GetProperties(BindingFlags.Instance | BindingFlags.Public)
                    .Where(mPropertyFilter))
            {
                Explore(property.PropertyType);
            }
        }

        private void ExplorePredefinedGenericType(Type type, Type predefinedType)
        {
            Type closedGenericType =
                type.GetClosedGenericTypeImplementation(predefinedType);

            Type[] arguments = closedGenericType.GetGenericArguments();

            foreach (Type argument in arguments)
            {
                Explore(argument);
            }
        }
    }
}