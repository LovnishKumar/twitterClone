import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from '../components/Card';
import { API_BASE_URL } from '../../src/config'
import axios from 'axios';
import Swal from 'sweetalert2'

import './Feed.css';

export default function Feed() {
  //Required States
    const navigate = useNavigate();
    const [allposts, setAllposts] = useState([]);
    const [image, setImage] = useState({ preview: '', data: '' });
    const [show, setShow] = useState(false);
    const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //Required headers
    const CONFIG_OBJ = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    }
    const handleFileSelect = (event) => {
        const img = {
          preview: URL.createObjectURL(event.target.files[0]),
          data: event.target.files[0],
        };
        setImage(img);
      };
    //Image uploade fetch
      const handleImgUpload = async () => {
        try {
          let formData = new FormData();
          formData.append('file', image.data);
    
          const response = await axios.post(`${API_BASE_URL}/uploadFile`, formData);
          return response;
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      };

      const addPost = async () => {
        if (image.preview === '') {
          Swal.fire({
            icon: 'error',
            title: 'Post image is mandatory!',
          });
        } else if (caption === '') {
          Swal.fire({
            icon: 'error',
            title: 'Post caption is mandatory!',
          });
        } else if (location === '') {
          Swal.fire({
            icon: 'error',
            title: 'Location is mandatory!',
          });
        } else {
          setLoading(true);
          try {
            const imgRes = await handleImgUpload();
            const request = {
              description: caption,
              location: location,
              image: `${API_BASE_URL}/files/${imgRes.data.fileName}`,
            };
            const postResponse = await axios.post(`${API_BASE_URL}/createpost`, request, CONFIG_OBJ);
            setLoading(false);
    
            if (postResponse.status === 201) {
                // Show a success message using SweetAlert
                Swal.fire({
                  icon: 'success',
                  title: 'Post uploaded successfully!',
                }).then(() => {
                  navigate('/home');
                });
                setShow(false)
                getAllPosts();

              } else {
              Swal.fire({
                icon: 'error',
                title: 'Some error occurred while creating post',
              });
            }
          } catch (error) {
            console.error('Error creating post:', error);
          }
        }
      };

    const getAllPosts = async () => {
        const response = await axios.get(`${API_BASE_URL}/allposts`);

        if (response.status === 200) {
            setAllposts(response.data.posts);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Some error occurred while getting all posts'
            })
        }
    }

    const deletePost = async (postId) => {
        const response = await axios.delete(`${API_BASE_URL}/deletepost/${postId}`, CONFIG_OBJ);
        if (response.status === 200) {
            getAllPosts();
        }
    }


    useEffect(() => {
        getAllPosts();
    }, []);
    return (
        <div className='feed-body  px-4 pt-3'>
            <div className='row'>
                <div className='col'>
                    <h5>Home</h5>
                </div>
                <div className='col pb-3'>
      <button
        type="button"
        className="btn btn-primary px-5 float-end"
        onClick={handleShow}
      >
        Tweet
      </button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>New Tweet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea
            className="form-control"
            placeholder="Write your tweet"
            id="floatingTextarea1"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          ></textarea>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={handleFileSelect}
          />
          {image.preview && (
            <img
              src={image.preview}
              alt="Preview"
              className="img-preview img-fluid"
            />
          )}
          <a className='m-1'><i className="fa-regular fa-image"></i></a>
          <div className="mb-3">
            <label htmlFor="location" className="form-label">
              Location
            </label>
            <input
              type="text"
              className="form-control"
              id="location"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <button
            className="btn btn-primary w-100"
            onClick={addPost}
            disabled={loading}
          >
            {loading ? 'Uploading...' : 'Add Post'}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
            </div>
            <div className='container mt-md-5 mt-3'>
            <div className='row'>
                {allposts.map((post) => {
                    return (
                        <div className='col-12 mb-2' key={post._id}>
                            <Card postData={post} deletePost={deletePost} getAllPosts={getAllPosts} setPosts={setAllposts} />
                        </div>
                    )
                })
                }
            </div>
        </div>
           
        </div>
    );
}