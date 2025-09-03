import { useEffect, useState } from "react";

type Message = {
  id: number;
  fullName: string;
  email: string;
  yourMessage: string;
};

const MessagesTab = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/messages", {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch messages");
        const data = await res.json();
        setMessages(Array.isArray(data) ? data : [data]);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchMessages();
  }, []);

  return (
    <div className="pl-10 pt-20">
      <h2 className="text-xl font-bold mb-4">Messages</h2>
      {error && <p className="text-red-500">{error}</p>}
      {messages.length === 0 ? (
        <p>No messages found.</p>
      ) : (
        <ul className="space-y-4">
          {messages.map((msg) => (
            <li key={msg.id} className="p-3 border rounded-lg bg-white shadow">
              <p className="font-semibold">{msg.fullName}</p>
              <p className="text-sm text-gray-600">{msg.email}</p>
              <p className="mt-2">{msg.yourMessage}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MessagesTab;
