import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AuthorImage from "../../images/author_thumbnail.jpg";
import nftImage from "../../images/nftImage.jpg";

const AuthorItems = ({ authorId }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Only fetch if we have an authorId
    if (authorId) {
      console.log("Fetching items for author ID:", authorId);
      
      // Use your API endpoint
      axios.get(`https://us-central1-nft-cloud-functions.cloudfunctions.net/authorItems/${authorId}`)
        .then(response => {
          console.log("Author items API response:", response.data);
          setItems(response.data || []);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching author items:", err);
          setError(err.message);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [authorId]);

  // Debug log
  console.log("AuthorItems component state:", { authorId, loading, error, items });

  // Show loading state
  if (loading) {
    return (
      <div className="de_tab_content">
        <div className="tab-1">
          <div className="row">
            {Array(8).fill(null).map((_, index) => (
              <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={index}>
                <div className="nft__item">
                  <div className="author_list_pp">
                    <div className="skeleton-box" style={{ width: "50px", height: "50px", borderRadius: "50%" }}></div>
                  </div>
                  <div className="nft__item_wrap">
                    <div className="skeleton-box" style={{ height: "250px", width: "100%" }}></div>
                  </div>
                  <div className="nft__item_info">
                    <div className="skeleton-box" style={{ width: "70%", height: "24px", marginBottom: "10px" }}></div>
                    <div className="skeleton-box" style={{ width: "40%", height: "20px", marginBottom: "10px" }}></div>
                    <div className="skeleton-box" style={{ width: "30%", height: "20px" }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="de_tab_content">
        <div className="tab-1">
          <div className="row">
            <div className="col-md-12">
              <p>Error loading items: {error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If no items or empty array, show a message
  if (!items || items.length === 0) {
    return (
      <div className="de_tab_content">
        <div className="tab-1">
          <div className="row">
            <div className="col-md-12 text-center">
              <p>No items found for this author.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If we have items, display them
  return (
    <div className="de_tab_content">
      <div className="tab-1">
        <div className="row">
          {items.map((item, i) => ( // Added index parameter 'i'
            <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={item.id || `item-${i}`}>
              <div className="nft__item">
                <div className="author_list_pp">
                  <Link to={`/author/${item.authorId || authorId}`}>
                    <img 
                      className="lazy" 
                      src={item.authorImage || AuthorImage} 
                      alt={item.authorName || "Author"}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = AuthorImage;
                      }}
                    />
                    <i className="fa fa-check"></i>
                  </Link>
                </div>
                <div className="nft__item_wrap">
                  <div className="nft__item_extra">
                    <div className="nft__item_buttons">
                      <button>Buy Now</button>
                      <div className="nft__item_share">
                        <h4>Share</h4>
                        <a href="#!" onClick={(e) => e.preventDefault()}>
                          <i className="fa fa-facebook fa-lg"></i>
                        </a>
                        <a href="#!" onClick={(e) => e.preventDefault()}>
                          <i className="fa fa-twitter fa-lg"></i>
                        </a>
                        <a href="#!" onClick={(e) => e.preventDefault()}>
                          <i className="fa fa-envelope fa-lg"></i>
                        </a>
                      </div>
                    </div>
                  </div>
                  <Link to={`/item-details/${item.nftId}`}>
                    <img
                      src={item.nftImage || nftImage}
                      className="lazy nft__item_preview"
                      alt={item.title || "NFT"}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = nftImage;
                      }}
                    />
                  </Link>
                </div>
                <div className="nft__item_info">
                  <Link to={`/item-details/${item.nftId}`}>
                    <h4>{item.title || "Untitled NFT"}</h4>
                  </Link>
                  <div className="nft__item_price">{item.price || "0.00"} ETH</div>
                  <div className="nft__item_like">
                    <i className="fa fa-heart"></i>
                    <span>{item.likes || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthorItems;





