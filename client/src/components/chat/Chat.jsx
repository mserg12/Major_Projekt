import { useContext, useEffect, useRef, useState } from "react";
import "./chat.scss";
import { AuthContext } from "../../context/AuthContext"; // Import authentication context
import { SocketContext } from "../../context/SocketContext"; // Import socket context for real-time messaging
import apiRequest from "../../lib/apiRequest"; // Import API request utility
import { format } from "timeago.js"; // Import time formatting library

function Chat({ chats }) {
  const [chat, setChat] = useState(null); // State to store the selected chat
  const { currentUser } = useContext(AuthContext); // Get the current logged-in user
  const { socket } = useContext(SocketContext); // Get the socket instance
  const messageEndRef = useRef(); // Reference to the last message for auto-scrolling

  // Automatically scroll to the latest message when chat updates
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  // Open a chat and load messages
  const handleOpenChat = async (id, receiver) => {
    try {
      const res = await apiRequest.get(`/chats/${id}`); // Fetch chat data
      setChat({ ...res.data, receiver }); // Set chat data in state

      // If messages are unread, mark them as read
      if (!res.data.seenBy.includes(currentUser.id)) {
        await apiRequest.put(`/chats/read/${id}`);
      }
    } catch (err) {
      console.log("Error opening chat:", err);
    }
  };

  // Send a new message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    const text = e.target.text.value.trim();
    if (!text || !chat) return;

    try {
      const res = await apiRequest.post(`/messages/${chat.id}`, { text }); // Send message to API
      setChat((prev) => ({
        ...prev,
        messages: [...prev.messages, res.data], // Add new message to state
      }));

      // Send message in real-time using socket
      socket.emit("sendMessage", {
        receiverId: chat.receiver.id,
        data: res.data,
      });

      e.target.reset(); // Reset input field
      messageEndRef.current?.scrollIntoView({ behavior: "smooth" }); // Scroll to latest message
    } catch (err) {
      console.log("⚠️ Error sending message:", err);
    }
  };

  // Listen for real-time messages via Socket.IO
  useEffect(() => {
    if (!socket || !chat) return;

    socket.on("getMessage", (data) => {
      if (chat.id === data.chatId) {
        setChat((prev) => ({
          ...prev,
          messages: [...prev.messages, data], // Add received message to state
        }));
      }
    });

    return () => {
      socket.off("getMessage"); // Cleanup listener on component unmount
    };
  }, [socket, chat]);

  return (
    <div className="chat">
      {/* List of messages */}
      <div className="messages">
        <h1>Messages</h1>
        {chats?.map((c) => (
          <div
            className="message"
            key={c.id}
            style={{
              backgroundColor:
                c.seenBy.includes(currentUser.id) || chat?.id === c.id
                  ? "white"
                  : "#fecd514e", // Highlight unread messages
            }}
            onClick={() => handleOpenChat(c.id, c.receiver)}
          >
            <span>{c.receiver.username}</span>
            <p>{c.lastMessage}</p>
          </div>
        ))}
      </div>

      {/* Chat Box */}
      {chat && (
        <div className="chatBox">
          <div className="top">
            <div className="user">
              <span>{chat.receiver.username}</span>
            </div>
            <span className="close" onClick={() => setChat(null)}>X</span> {/* Close chat button */}
          </div>

          <div className="center">
            {chat.messages.map((message) => (
              <div
                className={`chatMessage ${message.userId === currentUser.id ? "own" : ""}`}
                key={message.id}
              >
                <div className={`messageBubble ${message.userId === currentUser.id ? "own" : ""}`}>
                  <p>{message.text}</p>
                  <span className="timestamp">{format(message.createdAt)}</span> {/* Format timestamp */}
                </div>
              </div>
            ))}
            <div ref={messageEndRef}></div> {/* Reference for auto-scroll */}
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="bottom">
            <input type="text" name="text" placeholder="Type a message..." />
            <button>Send</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat;
