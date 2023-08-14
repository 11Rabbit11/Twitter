import Sidebar from '../components/Sidebar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import TweetCard from '../components/TweetCard';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const Tweet = styled.div`
  overflow-y: auto;
  height: 62vh;
`;

const TweetsPage = () => {
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({});
    const [tweet, setTweet] = useState([]);
    const [replies, setReplies] = useState([]);

    const getTweet = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/tweet/${params.id}`);
            setTweet(response.data);
            setReplies(response.data.replies);
            setLoading(false);
            setUser(response.data.tweetedBy._id);
        } catch (error) {
            console.log(error.response.data);
        }
    };

    useEffect(() => {

        getTweet();

    }, [])

    return (
        <div className="container d-flex w-75">
            <Sidebar />
            <div className="tweet-content w-75">
                <div className="top d-flex align-items-center justify-content-between my-4 mx-2 px-1">
                    <h3>Tweets</h3>
                </div>
                {/* List of tweets */}
                {loading ? (<h1>Loading...</h1>) :
                    <TweetCard getTweets={getTweet} user={user} tweet={tweet} isTweetPage={true} />
                }
                <div className='replies ms-2 mt-2 mb-3'><h4>Replies :</h4></div>
                <Tweet className="tweets mx-3">
                    {loading ? (<h1>Loading...</h1>) : (replies?.map((tweet) => {
                        return (<div className='border border-bottom-0'>
                        <TweetCard getTweets={getTweet} user={user} tweet={tweet} isTweetPage={true}/>
                        </div>)
                    }))}
                </Tweet>
            </div>
        </div>
    );
};

export default TweetsPage;
