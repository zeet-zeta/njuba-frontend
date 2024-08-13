import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';

export const UserAvatar = ({ refresh, setRefresh }) => {
    const username = localStorage.getItem('username');
    const [avatarUrl, setAvatarUrl] = useState('');
    const isFirefox = ! ('showOpenFilePicker' in window);

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



    const fileInputRef = useRef(null);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const firefoxUploadImage = async (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.type.startsWith('image/')) {
                const formData = new FormData();
                formData.append('file', file);
                await axios.post(`http://localhost:7001/image/avatar/${username}/set`, formData);
            } else {
                alert('只能上传图片文件！');
                event.target.value = null;
            }
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
                <div className="menu-item" onClick={isFirefox ? handleButtonClick : uploadImage}>更换头像</div>
                <div className="menu-item" onClick={logout}>退出登录</div>
            </div>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept='image/*'
                onChange={firefoxUploadImage}
            />
        </div>
    );
};