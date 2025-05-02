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
                query: { userId: userInfo.user.id },
            })
            // console.log(userInfo)
            console.log("Socket Object:", socket.current);
            socket.current.on("connect", () => {
                console.log('connected to socket server')
            })

            const handleRecieveMessage = (message) => {
                const { selectedChatType, selectedChatData, addMessage } = useAppStore.getState();
                // console.log(message)
                // console.log('chat', selectedChatData)
                if (selectedChatType !== undefined && (selectedChatData._id === message.sender._id || selectedChatData._id === message.recipient._id)) {
                    console.log('msg', message)
                    addMessage(message)
                }
            }

            socket.current.on("receiveMessage", handleRecieveMessage)

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