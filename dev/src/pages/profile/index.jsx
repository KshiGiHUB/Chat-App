import { useAppStore } from '@/store'
import React from 'react'

function Profile() {
    const { userInfo } = useAppStore();
    return (
        <div>{userInfo.email}</div>
    )
}

export default Profile