import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const Categories = ({ selectedCategory, setSelectedCategory }) => {
    const [categories, setCategories] = useState([]);
    const [newCategoryName, setNewCategoryName] = useState('');

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
    };

    const handleAddCategory = () => {
        if (newCategoryName.trim() !== '' && !categories.includes(newCategoryName)) {
            setCategories([...categories, newCategoryName]);
            axios.get(`http://localhost:7001/category/append/${newCategoryName}`);
            setNewCategoryName('');
            setSelectedCategory(newCategoryName);
        } else {
            alert('请输入有效名称');
        }
    };

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await axios.get('http://localhost:7001/category/get');
                setCategories(response.data);
                try {
                    setSelectedCategory(response.data[0]);
                } catch {
                    setSelectedCategory('');
                }
            } catch (error) {
                console.error('Error fetching category:', error);
            }
        };
        fetchCategory();
    }, []);

    return (
        <div>
            <ul>
                {categories.map(category => (
                    <li key={category} onClick={() => handleCategorySelect(category)} className={selectedCategory === category ? 'active' : ''}>
                        {category}
                    </li>
                ))}
            </ul>
            <input
                id='newCategory'
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="新圈子"
            />
            <button onClick={handleAddCategory}>+</button>
        </div>
    )
}