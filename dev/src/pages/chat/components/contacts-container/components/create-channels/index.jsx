import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useEffect, useState } from 'react';
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
import { Button } from '@/components/ui/button';
import MultipleSelector from '@/components/ui/multipleselect';

const CreateChannels = () => {
    const { setSelectedChatType, setSelectedChatData, addChannel } = useAppStore();
    const [openNewChannelModal, setopenNewChannelModal] = useState(false);
    const [searchedContacts, setSearchContacts] = useState([]);
    const [allContacts, setAllContacts] = useState([])
    const [selectedContacts, setSelectedContacts] = useState([])
    const [channelName, setChannelName] = useState("")

    useEffect(() => {
        const getData = async () => {
            const response = await fetch("http://localhost:5000/api/contacts/get-all-contact", {
                withCredentials: true,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "include",

            })
            const data = await response.json();
            setAllContacts(data.contacts)
        }
        getData()
    }, [])

    const createChannel = async () => {
        try {
            if (channelName.length > 0 && selectedContacts.length > 0) {
                const response = await fetch("http://localhost:5000/api/channel/create-channel", {
                    withCredentials: true,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        name: channelName,
                        members: selectedContacts.map((contact) => contact.value)
                    })
                })
                const data = await response.json();
                if (response.status === 201) {
                    setChannelName("")
                    setSelectedContacts([])
                    setopenNewChannelModal(false)
                    addChannel(data.channel)
                }
            }

        } catch (error) {
            console.log(error)
        }
    }


    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger className='cursor-pointer'>
                        <FaPlus className='text-neutral-400 text-small 
                        font-light text-opacity-90 hover:text-neutral-100 cursor-pointer 
                        transition-all duration-300'
                            onClick={() => setopenNewChannelModal(true)} />
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Select new Channel</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Dialog open={openNewChannelModal} onOpenChange={setopenNewChannelModal}>
                {/* <DialogTrigger>Open</DialogTrigger> */}
                <DialogContent className='bg-[#181920] border-none text-white w-[400px] h-[400px] flex-col'>
                    <DialogHeader>
                        <DialogTitle>Please fill up the details for new channel</DialogTitle>
                        <DialogDescription>
                            {/* Please select a contact */}
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Input
                            placeholder="Channel Name"
                            className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                            onChange={(e) => setChannelName(e.target.value)}
                            value={channelName} />
                    </div>
                    <div>
                        <MultipleSelector
                            className='rounded-lg bg-[#2c2e3b] border-none py-2 text-white'
                            defaultOptions={allContacts}
                            placeholder="Search Contacts"
                            value={selectedContacts}
                            onChange={setSelectedContacts}
                            emptyIndicator={
                                <p className='text-center text-lg leading-10 text-gray-600'>No results found</p>
                            } />
                    </div>
                    <div>
                        <Button className='w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300' onClick={createChannel}>
                            Create Channel
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

        </>
    )
}

export default CreateChannels