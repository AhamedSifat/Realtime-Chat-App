import { useEffect, useRef } from 'react';
import { useChatStore } from '../store/useChatStore';
import MessageInput from './MessageInput';
import ChatHeader from './ChatHeader';
import MessageSkeleton from './skeletons/MessageSkeleton';
import useAuthStore from '../store/useAuthStore';
import { formatMessageTime } from '../lib/formatMessageTime';

function ChatContainer() {
  const {
    messages,
    getMessages,
    isMessageLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [
    selectedUser._id,
    getMessages,
    unsubscribeFromMessages,
    subscribeToMessages,
  ]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (isMessageLoading) {
    return <MessageSkeleton />;
  }
  return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <ChatHeader />
      <div className='flex-1 overflow-y-auto p-4 space-y-4'>
        {messages?.map((message) => (
          <div
            ref={messageEndRef}
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? 'chat-end' : 'chat-start'
            }`}
          >
            <div className='chat-image avatar'>
              <div className='w-10 rounded-full'>
                <img
                  alt='profile pic'
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || '/avatar.png'
                      : selectedUser.profilePic || '/avatar.png'
                  }
                />
              </div>
            </div>
            <div className='chat-header mb-1'>
              {message.senderId === authUser._id
                ? authUser.fullName
                : selectedUser.fullName}
              <time className='text-xs opacity-50'>
                {formatMessageTime(message.createdAt)}
              </time>
            </div>

            <div className='chat-bubble flex flex-col'>
              {message.image && (
                <img
                  src={message.image}
                  alt='Attachment'
                  className='sm:max-w-[200px] rounded-md mb-2'
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>
      <MessageInput />
    </div>
  );
}

export default ChatContainer;
