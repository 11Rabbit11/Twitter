import { FcLike } from 'react-icons/fc'
import { AiOutlineHeart } from 'react-icons/ai';
import { FaRegComment } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';
import axios from 'axios';
import { API_BASE_URL, IMAGE_BASE_URL } from '../config'
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { NavLink } from 'react-router-dom';

const TweetCard = (props) => {

    const [likestatus, setLikeStatus] = useState(false);
    const currentUser = JSON.parse(localStorage.getItem('user'));
    const formatDate = (date) => {
        return new Date(date).toLocaleString("en-US", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      };

    const CONFIG_OBJ = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    }



    const deleteTweet = async (tweetId) => {
        const response = await axios.delete(`${API_BASE_URL}/tweet/${tweetId}`, CONFIG_OBJ);
        toast.info('Tweet deleted successfully', { autoClose: 2300 });
        if (response.status === 200) {
            props.getTweets();
        }
    }
    console.log(props.tweet);
    const retweetBy = (props.tweet?.retweetBy > 0) ? props.tweet?.retweetBy[props?.tweet?.retweetBy.length - 1] : null;
    const likeUnlikePost = async (type) => {
        const request = { "id": props?.tweet?._id };
        try {
            const response = await axios.post(`${API_BASE_URL}/tweet/${request.id}/${type}`, {}, CONFIG_OBJ);
            if (response.status === 200) {
                setLikeStatus(!likestatus);
                props.getTweets();
                (type === 'like' ? toast.success('Liked Successfully', { autoClose: 2300 }) : toast.success('Unliked Successfully', { autoClose: 2300 }));
            }
        } catch (error) {
            console.log(error);
        }
        
    }
    const retweet = async () => {
        try {
            const response = await axios.post(`${API_BASE_URL}/tweet/${props.tweet._id}/retweet`, {}, CONFIG_OBJ);
            if (response.status === 200) {
                toast.success('Retweeted Successfully', { autoClose: 2300 });
                props.getTweets();
            } else {
                toast.error('Some error occurred while retweeting', { autoClose: 2300 });
            }
        } catch (error) {
            toast.error(error.response?.data.error, { autoClose: 2100 });
            console.log(error.response?.data);
        }
    }


    useEffect(() => {
        // Check if the current user's ID is present in tweet.likes array
        const isLikedByCurrentUser = props?.tweet?.likes.some(like => like._id === currentUser._id);
        setLikeStatus(isLikedByCurrentUser);
    }, [props, likestatus, currentUser]);

    return (
        <div className="card mb-1 border-0 border-bottom">
            <div className="card-body">
                {retweetBy ? <span className="text-muted ms-4" style={{ fontSize: '15px' }}>
                    <i className="fas fa-retweet me-1"></i>
                    Retweeted by @ {retweetBy.username}
                </span> : ''}
                <div className="d-flex align-items-center">
                    <NavLink to={`/user/${props?.tweet?.tweetedBy._id}`}>
                        <img src={props?.tweet?.tweetedBy.profileImg} alt="User Profile" className="rounded-circle me-2" width="50" height="50" />
                    </NavLink>
                    <div>
                        <NavLink to={`/profile/${props?.tweet?.tweetedBy._id}`} style={{ textDecoration: 'none', color: 'black' }}>
                            <p className="mb-0 mt-2 fw-bold">{props?.tweet?.tweetedBy.fullName}</p>
                        </NavLink>
                        <p className="text-muted">@{props?.tweet?.tweetedBy.username} · {formatDate(props?.tweet?.createdAt)}</p>
                    </div>
                    {currentUser._id === props?.tweet?.tweetedBy._id ? <MdDeleteForever onClick={() => deleteTweet(props?.tweet?._id)} style={{ cursor: 'pointer' }} className='ms-auto mb-3' color='red' size={25} /> : ''}
                </div>
                <NavLink to={`/tweet/${props?.tweet?._id}`} style={{ textDecoration: 'none', color: 'black' }}>
                    {/* Content */}
                    <p className="mt-1">{props?.tweet?.content}</p>
                    {props?.tweet?.image && (<img style={{ borderRadius: '15px', width: "60%", height: "100%" }} className='p-2 img-fluid' alt={''} src={IMAGE_BASE_URL + props?.tweet?.image} />)}
                </NavLink>
                <div className="d-flex justify-content-start align-items-center fs-5">
                    {likestatus ? <FcLike style={{ cursor: 'pointer' }} onClick={() => { likeUnlikePost('dislike') }} className='me-1' />
                        : <AiOutlineHeart style={{ cursor: 'pointer' }} onClick={() => { likeUnlikePost( 'like') }} className='me-1' color='red' />}{props?.tweet?.likes.length}
                    <FaRegComment className='ms-5 me-1' color='#1DA1F2' />{props?.tweet?.replies.length}
                    <i onClick={() => retweet()} className="fas fa-retweet ms-5 me-1" style={{ cursor: 'pointer', color: '#54b38a' }}></i>{props?.tweet?.retweetBy.length}
                </div>
            </div>
        </div>

    );
}

export default TweetCard;