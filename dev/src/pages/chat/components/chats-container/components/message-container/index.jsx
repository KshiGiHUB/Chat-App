import { useAppStore } from '@/store'
import moment from 'moment'
import React, { useEffect, useRef, useState } from 'react'
import { MdFolderZip } from "react-icons/md"
import { IoMdArrowRoundDown } from "react-icons/io"
import { IoCloseSharp } from 'react-icons/io5'
import { getColor } from '@/components/lib/utils'
import { Avatar } from '@/components/ui/avatar'

const MessageContainer = () => {
    const scrollRef = useRef()
    const { userInfo, selectedChatType, selectedChatData, addMessage, selectedChatMessages, setSelectedChatMessages } = useAppStore()
    const [showImage, setShowImage] = useState(false)
    const [imageURL, setImageURL] = useState(null)

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

                console.log(data)
                if (data.messages) {
                    setSelectedChatMessages(data.messages)
                }
            } catch (error) {
                console.log(error);
            }
        }

        const getChannelMessages = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/channel/get-channel-messages/${selectedChatData._id}`, {
                    withCredentials: true,
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: "include",

                })
                const data = await response.json();

                console.log(data)
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
            } else if (selectedChatType === "channel") {
                getChannelMessages();
            }
        }
    }, [selectedChatData, selectedChatType])

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [selectedChatMessages])

    const checkIfImage = (filepath) => {
        const imageRegex =
            /\.(jpg|png|jpeg|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
        return imageRegex.test(filepath)
    }

    const downloadFile = async (file) => {
        try {
            const response = await fetch(`http://localhost:5000/${file}`, {
                method: 'GET',
                credentials: "include",
            });

            const blob = await response.blob();
            const urlBlob = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = urlBlob;
            link.setAttribute("download", file.split("/").pop());
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(urlBlob);
        } catch (error) {
            console.error("Download failed", error);
        }
    }


    const renderMessage = () => {
        let lastDate = null;
        return selectedChatMessages.map((message, index) => {
            const messageDate = moment(message.timestamp).format("YYY-MM-DD")
            const showDate = messageDate !== lastDate
            lastDate = messageDate
            return (
                <div key={index}>
                    {showDate && ( // this one is for showing date 
                        <div className='text-center text-gray-500 my-2'>
                            {moment(message.timestamp).format("LL")}
                        </div>
                    )}
                    {selectedChatType === "contact" && renderDMMessages(message)}
                    {selectedChatType === "channel" && renderChannelMessages(message)}

                </div>
            )
        })
    }

    const renderDMMessages = (message) => (
        <div className={`${message.sender === selectedChatData._id ? "text-left" : "text-right"}`}>
            {message.messageType === 'text' && (
                <div className={`${message.sender !== selectedChatData._id ?
                    "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" :
                    "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
                    } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
                >
                    {message.content}
                </div>
            )}
            {message.messageType === "file" && (
                <div className={`${message.sender !== selectedChatData._id ?
                    "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" :
                    "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
                    } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
                >
                    {checkIfImage(message.fileUrl) ? (
                        <div className='cursor-pointer'
                            onClick={() => {
                                setShowImage(true)
                                setImageURL(message.fileUrl)
                            }}>
                            <img src={`http://localhost:5000/${message.fileUrl}`}
                                height={300}
                                width={300} />
                        </div>
                    ) : (
                        <div className='flex items-center justify-center gap-4'>
                            <span className='text-white/8- text-3xl bg-black/20 rounded-full p-3'>
                                <MdFolderZip />
                            </span>
                            <span>{message.fileUrl.split("/").pop()}</span>
                            <span className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300'
                                onClick={() => downloadFile(message.fileUrl)}>
                                <IoMdArrowRoundDown />
                            </span>
                        </div>
                    )}
                </div>
            )}
            <div className='text-xs text-gray-600'>
                {moment(message.timestamp).format("LT")}
            </div>
        </div>
    )

    const renderChannelMessages = (message) => {
        return (
            <div className={`mt-5 ${message.sender._id === userInfo._id ? "text-left" : "text-right"}`}>
                {message.messageType === 'text' && (
                    <div className={`${message.sender._id === userInfo.id ?
                        "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" :
                        "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
                        } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
                    >
                        {message.content}
                    </div>
                )}
                {message.messageType === "file" && (
                    <div className={`${message.sender._id === userInfo.id ?
                        "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50" :
                        "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
                        } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
                    >
                        {checkIfImage(message.sender.fileUrl) ? (
                            <div className='cursor-pointer'
                                onClick={() => {
                                    setShowImage(true)
                                    setImageURL(message.sender.fileUrl)
                                }}>
                                <img src={`http://localhost:5000/${message.sender.fileUrl}`}
                                    height={300}
                                    width={300} />
                            </div>
                        ) : (
                            <div className='flex items-center justify-center gap-4'>
                                <span className='text-white/8- text-3xl bg-black/20 rounded-full p-3'>
                                    <MdFolderZip />
                                </span>
                                <span>{message.fileUrl.split("/").pop()}</span>
                                <span className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300'
                                    onClick={() => downloadFile(message.sender.fileUrl)}>
                                    <IoMdArrowRoundDown />
                                </span>
                            </div>
                        )}
                    </div>
                )}
                {message.sender._id !== userInfo.id ? (
                    <div className='flex items-center justify-start gap-3'>
                        <Avatar className='h-12 w-12 rounded-full overflow-hidden'>
                            {message.sender?.image ? (
                                <AvatarImage className='object-cover w-full h-full bg-black'
                                    src={message.sender?.image}
                                    alt="profile" />
                            ) : (
                                <div className={`uppercase h-12 w-12  text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(message.sender?.color)}`}>
                                    {message.sender?.firstName ? message.sender?.firstName.split("").shift() : 'H'}
                                </div>
                            )
                            }
                        </Avatar>
                        <span className='text-sm text-white/60'>
                            {`${message.sender.firstName} ${message.sender.lastName}`}
                        </span>
                        <span className='text-xs text-white/60'>{moment(message.timestamp).format("LT")}</span>
                    </div>
                ) : (
                    <div className='text-xs text-white/60 mt-1'>{moment(message.timestamp).format("LT")}</div>
                )}
            </div>
        )
    }

    return (
        <div className='flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65w] lg:w-[70vw] xl:w-[80vw] w-full'>
            {renderMessage()}
            <div ref={scrollRef} />
            {
                showImage && (
                    <div className='fixed z-[1000] top-0  left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col '>
                        <div>
                            <img src={`http://localhost:5000/${imageURL}`}
                                className='h[50vh] w-[50vw] bg-cover' />
                        </div>
                        <div className='flex gap-5 fixed top-0 mt-5'>
                            <button className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300'
                                onClick={() => downloadFile(imageURL)}>
                                <IoMdArrowRoundDown />
                            </button>
                            <button className='bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300'
                                onClick={() => {
                                    setImageURL(null)
                                    setShowImage(false)
                                }}>
                                <IoCloseSharp />
                            </button>
                        </div>
                    </div>
                )
            }
        </div >
    )
}

export default MessageContainer 