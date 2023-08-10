import { FcLike } from 'react-icons/fc'
import { AiOutlineHeart } from 'react-icons/ai';
import { FaRegComment } from 'react-icons/fa';
import axios from 'axios';
import { API_BASE_URL } from '../config'
import { useEffect, useState } from 'react';

const TweetCard = (props) => {

    const [likestatus, setLikeStatus] = useState(false);

    const CONFIG_OBJ = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
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
            }
        } catch (error) {
            console.log(error.response.data);
        }
    }

    useEffect(() => {
        const currentUserID = props.user._id;
        // Check if the current user's ID is present in tweet.likes array
        const isLikedByCurrentUser = props.tweet.likes.some(like => like._id === currentUserID);
        setLikeStatus(isLikedByCurrentUser);
    }, [props.tweet.likes, props.user._id]);

    return (
        <div className="card mb-2 border-0 border-bottom">
            <div className="card-body">
                {retweetBy ? <span className="text-muted ms-4" style={{ fontSize: '15px' }}>
                    <i className="fas fa-retweet me-1"></i>
                    Retweeted by @ {retweetBy.username}
                </span> : ''}
                <div className="d-flex align-items-center">
                    <img src={props.tweet.tweetedBy.profileImg} alt="User Profile" className="rounded-circle me-2" width="50" height="50" />
                    <div>
                        <p className="mb-0 mt-2 fw-bold">{props.tweet.tweetedBy.fullName}</p>
                        <p className="text-muted">@{props.tweet.tweetedBy.username} · 2 hours ago</p>
                    </div>
                </div>
                <p className="mt-1">{props.tweet.content}</p>
                <img style={{ borderRadius: '15px' }} className='p-2 img-fluid' alt={''} src={props.tweet.image} />
                <div className="d-flex justify-content-start align-items-center fs-5">
                    {likestatus ? <FcLike onClick={() => { likeUnlikePost(props.tweet._id, 'dislike') }} className='me-1' />
                        : <AiOutlineHeart onClick={() => { likeUnlikePost(props.tweet._id, 'like') }} className='me-1' color='red' />}{props.tweet.likes.length}
                    <FaRegComment className='ms-5 me-1' color='#1DA1F2' />{props.tweet.replies.length}
                    <i className="fas fa-retweet ms-5 me-1" style={{ color: '#54b38a' }}></i>3
                </div>
            </div>
        </div>

    );
}

export default TweetCard;