import React, { useState, useEffect } from 'react';
import { getConversations, getMessages, sendMessage } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
}

interface Conversation {
  id: number;
  participant: string;
  lastMessage: string;
  lastMessageTime: string;
  avatar: string;
}

const MessagesPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      if (!isAuthenticated) {
        setLoadingConversations(false);
        return;
      }
      setLoadingConversations(true);
      setError(null);
      try {
        const fetchedConversations = await getConversations();
        setConversations(fetchedConversations as Conversation[]);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch conversations.');
      } finally {
        setLoadingConversations(false);
      }
    };
    fetchConversations();
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedConversation) {
        setLoadingMessages(true);
        setError(null);
        try {
          const fetchedMessages = await getMessages(selectedConversation.id);
          setMessages(fetchedMessages as Message[]);
        } catch (err: any) {
          setError(err.message || 'Failed to fetch messages.');
        } finally {
          setLoadingMessages(false);
        }
      }
    };
    fetchMessages();
  }, [selectedConversation]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || !user) return;

    setLoadingMessages(true);
    setError(null);
    try {
      await sendMessage(selectedConversation.id, user.username, newMessage);
      setNewMessage('');
      // Optimistically update messages or refetch
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: Date.now(), sender: user.username, content: newMessage, timestamp: new Date().toLocaleTimeString() },
      ]);
    } catch (err: any) {
      setError(err.message || 'Failed to send message.');
    } finally {
      setLoadingMessages(false);
    }
  };

  if (!isAuthenticated) {
    return <div className="flex justify-center items-center h-full text-white">Please log in to view your messages.</div>;
  }

  return (
    <div className="flex h-full min-h-screen">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-gray-800 p-4 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Messages</h1>
        {loadingConversations ? (
          <p className="text-gray-500">Loading conversations...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : conversations.length === 0 ? (
          <p className="text-gray-500">No conversations found.</p>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              className={`flex items-center p-3 mb-2 rounded-lg cursor-pointer hover:bg-gray-800 ${selectedConversation?.id === conv.id ? 'bg-gray-800' : ''}`}
              onClick={() => setSelectedConversation(conv)}
            >
              <img
                src={conv.avatar}
                alt="User Avatar"
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <p className="font-bold">{conv.participant}</p>
                <p className="text-gray-500 text-sm">{conv.lastMessage} · {conv.lastMessageTime}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="border-b border-gray-800 p-4">
              <h2 className="text-xl font-bold">{selectedConversation.participant}</h2>
            </div>
            <div className="flex-1 p-4 overflow-y-auto flex flex-col-reverse">
              {loadingMessages ? (
                <p className="text-gray-500">Loading messages...</p>
              ) : error ? (
                <p className="text-red-500">Error: {error}</p>
              ) : messages.length === 0 ? (
                <p className="text-gray-500 text-center">No messages in this conversation.</p>
              ) : (
                [...messages].reverse().map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex mb-4 ${msg.sender === user?.username ? 'justify-end' : ''}`}
                  >
                    {msg.sender !== user?.username && (
                      <img
                        src={selectedConversation.avatar}
                        alt="User Avatar"
                        className="w-8 h-8 rounded-full mr-3"
                      />
                    )}
                    <div className={`${msg.sender === user?.username ? 'bg-blue-600' : 'bg-gray-700'} p-3 rounded-lg max-w-xs`}>
                      <p>{msg.content}</p>
                      <p className="text-xs text-gray-300 mt-1">{msg.timestamp}</p>
                    </div>
                    {msg.sender === user?.username && (
                      <img
                        src="https://via.placeholder.com/30" // Placeholder for current user's avatar
                        alt="My Avatar"
                        className="w-8 h-8 rounded-full ml-3"
                      />
                    )}
                  </div>
                ))
              )}
            </div>
            <div className="border-t border-gray-800 p-4 flex">
              <input
                type="text"
                placeholder="Start a new message"
                className="flex-1 p-3 rounded-full bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
                disabled={loadingMessages}
              />
              <button
                className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full"
                onClick={handleSendMessage}
                disabled={loadingMessages || !newMessage.trim()}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start chatting.
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
