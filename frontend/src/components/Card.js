
import React, { useState } from 'react';
import './Card.css';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '../../src/config';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Card = (props) => {
    const user = useSelector(state => state.userReducer);
    const postLikes = props.postData.likes || [];
    const [commentBox, setCommentBox] = useState(false);
    const [comment, setComment] = useState('');
    const [liked, setLiked] = useState(
        postLikes.some(like => like === user.user._id)
      );

      //Required heaaders
    const CONFIG_OBJ = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
    };

    if (!props.postData) {
        console.error('props.postData is undefined');
        return null; // or return some default content or loading indicator
    }

    const postId = props.postData._id;


    const retweetPost = async (postId) => {
        const request = { 'postId': postId };
        const response = await axios.post(`${API_BASE_URL}/retweet/${postId}`, request, CONFIG_OBJ);
        if (response.status === 201) {
            // Update the retweet count and list of retweeted user IDs in the local state
            props.setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post._id === postId
                        ? { ...post, retweets: response.data.retweet.retweets, retweetedUsers: response.data.retweet.retweetedUsers }
                        : post
                )
            );
            // Fetch all posts to get the updated retweet count
            props.getAllPosts();
        }
    };
    



    const submitComment = async (postId) => {
        setCommentBox(false);
        const request = { 'postId': postId, 'commentText': comment };
        const response = await axios.put(`${API_BASE_URL}/comment`, request, CONFIG_OBJ);
        if (response.status === 200) {
            props.getAllPosts();
        }
    };

    
    const likeDislikePost = async (postId, type) => {
        const request = { 'postId': postId };
        const response = await axios.put(`${API_BASE_URL}/${type}`, request, CONFIG_OBJ);
        if (response.status === 200) {
            props.getAllPosts();
            setLiked(type === 'like');
        }
    };
    return (
        <div>
            <div className='card shadow-sm'>
    <div className='card-body px-2'>
        <div className='row'>
            <div className='col-12 col-md-6 d-flex'>
                <img
                    className='p-2 post-profile-pic'
                    alt='profile pic'
                    src='https://images.unsplash.com/photo-1445543949571-ffc3e0e2f55e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8d2ludGVyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60'
                />
                <div className='mt-2'>
                <Link  className="profile-link" to={`/profilePage_2/${props.postData.author._id}`}>{props.postData.author.fullName}</Link>
                
                

                    <p className='location mt-3'>{props.postData.location}</p>
                   
                </div>
            </div>
            {props.postData.author._id === user.user._id ? (
                <div className='col-12 col-md-6 text-md-end'>
                    {/* Use the "i" tag for the delete icon */}
                    <i
                        onClick={() => props.deletePost(props.postData._id)}
                        style={{ cursor: 'pointer' }}
                        className='fs-3 p-2 mt-2 fa fa-trash'
                    />
                </div>
            ) : null}
            <div className='col-12'>
                <p>{props.postData.description}</p>
            </div>
        </div>
        <div className='row'>
            <div className='col-12'>
                <img
                    style={{ borderRadius: '15px' }}
                    className='p-2 img-fluid'
                    alt={props.postData.description}
                    src={props.postData.image}
                />
            </div>
        </div>
        <div className='row my-3'>
            <div className='col-12 d-flex'>
            <i
                                onClick={() => likeDislikePost(props.postData._id, liked ? 'unlike' : 'like')}
                                className={`ps-2 fs-4 fa-regular ${liked ? 'fa-heart text-danger' : 'fa-heart'}`}
                            />
                <i   
                    onClick={() => setCommentBox(true)}
                    className='ps-3 fs-4 fa-regular fa-comment'
                    
                />
               

               <i
                                onClick={() => retweetPost(props.postData._id)}
                                className="fa-solid fa-retweet mx-4 mt-1"
                                style={{ color: "#003ca3" }}
                            />

            </div>
            <div className='col-12'>
            <span className='pe-2 fs-6 fw-bold float-end'>
                                {props.postData.likes.length} likes, {props.postData.retweets.length} retweets
                            </span>
            </div>
        </div>
        {commentBox ? (
            <div className='row mb-2'>
                <div className='col-12 col-md-8'>
                    <textarea
                        onChange={(e) => setComment(e.target.value)}
                        className='form-control'
                    ></textarea>
                </div>
                <div className='col-12 col-md-4'>
                    <button
                        className='btn btn-primary w-100'
                        onClick={() => submitComment(props.postData._id)}
                    >
                        Submit
                    </button>
                </div>
            </div>
        ) : null}
       {props.postData.comments.map((comment) => (
                    <div className='card mt-2' key={comment._id}>
                        <div className='card-body d-block  align-items-center'>
                            <div>
                            <Link to={`/profilePage_2/${comment.commentedBy._id}`}  className='card-text'>
                    <h5>
                        {comment.commentedBy.fullName}
                    </h5>
                </Link>
                                <p className='card-text'>
                                    {comment.commentText} 
                                </p>
                            </div>
                           
                        </div>
                    </div>
                ))}
        <div className='row'>
            <div className='col-12'>
                <span className='p-2 text-muted'>2 Hours Ago</span>
            </div>
        </div>
    </div>
</div>

        </div>
    );
};

export default Card;