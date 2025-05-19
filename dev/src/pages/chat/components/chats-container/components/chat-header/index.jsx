import { useAppStore } from "@/store"
import { RiCloseFill } from "react-icons/ri"
import { Avatar } from '@/components/ui/avatar';
import { colors, getColor } from '@/components/lib/utils';

function ChatHeader() {
    const { closeChat, selectedChatData, selectedChatType } = useAppStore();
    return (
        <div className='h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-20'>
            <div className='flex gap-3 items-center'>
                <div className="h-12 w-12 rounded-full overflow-hidden">
                    {selectedChatType === 'contact' ? (
                        <Avatar className='h-12 w-12 rounded-full overflow-hidden'>
                            {selectedChatData?.image ? (
                                <AvatarImage className='object-cover w-full h-full bg-black'
                                    src={selectedChatData?.image}
                                    alt="profile" />
                            ) : (
                                <div className={`uppercase h-12 w-12  text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(selectedChatData?.color)}`}>
                                    {selectedChatData?.firstName ? selectedChatData?.firstName.split("").shift() : 'H'}
                                </div>
                            )
                            }
                        </Avatar>
                    ) : (
                        <div className='bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full'>#</div>
                    )}

                </div>
                <div>
                    {selectedChatType === 'channel' && selectedChatData.name}
                    {selectedChatType === 'contact' &&
                        selectedChatData?.firstName && selectedChatData?.lastName ? `${selectedChatData?.firstName} ${selectedChatData?.lastName}` : selectedChatData?.email
                    }
                </div>
            </div>
            <button className='text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all'
                onClick={closeChat}>
                <RiCloseFill className="text-3xl" />
            </button>
        </div>
    )
}

export default ChatHeader