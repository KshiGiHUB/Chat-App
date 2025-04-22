import React from 'react'
import { getColor } from '@/components/lib/utils';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { useAppStore } from '@/store';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FiEdit2 } from "react-icons/fi"
import { IoPowerSharp } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom';


const ProfileInfo = () => {
    const { userInfo, setUserInfo } = useAppStore();
    const navigate = useNavigate();

    const logout = async () => {
        try {
            const response = await fetch("http://localhost:5000/api/auth/logout", {
                withCredentials: true,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",
            });

            if (response.status === 200) {
                setUserInfo(null)
                navigate('/auth')
            }
        } catch (error) {
            console.log(error)
        }
    }
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
            <div className='flex gap-5'>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger className='cursor-pointer'>
                            <FiEdit2 className='text-purple-500 text-xl font-medium' onClick={() => navigate('/profile')} />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Edit Profile</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger className='cursor-pointer'>
                            <IoPowerSharp className='text-red-500 text-xl font-medium' onClick={logout} />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Logout</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

            </div>

        </div>
    )
}

export default ProfileInfo