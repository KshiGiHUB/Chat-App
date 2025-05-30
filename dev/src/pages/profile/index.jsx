import { colors, getColor } from '@/components/lib/utils';
import { useAppStore } from '@/store'
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import React, { useEffect, useRef, useState } from 'react'
import { IoArrowBack } from "react-icons/io5"
import { FaPlus, FaTrash } from "react-icons/fa"
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const navigate = useNavigate()

    const { userInfo, setUserInfo } = useAppStore();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [image, setImage] = useState(null);
    const [hovererd, setHovered] = useState(false);
    const [selectedcolor, setSelectedColor] = useState(0);
    const fileInputRef = useRef(null)

    // console.log(userInfo)

    useEffect(() => {
        if (userInfo.profileSetup) {
            setFirstName(userInfo.firstName)
            setLastName(userInfo.lastName)
            setSelectedColor(userInfo.color)
        }
    }, [userInfo])

    const validateProfile = () => {
        if (!firstName) {
            toast.error("first name is required")
            return false;
        }
        if (!lastName) {
            toast.error("lastname is required");
            return false;
        }
        return true;
    }
    const saveChanges = async () => {
        if (validateProfile()) {
            try {
                const response = await fetch("http://localhost:5000/api/auth/update-profile", {
                    withCredentials: true,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        firstName,
                        lastName,
                        color: selectedcolor
                    })
                })
                const data = await response.json();

                if (response.status === 200) {
                    setUserInfo(data.user)
                    // console.log(data)
                    toast.success("Profile updated successfully")
                    navigate("/chat")
                }

            } catch (error) {
                console.log("update error", error)
            }
        }
    }

    const handleNavigate = () => {
        if (userInfo.profileSetup) {
            navigate("/chat")
        } else {
            toast.error("Please setup profile")
        }
    }

    const handleFileInputClick = () => {
        fileInputRef.current.click()
    }

    const handleImageChange = () => { }
    const handleDeleteImage = () => { }


    return (
        <div className='bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10'>
            <div className='flex flex-col gap-10 w-[100vw] md:w-max'>
                <div onClick={handleNavigate}>
                    <IoArrowBack className='text-4xl lg:text-6xl text-white/90 cursor-pointer' />
                </div>
                <div className='grid grid-cols-2'>
                    <div className='h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center'
                        onMouseEnter={() => setHovered(true)}
                        onMouseLeave={() => setHovered(false)}
                    >
                        <Avatar className='h-32 w-32 mid:w-48 md:h-48 rounded-full overflow-hidden'>
                            {image ? (
                                <AvatarImage className='object-cover w-full h-full bg-black'
                                    src={image}
                                    alt="profile" />
                            ) : (
                                <div className={`uppercase h-32 w-32 mid:h-48 md:w-48 text-5xl border-[1px] flex items-center justify-center rounded-full ${getColor(selectedcolor)}`}>
                                    {firstName ? firstName.split("").shift() : 'H'}
                                </div>
                            )

                            }
                        </Avatar>
                        {hovererd && (
                            <div className='absolute inset-0 flex items-center justify-center bg-black/50 rounded-full'
                                onClick={image ? handleDeleteImage : handleFileInputClick}>
                                {image ? (
                                    <FaTrash className='text-white text-3xl cursor-pointer' />
                                ) : (
                                    <FaPlus className='text-white text-3xl cursor-pointer' />
                                )}
                            </div>
                        )}
                        <input
                            type="text"
                            ref={fileInputRef}
                            className='hidden'
                            onChange={handleImageChange}
                            name="profile-image"
                            accept='.png, .jpg, .jpeg, .webp, .svg'
                        />
                    </div>
                    <div className='flex mid-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center'>
                        <div className='w-full'>
                            <Input
                                placeholder="Email"
                                type="email"
                                disabled
                                value={userInfo.email}
                                className="rounded-lg p-6 bg-[#2c2e3b] border-none" />
                            <Input
                                placeholder="FirstName"
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="rounded-lg p-6 bg-[#2c2e3b] border-none" />
                            <Input
                                placeholder="LastName"
                                type="text"
                                onChange={(e) => setLastName(e.target.value)}
                                value={lastName}
                                className="rounded-lg p-6 bg-[#2c2e3b] border-none" />
                        </div>
                        <div className='w-full flex gap-5'>
                            {colors.map((color, index) => (
                                <div
                                    className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300
                                    ${selectedcolor === index ? "outline outline-white outline-1" : ""}`}
                                    key={index}
                                    onClick={() => setSelectedColor(index)}>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className='w-full'>
                    <Button className='h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300'
                        onClick={saveChanges}>Save Changes</Button>
                </div>
            </div>
        </div>
    )
}

export default Profile