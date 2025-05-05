import { useAppStore } from '@/store'
import React from 'react'

const ContactList = ({ contacts, isChannel = false }) => {

    const {
        selectedChatType,
        selectedChatData,
        setSelectedChatData,
        setSelectedChatType,
        setSelectedChatMessages,
    } = useAppStore();

    const handleClick = (contact) => {
        if (isChannel) {
            selectedChatType("channel")
        }
        else {
            selectedChatType("contact")
            selectedChatData(contact)
        }
        if (selectedChatData && selectedChatData._id !== contact._id) {
            setSelectedChatMessages([])
        }

    }
    return (
        <div className='mt-5'>
            {contacts.map((contact) => (
                <div key={contact._id}></div>
            ))}
        </div>
    )
}

export default ContactList