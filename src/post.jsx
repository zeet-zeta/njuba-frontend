import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const Post = ({ category, posts, setPosts, refresh, postsCount, setPostsCount }) => {

    const [commentsCount, setCommentsCount] = useState(0);
    const [likesCount, setLikesCount] = useState(0);

    useEffect(() => {
        const fetchPost = async () => {
            if (category !== '') {
                try {
                    const response = await axios.get(`http://localhost:7001/post/${category}/get`);
                    setPosts(response.data);
                    const stats = await axios.get(`http://localhost:7001/post/${category}/overview`);
                    setPostsCount(stats.data.postsCount);
                    setCommentsCount(stats.data.commentsCount);
                    setLikesCount(stats.data.likesCount);
                } catch (error) {
                    console.error('Error fetching posts:', error);
                }
            }
        };
        fetchPost();
    }, [category]);


    return (
        <div>
            <div className='statistics'>
                <h1>📫 {postsCount} 💬 {commentsCount} ❤️ {likesCount}</h1>
            </div>
            <div className="posts">
                {posts.map((post, index) => (
                    <Single post={post} refresh={refresh} key={index} setLikesCount={setLikesCount} setCommentsCount={setCommentsCount}/>
                ))}
            </div>
            <div className="divider-container">
                <hr className="divider-line" />
                <span className="divider-text">你已到达世界尽头</span>
                <hr className="divider-line" />
            </div>
        </div>
    )
}

const Single = ({ post, refresh, setLikesCount, setCommentsCount }) => {
    const username = localStorage.getItem('username');
    const [newComment, setNewComment] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [like, setLike] = useState('');
    const [likes, setLikes] = useState('');
    const [commentsTemp, setCommentsTemp] = useState([]);

    const [isOpen, setIsOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');

    const handleImageClick = (image) => {
        setSelectedImage(image);
        setIsOpen(true);
    };

    const closePreview = () => {
        setIsOpen(false);
        setSelectedImage('');
    };

    useEffect(() => {
        const fetchAvatar = async () => {
            try {
                const response = await axios.get(`http://localhost:7001/image/avatar/${post.sender}/get`);
                setAvatarUrl(response.data);
                setLike(post.likes.includes(username) ? '❤️' : '🤍')
                setLikes(post.likes.length);
                setCommentsTemp(post.comments);
            } catch (error) {
                console.error('Error fetching avatar:', error);
            }
        };
        fetchAvatar();
    }, [post, refresh]);

    const handleLike = () => {
        if (like === '❤️') {
            setLike('🤍');
            setLikes(prev => prev - 1);
            setLikesCount(prev => prev - 1);
            axios.post(`http://localhost:7001/post/${username}/unlike`, { id: post.time });   
        } else {
            setLike('❤️');
            setLikes(prev => prev + 1);
            setLikesCount(prev => prev + 1);
            axios.post(`http://localhost:7001/post/${username}/like`, { id: post.time });
        }
    };

    const handleComment = () => {
        if (newComment === '') {
            alert("评论不能为空");
            return;
        }
        const comment = {
            name: username,
            text: newComment
        }
        setCommentsTemp([...commentsTemp, comment]);
        setCommentsCount(prev => prev + 1);
        axios.post(`http://localhost:7001/post/${username}/comment`, { id: post.time, text: newComment });
        setNewComment('');
    };

    return (
        <div className="post" key={post.time}>
            <div className="avatar">
                <img src={avatarUrl} alt="头像" id="avatar" />
            </div>
            <h3>{post.sender}</h3>
            <p>{post.content}</p>
            <div className="image-grid">
                {post.img.map((item, index) => (
                    <div key={index} className="image-item" onClick={() => handleImageClick(item)}>
                        <img src={item} alt={`Image ${index + 1}`} />
                    </div>
                )
                )}
            </div>
            {isOpen && (
                <div className="lightbox" onClick={closePreview}>
                    <img src={selectedImage} alt="Selected" className="lightbox-image" />
                </div>
            )}
            <p>{post.time}</p>
            <div className="comment-container">
                {commentsTemp.map((comment, index) => (
                    <div className="comment" key={index}>
                        <span className="comment-name">{comment.name}</span>：
                        <span className="comment-text">{comment.text}</span>
                    </div>
                ))}
            </div>
            <input id='newComment' type="text" placeholder="说点什么吧……" value={newComment} onChange={(e) => setNewComment(e.target.value)} />
            <button onClick={handleComment}>💬</button>
            <button onClick={handleLike}>{like} {likes}</button>
        </div>
    )
}