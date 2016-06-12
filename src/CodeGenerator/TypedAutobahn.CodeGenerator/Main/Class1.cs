using WampSharp.V2.PubSub;

namespace TypedAutobahn.CodeGenerator
{
    public class MyClass
    {
        public int Counter { get; set; }

        public int[] Foo { get; set; }

        public override string ToString()
        {
            return string.Format("counter: {0}, foo: [{1}]",
                Counter,
                string.Join(", ", Foo));
        }
    }

    public interface IMySubscriber
    {
        [WampTopic("com.myapp.heartbeat")]
        void OnHeartbeat();

        [WampTopic("com.myapp.topic2")]
        void OnTopic2(int number1, int number2, string c, MyClass d);
    }
}