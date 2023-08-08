import { TiMessages } from "react-icons/ti";

const HomePage = () => {
  return (
    <div className="container border mt-5 home-page d-flex">
      <div className="sidebar w-25 d-flex justify-content-evenly">
        <div className="app-logo">
          {/* Your app logo */}
          <TiMessages className="mb-5" size={40} color="#1DA1F2" />
        </div>
        <div className="navigation-links">
          {/* Navigation links */}
          Nl
        </div>
        <div className="user-info">
          {/* Logged-in user's name and email */}
          sdd
        </div>
      </div>
      <div className="tweet-list border w-75">
        {/* List of tweets */}
      </div>
    </div>
  );
};

export default HomePage;
