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

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Only fetch if we have an authorId
    if (authorId) {
      console.log("Fetching author with ID:", authorId);
      
      // Use your API endpoint
      axios.get(`https://us-central1-nft-cloud-functions.cloudfunctions.net/author/${authorId}`)
        .then(response => {
          console.log("Author API response:", response.data);
          setAuthor(response.data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching author:", err);
          setError(err.message);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [authorId]);

  // Debug log
  console.log("Author component state:", { authorId, loading, error, author });

  // Show loading state
  if (loading) {
    return (
      <div id="wrapper">
        <div className="no-bottom no-top" id="content">
          <div id="top"></div>
          <section aria-label="section">
            <div className="container">
              <div className="row">
                <div className="col-md-12 text-center">
                  <h2>Loading author details...</h2>
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

  // Default data only if no authorId was provided (generic author page)
  const defaultData = {
    authorName: "Monica Lucas",
    username: "monicaaaa",
    wallet: "UDHUHWudhwd78wdt7edb32uidbwyuidhg7wUHIFUHWewiqdj87dy7",
    followers: 573,
    authorImage: AuthorImage
  };

  // Use API data if available, otherwise use default
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
                          <span className="profile_username">@{authorData.username || authorData.authorName.toLowerCase()}</span>
                          <span id="wallet" className="profile_wallet">
                            {authorData.wallet || "Wallet address not available"}
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
                      <div className="profile_follower">{authorData.followers || 0} followers</div>
                      <Link to="#" className="btn-main">
                        Follow
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-12">
                <div className="de_tab tab_simple">
                  <AuthorItems authorId={authorId} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Author;


