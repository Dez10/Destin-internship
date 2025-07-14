import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import AuthorBanner from "../images/author_banner.jpg";
import AuthorItems from "../components/author/AuthorItems";
import AuthorImage from "../images/author_thumbnail.jpg";

const Author = () => {
  const { authorId } = useParams();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (authorId) {
      axios.get(`https://us-central1-nft-cloud-functions.cloudfunctions.net/authors?author=${authorId}`)
        .then(response => {
          setAuthor(response.data);
          setFollowersCount(response.data.followers || 0);
          const followingList = JSON.parse(localStorage.getItem('followingAuthors') || '[]');
          setIsFollowing(followingList.includes(authorId));
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }      }, [authorId]);

  const handleFollowClick = () => {
    const followingList = JSON.parse(localStorage.getItem('followingAuthors') || '[]');
    
    if (isFollowing) {
      const updatedList = followingList.filter(id => id !== authorId);
      localStorage.setItem('followingAuthors', JSON.stringify(updatedList));
      setIsFollowing(false);
      setFollowersCount(prev => prev - 1);
    } else {
      const updatedList = [...followingList, authorId];
      localStorage.setItem('followingAuthors', JSON.stringify(updatedList));
      setIsFollowing(true);
      setFollowersCount(prev => prev + 1);
    }
  };

  if (loading) {
    return (
      <div id="wrapper">
        <div className="no-bottom no-top" id="content">
          <div id="top"></div>
          <section
            id="profile_banner"
            aria-label="section"
            className="text-light"
            data-bgimage="url(images/author_banner.jpg) top"
            style={{ background: `url(${AuthorBanner}) top` }}
          ></section>
          <section aria-label="section">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <div className="d_profile de-flex">
                    <div className="de-flex-col">
                      <div className="profile_avatar">
                        <div className="skeleton-box" style={{ width: "150px", height: "150px", borderRadius: "50%" }}></div>
                        <div className="profile_name">
                          <div className="skeleton-box" style={{ width: "200px", height: "30px", margin: "10px 0" }}></div>
                          <div className="skeleton-box" style={{ width: "150px", height: "20px", margin: "5px 0" }}></div>
                          <div className="skeleton-box" style={{ width: "300px", height: "16px", margin: "5px 0" }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="profile_follow de-flex">
                      <div className="de-flex-col">
                        <div className="skeleton-box" style={{ width: "120px", height: "20px", margin: "10px 0" }}></div>
                        <div className="skeleton-box" style={{ width: "80px", height: "40px", borderRadius: "5px" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div id="wrapper">
        <div className="no-bottom no-top" id="content">
          <div id="top"></div>
          <section aria-label="section">
            <div className="container">
              <div className="row">
                <div className="col-md-12 text-center">
                  <h2>Error loading author</h2>
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  // If no author data and we have an authorId, show not found
  if (!author && authorId) {
    return (
      <div id="wrapper">
        <div className="no-bottom no-top" id="content">
          <div id="top"></div>
          <section aria-label="section">
            <div className="container">
              <div className="row">
                <div className="col-md-12 text-center">
                  <h2>Author not found</h2>
                  <p>The author with ID {authorId} could not be found.</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  const defaultData = {
    authorName: "Monica Lucas",
    tag: "monicaaaa",
    address: "UDHUHWudhwd78wdt7edb32uidbwyuidhg7wUHIFUHWewiqdj87dy7",
    followers: 573,
    authorImage: AuthorImage
  };

  const authorData = author || defaultData;

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>

        <section
          id="profile_banner"
          aria-label="section"
          className="text-light"
          data-bgimage="url(images/author_banner.jpg) top"
          style={{ background: `url(${AuthorBanner}) top` }}
        ></section>

        <section aria-label="section">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="d_profile de-flex">
                  <div className="de-flex-col">
                    <div className="profile_avatar">
                      <img 
                        src={authorData.authorImage || AuthorImage} 
                        alt={authorData.authorName} 
                        onError={(e) => { e.target.src = AuthorImage }}
                      />

                      <i className="fa fa-check"></i>
                      <div className="profile_name">
                        <h4>
                          {authorData.authorName}
                          <span className="profile_username">@{authorData.tag || authorData.authorName.toLowerCase()}</span>
                          <span id="wallet" className="profile_wallet">
                            {authorData.address || "Wallet address not available"}
                          </span>
                          <button id="btn_copy" title="Copy Text">
                            Copy
                          </button>
                        </h4>
                      </div>
                    </div>
                  </div>
                  <div className="profile_follow de-flex">
                    <div className="de-flex-col">
                      <div className="profile_follower">{followersCount} followers</div>
                      <button 
                        className={`btn-main ${isFollowing ? 'btn-following' : ''}`}
                        onClick={handleFollowClick}
                        title={isFollowing ? 'Click to unfollow' : 'Click to follow'}
                        style={{
                          position: 'relative',
                        }}
                      >
                        <span style={{ position: 'relative', zIndex: 1 }}>
                          {isFollowing ? 'Unfollow' : 'Follow'}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-12">
                <div className="de_tab tab_simple">
                  <AuthorItems authorId={authorId} authorData={author} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      
      <style>
        {`
          .btn-main::before,
          .btn-main::after {
            content: none !important;
          }
          
          .btn-following::before,
          .btn-following::after {
            content: none !important;
          }
        `}
      </style>
    </div>
  );
};

export default Author;


