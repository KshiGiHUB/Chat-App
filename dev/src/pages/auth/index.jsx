import React, { useState } from 'react'
import victory from "@/assets/victory.svg"
import background from "@/assets/login2.png"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { apiClient } from '@/components/lib/api-client';
import { SIGNUP_ROUTE } from '@/utils/constants';
import { ReplyAll } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store';

function Auth() {
    const navigate = useNavigate()
    const { setUserInfo } = useAppStore()
    const [isEmail, setEmail] = useState("");
    const [isPassword, setPassword] = useState("");
    const [isConfirmPassword, setConfirmPassword] = useState("");

    const validateLogin = () => {
        if (!isEmail.length) {
            toast.error("Email is empty")
            return false;
        }
        if (!isPassword.length) {
            toast.error("Password is empty")
            return false;
        }
        return true;
    }

    const validateSignUp = () => {
        if (!isEmail.length) {
            toast.error("Email is empty")
            return false;
        }
        if (!isPassword.length) {
            toast.error("Password is empty")
            return false;
        }
        if (isConfirmPassword != isPassword) {
            toast.error("Password and confirm password should be same")
            return false;
        }
        return true;
    }
    const handleLoginUp = async () => {
        if (validateLogin()) {
            try {
                const response = await fetch("http://localhost:5000/api/auth/login", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        email: isEmail,
                        password: isPassword
                    })
                })
                const data = await response.json();

                if (data.status === 404) {
                    toast.error(data.message)
                }

                if (data.user?.id) {
                    setUserInfo(data)
                    if (data.user.profileSetup) navigate("/chat")
                    else navigate("/profile")
                }

            } catch (error) {
                console.error("login error", error)
            }
        }
    }
    const handleSignUp = async () => {
        if (validateSignUp()) {
            try {
                const response = await fetch("http://localhost:5000/api/auth/signup", {
                    withCredentials: true,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        email: isEmail,
                        password: isPassword
                    })
                });
                const data = await response.json();
                // console.log(data)

                if (response.status === 201) {
                    setUserInfo(data.user)
                    navigate('/profile')
                }

            } catch (error) {
                console.error("Signup Error:", error);
            }
        }
    };


    return (
        <div className='h-[100vh] w-[100vw] flex items-center justify-center'>
            <div className='h-[80vh] bg-white border-2 border-white text-opacity-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70-vw] xl:w-[60vw] rounded-3xl grid xl:grid:cols-2'>
                <div className='flex flex-col gap-10 items-center justify-center'>
                    <div className='flex items-center justify-center flex-col'>
                        <div className='flex items-center justify-center'>
                            <h1 className='text-5xl font-bold md:text-6xl'>Welcome</h1>
                            <img src={victory} alt="victory" className='h-[100px]'></img>
                        </div>
                        <p className='font-medium text-center'>
                            Fill in the details to get started with the best chat app
                        </p>
                    </div>
                    <div className='flex items-center justify-center w-full'>
                        <Tabs className='w-3/4' defaultValue='Login'>
                            <TabsList className='bg-transparent rounded-none w-full flex justify between'>
                                <TabsTrigger value='Login' className='data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full
                                data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300'>
                                    Login
                                </TabsTrigger>
                                <TabsTrigger value='Signup' className='data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full
                                data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300'>
                                    Signup
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent className='flex flex-col gap-5 mt-10' value='Login'>
                                <Input
                                    placeholder="Email"
                                    type="email"
                                    className='rounded-full p-6'
                                    value={isEmail}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <Input
                                    placeholder="Password"
                                    type="password"
                                    className='rounded-full p-6'
                                    value={isPassword}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <Button className="rounded-full p-6" onClick={handleLoginUp}>Login</Button>
                            </TabsContent>
                            <TabsContent className='flex flex-col gap-5 mt-10' value='Signup'>
                                <Input
                                    placeholder="Email"
                                    type="email"
                                    className='rounded-full p-6'
                                    value={isEmail}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <Input
                                    placeholder="Password"
                                    type="password"
                                    className='rounded-full p-6'
                                    value={isPassword}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <Input
                                    placeholder="Confirm Password"
                                    type="password"
                                    className='rounded-full p-6'
                                    value={isConfirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <Button className="rounded-full p-6" onClick={handleSignUp}>Signup</Button>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
                {/* <div className='hidden xl:flex justify-center items-center'>
                    <img src={background} alt='background-login' className='h-[700px]' />
                </div> */}
            </div>
        </div>
    )
}

export default Auth