using System.Threading.Tasks;
using WampSharp.V2.Rpc;

namespace TypedAutobahn.CodeGenerator
{
    public interface IArgumentsService
    {
        [WampProcedure("com.arguments.ping")]
        void Ping();

        [WampProcedure("com.arguments.add2")]
        int Add2(int a, int b);

        [WampProcedure("com.arguments.stars")]
        string Stars(string nick = "somebody", int stars = 0);

        [WampProcedure("com.arguments.orders")]
        string[] Orders(string product, int limit = 5);
    }
}