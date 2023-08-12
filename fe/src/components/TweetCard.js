import { FcLike } from 'react-icons/fc'
import { AiOutlineHeart } from 'react-icons/ai';
import { FaRegComment } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';
import axios from 'axios';
import { API_BASE_URL } from '../config'
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { NavLink } from 'react-router-dom';

const TweetCard = (props) => {
    
    const [likestatus, setLikeStatus] = useState(false);

    const CONFIG_OBJ = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    }

    const deleteTweet = async (postId) => {
        const response = await axios.delete(`${API_BASE_URL}/tweet/${postId}`, CONFIG_OBJ);
        toast.info('Tweet deleted successfully',{ autoClose: 2300 });
        if (response.status === 200) {
          props.getAllTweets();
        }
      }

    const retweetBy = props.tweet.retweetBy[props.tweet.retweetBy.length - 1];
    const likeUnlikePost = async (id, type) => {
        const request = { "id": id };
        try {
            const response = await axios.post(`${API_BASE_URL}/tweet/${request.id}/${type}`, request, CONFIG_OBJ);
            if (response.status === 200) {
                setLikeStatus(!likestatus);
                props.getAllTweets();
                (type==='like' ? toast.success('Liked Successfully') : toast.success('Unliked Successfully'));
            }
        } catch (error) {
            console.log(error.response.data);
        }
    }

    useEffect(() => {
        const currentUserID = props.user._id;
        console.log(props.tweet.image);
        // Check if the current user's ID is present in tweet.likes array
        const isLikedByCurrentUser = props.tweet.likes.some(like => like._id === currentUserID);
        setLikeStatus(isLikedByCurrentUser);
    }, [props.tweet.likes, props.user._id]);

    return (
        <div className="card mb-1 border-0 border-bottom">
            <div className="card-body">
                {retweetBy ? <span className="text-muted ms-4" style={{ fontSize: '15px' }}>
                    <i className="fas fa-retweet me-1"></i>
                    Retweeted by @ {retweetBy.username}
                </span> : ''}
                <div className="d-flex align-items-center">
                    <NavLink to={`/user/${props.tweet.tweetedBy._id}`}>
                    <img src={props.tweet.tweetedBy.profileImg} alt="User Profile" className="rounded-circle me-2" width="50" height="50" />
                    </NavLink>
                    <div>
                    <NavLink to={`/user/${props.tweet.tweetedBy._id}`} style={{ textDecoration: 'none', color: 'black' }}>
                        <p className="mb-0 mt-2 fw-bold">{props.tweet.tweetedBy.fullName}</p>
                    </NavLink>
                        <p className="text-muted">@{props.tweet.tweetedBy.username} · 2 hours ago</p>
                    </div>
                    { props.user._id === props.tweet.tweetedBy._id ? <MdDeleteForever onClick={() => deleteTweet(props.tweet._id)} style={{ cursor: 'pointer' }} className='ms-auto mb-3' color='red' size={25} />: ''}
                </div>
                <p className="mt-1">{props.tweet.content}</p>
                <img style={{ borderRadius: '15px' }} className='p-2 img-fluid' alt={''} src={props.tweet.image? props.tweet.image : ''} />
                <div className="d-flex justify-content-start align-items-center fs-5">
                    {likestatus ? <FcLike onClick={() => { likeUnlikePost(props.tweet._id, 'dislike') }} className='me-1' />
                        : <AiOutlineHeart onClick={() => { likeUnlikePost(props.tweet._id, 'like') }} className='me-1' color='red' />}{props.tweet.likes.length}
                    <FaRegComment className='ms-5 me-1' color='#1DA1F2' />{props.tweet.replies.length}
                    <i className="fas fa-retweet ms-5 me-1" style={{ color: '#54b38a' }}></i>{props.tweet.retweetBy.length}
                </div>
            </div>
        </div>

    );
}

export default TweetCard;