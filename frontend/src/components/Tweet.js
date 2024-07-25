import React from 'react';
import './Tweet.css';
import profilePic from '../images/ProfilePic.png';
import scenery from '../images/scenery.jpg';

export default function Tweet() {
    return (
        <div className='card tweet-body'>
            <div className='card-body'>
                <div className='tweet-header row'>
                    <div className='col-7 col-md-9 col-lg-7 card-subtitle text-body-secondary'>
                        <p className='retweet-statement'>
                            <i className="fa-solid fa-retweet me-1" style={{ color: "#a1a1a1" }}></i>
                            retweeted by @anotherUser
                        </p>
                    </div>
                    <div className='col-4 col-md-1 col-lg-4'></div>
                    <button className='col-1 delete-btn-design mb-3'>
                        <i className="fa-regular fa-trash-can"></i>
                    </button>
                </div>
                <div className='tweet-content row'>
                    <div className='col-2 text-center'>
                        <img src={profilePic} height={"50vh"} className='tweet-profilepic' alt="Profile" />
                    </div>
                    <div className='col-10'>
                        <div className='tweet-user-info row'>
                            <div className='col-md-12 col-lg-12'>
                                <a className='tweet-username' href='/profile'>@Astitva</a>
                            </div>
                            <div className='col-md-12 col-lg-12'>
                                <p className='text-body-secondary date-section'>Fri SEP 15, 2023</p>
                            </div>
                        </div>
                        <p className='caption'>
                            This is the caption for the image below.
                            This is the caption for the image below.
                            This is the caption for the image below.
                            This is the caption for the image below.
                            This is the caption for the image below.
                            This is the caption for the image below.
                        </p>
                        <img src={scenery} className='tweet-image' alt="Tweet" />

                        {/* action buttons */}
                        <div className='tweet-actions row mt-2'>

                            {/* like button */}
                            <div className='col-2 col-md-3'>
                                <button className='like-button'><i className="fa-solid fa-heart me-1" style={{ color: "#ff0000" }}></i></button>30
                            </div>

                            {/* reply button */}
                            <div className='col-2 col-md-3'>
                                <button data-bs-toggle="modal" role="button" data-bs-target="#exampleModal" className='comment-button'>
                                    <i className="fa-regular fa-comment me-2" style={{ color: "#478bff" }}></i>5
                                </button>
                                {/* reply modal */}
                                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel1" aria-hidden="true">
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <h1 className="modal-title fs-5" id="exampleModalLabel">Tweet your reply</h1>
                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                            </div>
                                            <div className="modal-body">
                                                <textarea className="form-control" placeholder="Write your reply" name='floatingTextarea'></textarea>
                                            </div>
                                            <div className="modal-footer">
                                                <button type="button" className="btn btn-primary">Reply</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* retweet button */}
                            <div className='col-2 col-md-3'>
                                <button className='retweet-button'><i className="fa-solid fa-retweet me-1" style={{ color: "#003ca3" }}></i></button>3
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
