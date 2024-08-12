import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const UserAvatar = ({ refresh, setRefresh}) => {
    const username = localStorage.getItem('username');
    const [avatarUrl, setAvatarUrl] = useState('');

    const toggleMenu = () => {
        const menu = document.getElementById('menu');
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    }

    const logout = () => {
        localStorage.clear();
        window.location.href = '/login';
    }

    const uploadImage = async () => {
        try {
            const pickerOpts = {
                types: [
                    {
                        description: "Images",
                        accept: {
                            "image/*": [".png", ".gif", ".jpeg", ".jpg"],
                        },
                    },
                ],
                excludeAcceptAllOption: true,
                multiple: false,
            };
            const [fileHandle] = await window.showOpenFilePicker(pickerOpts);
            const file = await fileHandle.getFile();
            const formData = new FormData();
            formData.append('file', file);
            await axios.post(`http://localhost:7001/image/avatar/${username}/set`, formData);
        } catch (error) {
            console.error('Error handling file:', error);
        }
        setRefresh(prev => !prev);
        toggleMenu();
    }

    useEffect(() => {
        const fetchAvatar = async () => {
            try {
                const response = await axios.get(`http://localhost:7001/image/avatar/${username}/get`);
                setAvatarUrl(response.data);
            } catch (error) {
                console.error('Error fetching avatar:', error);
            }
        };
        fetchAvatar();
    }, [refresh]);

    return (
        <div className="avatar-container">
            <div className="avatar" onClick={toggleMenu}>
                <img src={avatarUrl} alt="头像" id="avatar" />
            </div>
            <div className="menu" id="menu">
                <div className="menu-item" onClick={uploadImage}>更换头像</div>
                <div className="menu-item" onClick={logout}>退出登录</div>
            </div>
        </div>
    );
};