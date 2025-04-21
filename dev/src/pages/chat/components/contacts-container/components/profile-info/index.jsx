import React from 'react'
import { getColor } from '@/components/lib/utils';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { useAppStore } from '@/store';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FiEdit2 } from "react-icons/fi"


const ProfileInfo = () => {
    const { userInfo } = useAppStore();
    // console.log(userInfo.color)
    return (
        <div className='absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#212b33]'>
            <div className='flex gap-3 items-center justify-center'>
                <div className='w-12 h-12 relative'>
                    <Avatar className='h-12 w-12 rounded-full overflow-hidden'>
                        {userInfo.user.image ? (
                            <AvatarImage className='object-cover w-full h-full bg-black'
                                src={userInfo.user.image}
                                alt="profile" />
                        ) : (
                            <div className={`uppercase h-12 w-12  text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(userInfo.user.color)}`}>
                                {userInfo.user.firstName ? userInfo.user.firstName.split("").shift() : 'H'}
                            </div>
                        )

                        }
                    </Avatar>
                </div>
                <div>
                    {userInfo.user.firstName && userInfo.user.lastName ? `${userInfo.user.firstName} ${userInfo.user.lastName} ` : "no"}
                </div>
            </div>
            <div>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <FiEdit2 className='text-purple-500 text-xl font-medium' />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Add to library</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

            </div>

        </div>
    )
}

export default ProfileInfo