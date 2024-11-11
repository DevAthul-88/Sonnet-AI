import { createContext, useState, useContext, FC, ReactNode, useEffect } from 'react';

interface ChatContextValue {
  recentChats: any[];
  loading: boolean;
  error: string | null;
  refreshKey: number;
  refreshChats: () => void;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export const useChatContext = (): ChatContextValue => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [recentChats, setRecentChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshChats = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  useEffect(() => {
    const fetchRecentMessages = async () => {
      try {
        const response = await fetch('/api/chats/recent-messages');

        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }

        const data = await response.json();
        setRecentChats(data.messages);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentMessages();
  }, [refreshKey]);

  return (
    <ChatContext.Provider value={{ recentChats, loading, error, refreshKey, refreshChats }}>
      {children}
    </ChatContext.Provider>
  );
};