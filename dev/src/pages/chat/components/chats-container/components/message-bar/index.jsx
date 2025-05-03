import { useSocket } from '@/context/SocketContext';
import { useAppStore } from '@/store';
import EmojiPicker from 'emoji-picker-react';
import React, { useEffect, useRef, useState } from 'react'
import { GrAttachment } from 'react-icons/gr'
import { IoSend } from 'react-icons/io5';
import { RiEmojiStickerLine } from 'react-icons/ri';

const MessageBar = () => {
    const { selectedChatData, selectedChatType, setSelectedChatMessages, selectedChatMessages, userInfo } = useAppStore();
    const socket = useSocket()
    const emojiRef = useRef();
    const [message, setMessage] = useState("");
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);

    useEffect(() => {
        const getMessages = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/messages/get-messages", {
                    withCredentials: true,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        id: selectedChatData._id,
                    })
                })
                const data = await response.json();

                if (data.messages) {
                    setSelectedChatMessages(data.messages)
                }
            } catch (error) {
                console.log(error);
            }
        }
        if (selectedChatData._id) {
            if (selectedChatType === "contact") {
                getMessages();
            }
        }
    }, [selectedChatData, selectedChatType])

    useEffect(() => {
        function handleClickOutside(event) {
            if (emojiRef.current && !emojiRef.current.contains(event.target)) {
                setEmojiPickerOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.addEventListener("mousedown", handleClickOutside)
        }

    }, [emojiRef])

    const handleAddEmoji = (emoji) => {
        setMessage((msg) => msg + emoji.emoji)
    }

    const handleSendMessage = async () => {
        if (selectedChatType === 'contact') {
            socket.emit("sendMessage", {
                sender: userInfo.user.id,
                content: message,
                recipient: selectedChatData._id,
                messageType: "text",
                fileUrl: undefined,
            })
        }
    }
    return (
        <div className='h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6'>
            <div className='flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5'>
                <input type="text"
                    className='flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none'
                    placeholder='Enter message'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)} />
                <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all'>
                    <GrAttachment className='text-2xl' />
                </button>
                <div className='relative'>
                    <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all'
                        onClick={() => setEmojiPickerOpen(true)}>
                        <RiEmojiStickerLine className='text-2xl' />
                    </button>
                    <div className='absolute bottom-16 right-0' ref={emojiRef}>
                        <EmojiPicker
                            theme="dark"
                            open={emojiPickerOpen}
                            onEmojiClick={handleAddEmoji}
                            autoFocusSearch={false} />
                    </div>
                </div>
            </div>
            <button
                className='bg-[#8417ff] text-white rounded-md flex items-center justify-center p-5 focus:text-white hover:bg-[#741bda] text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all'
                onClick={handleSendMessage}>
                <IoSend className='text-2xl' />
            </button>
        </div>
    )
}

export default MessageBar