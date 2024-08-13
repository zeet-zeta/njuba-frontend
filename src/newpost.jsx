import React, { useState, useRef } from 'react';
import axios from 'axios';

export const NewPost = ({ posts, setPosts, setPostsCount }) => {
    const [newPostContent, setNewPostContent] = useState('');
    const [images, setImages] = useState([]);
    const isFirefox = true;

    const handleClick = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handlePostSubmit = () => {
        if (newPostContent === '' && images.length == 0) {
            alert('发送内容不能为空');
            return;
        }
        const newPost = {
            sender: localStorage.getItem('username'),
            category: document.getElementsByClassName('active')[0].textContent,
            content: newPostContent,
            img: images,
            time: new Date().toLocaleString(),
            likes: [],
            comments: [],
        };
        setPosts([newPost, ...posts]);
        setPostsCount(prev => prev + 1);
        axios.post('http://localhost:7001/post/create', newPost);
        setNewPostContent('');
        setImages([]);
    };

    const handlePicSubmit = async () => {
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
                multiple: true,
            };
            const fileHandles = await window.showOpenFilePicker(pickerOpts);
            const formData = new FormData();
            for (const handle of fileHandles) {
                const file = await handle.getFile();
                formData.append('file', file);
            }
            const response = await axios.post('http://localhost:7001/image/upload', formData);
            if ([...images, ...response.data].length <= 9) {
                setImages([...images, ...response.data]);
            } else {
                alert("最多添加九张图片嗷");
            }
        } catch (error) {
            console.error('Error handling file:', error);
        }
    }

    const fileInputRef = useRef(null);

    const handleButtonClick = () => {
        fileInputRef.current.click();
    };

    const firefoxUploadImage = async (event) => {
        const files = event.target.files;
        const formData = new FormData();
        if (files.length > 0) {
            for (const file of files) {
                if (file.type.startsWith('image/')) {
                    formData.append('file', file);
                } else {
                    alert('只能上传图片文件！');
                    event.target.value = null;
                    return;
                }
            }
        }
        const response = await axios.post('http://localhost:7001/image/upload', formData);
        if ([...images, ...response.data].length <= 9) {
            setImages([...images, ...response.data]);
        } else {
            alert("最多添加九张图片嗷");
        }
    }

    return (
        <div className="new-post">
            <h3>发表新帖子</h3>
            <div className="content-wrapper">
                <textarea placeholder="写下你的奇思妙想" value={newPostContent} onChange={(e) => setNewPostContent(e.target.value)} />
            </div>
            <div className="image-grid2">
                {images.map((item, index) => (
                    <div key={index} className="image-item2">
                        <img src={item} alt={`Image ${index + 1}`} onClick={() => handleClick(index)} />
                    </div>
                )
                )}
            </div>
            <div className="buttons">
                <button onClick={isFirefox ? handleButtonClick : handlePicSubmit}>配图</button>
                <button onClick={handlePostSubmit}>发表</button>
            </div>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept='image/*'
                onChange={firefoxUploadImage}
                multiple
            />
        </div>
    )
}

