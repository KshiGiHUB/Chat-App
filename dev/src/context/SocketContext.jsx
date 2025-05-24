import { useAppStore } from "@/store";

import { createContext, useContext, useRef, useEffect } from 'react';
import { io } from "socket.io-client";

const SocketContext = createContext(null)

export const useSocket = () => useContext(SocketContext)


export const SocketProvider = ({ children }) => {
    const socket = useRef();
    const { userInfo } = useAppStore()
    useEffect(() => {
        if (userInfo) {
            socket.current = io('http://localhost:5000', {
                withCredentials: true,
                query: { userId: userInfo.id },
            })
            socket.current.on("connect", () => {
                console.log('connected to socket server')
            })

            const handleRecieveMessage = (message) => {
                const { selectedChatType, selectedChatData, addMessage, addContactInDmContact } = useAppStore.getState();

                if (selectedChatType !== undefined && (selectedChatData._id === message.sender._id || selectedChatData._id === message.recipient._id)) {

                    addMessage(message)
                }
                addContactInDmContact(message)
            }

            const handleRecieveChannelMessage = (message) => {

                const { selectedChatData, selectedChatType, addMessage, addChannelInChannelList } = useAppStore.getState();

                if (selectedChatType !== undefined && selectedChatData._id === message.channelId) {
                    addMessage(message)
                }
                addChannelInChannelList(message)
            }

            socket.current.on("receiveMessage", handleRecieveMessage)
            socket.current.on("receive-channel-message", handleRecieveChannelMessage)

            return () => {
                socket.current.disconnect()
            }
        }
    }, [userInfo])

    return (
        <SocketContext.Provider value={socket.current}>
            {children}
        </SocketContext.Provider>
    )
}