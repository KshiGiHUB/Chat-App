import React, { useEffect } from 'react'
import { useAppStore } from '@/store'
import { Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import ChatsContainer from './components/chats-container';
import ContactsContainer from './components/contacts-container';
import EmptyChatContainer from './components/empty-chat-container';


function Chat() {
    const { userInfo, selectedChatType } = useAppStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (userInfo === undefined) return;

        if (!userInfo.profileSetup) {
            toast("Please setup profile to continue");
            navigate("/profile");
        }
    }, [userInfo, navigate])
    return (
        <div className='flex h-[100vh] text-white overflow-hidden'>
            <ContactsContainer />
            {
                selectedChatType === undefined ? <EmptyChatContainer /> : <ChatsContainer />
            }
            {/* <EmptyChatContainer /> */}
            {/* <ChatsContainer /> */}

        </div>
    )
}

export default Chat