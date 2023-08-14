import Sidebar from '../components/Sidebar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import TweetCard from '../components/TweetCard';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const Tweet = styled.div`
  overflow-y: auto;
  height: 65vh;
`;

const TweetsPage = () => {
    const params = useParams();
    const [user, setUser] = useState({});
    const [alltweets, setAllTweets] = useState([]);

    const getTweet = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/tweet/${params.id}`);
            if (response.status === 200) {
                console.log(response.data);
                setAllTweets(response.data.tweet);
            } else {
                console.error('Error while getting tweets');
            }
        } catch (error) {
            console.log(error.response.data);
        }
    };

    useEffect(() => {

        getTweet();
    }, []);

console.log(alltweets);

    return (
        <div className="container d-flex w-75">
            <Sidebar />
            <div className="tweet-content w-75">
                <div className="top d-flex align-items-center justify-content-between my-4 mx-2 px-1">
                    <h3>Tweets</h3>
                </div>
                <Tweet className="tweets mx-1">
                    <TweetCard tweet={alltweets}>
                    </TweetCard> 
                </Tweet>
                {/* List of tweets */}
                <Tweet className="tweets mx-1">
                    {(alltweets.replies?.length > 0) ? (alltweets.replies?.map((tweets) => (
                        <TweetCard key={tweets._id} tweet={tweets}  />
                    ))) : '' }
                </Tweet>
            </div>
        </div>
    );
};

export default TweetsPage;
