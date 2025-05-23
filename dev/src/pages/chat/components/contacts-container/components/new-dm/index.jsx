import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useState } from 'react';
import { FaPlus } from "react-icons/fa"
import Lottie from 'react-lottie'
import { Input } from '@/components/ui/input';
import { animationDefaultOptions } from '@/components/lib/utils'
import { colors, getColor } from '@/components/lib/utils';


import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import { useAppStore } from '@/store';

const NewDm = () => {
    const { setSelectedChatType, setSelectedChatData } = useAppStore();
    const [openNewContactModal, setopenNewContactModal] = useState(false);
    const [searchedContacts, setSearchContacts] = useState([]);
    const searchContacts = async (searchTerm) => {
        try {
            if (searchTerm.length > 0) {
                const response = await fetch("http://localhost:5000/api/contacts/search", {
                    withCredentials: true,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        searchTerm
                    })
                })
                const data = await response.json();

                if (response.status === 200 && data.contacts) {

                    setSearchContacts(data.contacts)
                }
                else {
                    searchContacts([])
                }
            }

        } catch (error) {
            console.log(error);
        }
    }
    const selectNewContact = (contact) => {
        setSelectedChatType("contact")
        setSelectedChatData(contact)
        setopenNewContactModal(false)
        setSearchContacts([])
    }
    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger className='cursor-pointer'>
                        <FaPlus className='text-neutral-400 text-small 
                        font-light text-opacity-90 hover:text-neutral-100 cursor-pointer 
                        transition-all duration-300'
                            onClick={() => setopenNewContactModal(true)} />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Select new contact</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Dialog open={openNewContactModal} onOpenChange={setopenNewContactModal}>
                {/* <DialogTrigger>Open</DialogTrigger> */}
                <DialogContent className='bg-[#181920] border-none text-white w-[400px] h-[400px] flex-col'>
                    <DialogHeader>
                        <DialogTitle>Please select a contact</DialogTitle>
                        <DialogDescription>
                            {/* Please select a contact */}
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Input
                            placeholder="Search contact"
                            className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                            onChange={(e) => searchContacts(e.target.value)} />
                    </div>
                    {searchedContacts.length > 0 && (
                        <ScrollArea className='h-[250px]'>
                            <div className='flex flex-col gap-5'>
                                {searchedContacts.map((contact) => (
                                    <div key={contact?._id} className='flex gap-3 items-center cursor-pointer'
                                        onClick={() => selectNewContact(contact)}>
                                        <div className='w-12 h-12 relative'>
                                            <Avatar className='h-12 w-12 rounded-full overflow-hidden'>
                                                {contact?.image ? (
                                                    <AvatarImage className='object-cover w-full h-full bg-black'
                                                        src={contact?.image}
                                                        alt="profile" />
                                                ) : (
                                                    <div className={`uppercase h-12 w-12  text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(contact?.color)}`}>
                                                        {contact?.firstName ? contact?.firstName.split("").shift() : 'H'}
                                                    </div>
                                                )
                                                }
                                            </Avatar>
                                        </div>
                                        <div className='flex flex-col'>
                                            <span>
                                                {contact?.firstName && contact?.lastName ? `${contact?.firstName} ${contact?.lastName} ` : contact?.email}
                                            </span>
                                            <span className='text-xs'>{contact?.email}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    )}
                    {searchedContacts.length <= 0 && (
                        <div className='flex-1 md:bg-[#1c1d25] md:flex flex-col justify-center hidden duration-1000 transition-all'>
                            <Lottie
                                isClickToPauseDisabled={true}
                                height={100}
                                width={100}
                                options={animationDefaultOptions}
                            />
                            <div className='text-opacity-80 text-white flex flex-col gap-5 items-center mt-5 lg:text-2xl text-xl transition-all duration-300 text-center'>
                                <h3 className='poppins-medium'>Hi
                                    <span className='text-purple-500'>!</span> Search New
                                    <span className='text-purple-500'> Contacts.</span>
                                </h3>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

        </>
    )
}

export default NewDm