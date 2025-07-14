import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import NFTItemSkeleton, { SkeletonStyles } from "../UI/NFTItemSkeleton";
import AuthorImage from "../../images/author_thumbnail.jpg";
import nftImage from "../../images/nftImage.jpg";

const AuthorItems = ({ authorId, authorData: passedAuthorData }) => {
  const [items, setItems] = useState([]);
  const [authorData, setAuthorData] = useState(passedAuthorData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authorId) {
      if (passedAuthorData) {
        setAuthorData(passedAuthorData);
        if (passedAuthorData.nftCollection && passedAuthorData.nftCollection.length > 0) {
          setItems(passedAuthorData.nftCollection);
          setLoading(false);
        } else {
          fetchItemsOnly();
        }
      } else {
        fetchAuthorData();
      }
    } else {
      setLoading(false);
    }
  }, [authorId, passedAuthorData]);

  const fetchItemsOnly = async () => {
    try {
      const itemsResponse = await axios.get(
        `https://us-central1-nft-cloud-functions.cloudfunctions.net/authorItems/${authorId}`
      );
      setItems(itemsResponse.data || []);
      setLoading(false);
    } catch (itemsError) {
      setItems([]);
      setLoading(false);
    }
  };
  
  const fetchAuthorData = async () => {
    try {
      const authorResponse = await axios.get(
        `https://us-central1-nft-cloud-functions.cloudfunctions.net/authors?author=${authorId}`
      );
      setAuthorData(authorResponse.data);
      
      if (authorResponse.data.nftCollection && authorResponse.data.nftCollection.length > 0) {
        setItems(authorResponse.data.nftCollection);
      } else {
        try {
          const itemsResponse = await axios.get(
            `https://us-central1-nft-cloud-functions.cloudfunctions.net/authorItems/${authorId}`
          );
          setItems(itemsResponse.data || []);
        } catch (itemsError) {
          setItems([]);
        }
      }
      
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="de_tab_content">
        <SkeletonStyles />
        <div className="tab-1">
          <div className="row">
            {Array(8).fill(null).map((_, index) => (
              <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={`skeleton-${index}`}>
                <NFTItemSkeleton />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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

  return (
    <div className="de_tab_content">
      <div className="tab-1">
        <div className="row">
          {items.map((item, i) => (
            <div className="col-lg-3 col-md-6 col-sm-6 col-xs-12" key={item.id || `item-${i}`}>
              <div className="nft__item">
                <div className="author_list_pp">
                  <Link to={`/author/${authorData?.authorId || authorId}`}>
                    <img 
                      className="lazy" 
                      src={authorData?.authorImage || AuthorImage} 
                      alt={authorData?.authorName || "Author"}
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





