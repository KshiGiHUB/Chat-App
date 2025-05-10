import { useAppStore } from '@/store'
import moment from 'moment'
import React, { useEffect, useRef } from 'react'
import { MdFolderZip } from "react-icons/md"
import { IoMdArrowRoundDown } from "react-icons/io"

const MessageContainer = () => {
    const scrollRef = useRef()
    const { userInfo, selectedChatType, selectedChatData, addMessage, selectedChatMessages } = useAppStore()

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
                        <div className='cursor-pointer'>
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

    return (
        <div className='flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65w] lg:w-[70vw] xl:w-[80vw] w-full'>
            {renderMessage()}
            <div ref={scrollRef} />
        </div>
    )
}

export default MessageContainer 