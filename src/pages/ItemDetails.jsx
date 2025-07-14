import React, { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import axios from "axios";
import EthImage from "../images/ethereum.svg";
import AuthorImage from "../images/author_thumbnail.jpg";
import nftImage from "../images/nftImage.jpg";

const ItemDetails = () => {
  const { nftId } = useParams();
  const location = useLocation();
  const [item, setItem] = useState(null);
  const [authorName, setAuthorName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Try to get item data from location state (passed from HotCollections)
  const itemFromState = location.state?.itemData;

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (itemFromState) {
      setItem(itemFromState);
      
      if (itemFromState.authorId) {
        fetchAuthorName(itemFromState.authorId);
      } else {
        setLoading(false);
      }
      return;
    }
    
    // Otherwise try to fetch from multiple APIs to find the item
    if (nftId) {
      const fetchFromMultipleAPIs = async () => {
        try {
          const apiPromises = [
            axios.get('https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections'),
            axios.get('https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems'),
            axios.get('https://us-central1-nft-cloud-functions.cloudfunctions.net/explore')
          ];
          
          const responses = await Promise.allSettled(apiPromises);
          let foundItem = null;
          
          for (const response of responses) {
            if (response.status === 'fulfilled' && response.value.data) {
              const items = Array.isArray(response.value.data) ? response.value.data : [response.value.data];
              foundItem = items.find(item => 
                item.nftId && item.nftId.toString() === nftId.toString()
              );
              if (foundItem) {
                break;
              }
            }
          }
          
          if (foundItem) {
            setItem(foundItem);
            if (foundItem.authorId) {
              fetchAuthorName(foundItem.authorId);
            } else {
              setLoading(false);
            }
          } else {
            setError("NFT not found");
            setLoading(false);
          }
        } catch (err) {
          setError("Failed to fetch NFT details");
          setLoading(false);
        }
      };
      
      fetchFromMultipleAPIs();
    } else {
      setError("No NFT ID provided");
      setLoading(false);
    }
  }, [nftId, itemFromState]);

  // Function to fetch author name from topSellers API
  const fetchAuthorName = async (authorId) => {
    try {
      const response = await axios.get('https://us-central1-nft-cloud-functions.cloudfunctions.net/topSellers');
      const seller = response.data.find(seller => seller.authorId.toString() === authorId.toString());
      if (seller) {
        setAuthorName(seller.authorName);
      }
    } catch (err) {
      // Handle error silently
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div id="wrapper">
        <div className="no-bottom no-top" id="content">
          <div id="top"></div>
          <section aria-label="section" className="mt90 sm-mt-0">
            <div className="container">
              <div className="row">
                <div className="col-md-12 text-center">
                  <h2>Loading item details...</h2>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div id="wrapper">
        <div className="no-bottom no-top" id="content">
          <div id="top"></div>
          <section aria-label="section" className="mt90 sm-mt-0">
            <div className="container">
              <div className="row">
                <div className="col-md-12 text-center">
                  <h2>Error loading item</h2>
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div id="wrapper">
        <div className="no-bottom no-top" id="content">
          <div id="top"></div>
          <section aria-label="section" className="mt90 sm-mt-0">
            <div className="container">
              <div className="row">
                <div className="col-md-12 text-center">
                  <h2>Item not found</h2>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>
        <section aria-label="section" className="mt90 sm-mt-0">
          <div className="container">
            <div className="row">
              <div className="col-md-6 text-center">
                <img
                  src={item.nftImage || nftImage}
                  className="img-fluid img-rounded mb-sm-30 nft-image"
                  alt={item.title}
                  onError={(e) => { e.target.src = nftImage }}
                />
              </div>
              <div className="col-md-6">
                <div className="item_info">
                  <h2>{item.title}</h2>

                  <div className="item_info_counts">
                    <div className="item_info_views">
                      <i className="fa fa-eye"></i>
                      {item.views || item.viewCount || 0}
                    </div>
                    <div className="item_info_like">
                      <i className="fa fa-heart"></i>
                      {item.likes || item.likeCount || item.hearts || 0}
                    </div>
                  </div>
                  <p>
                    {item.description || item.about || "This is a beautiful NFT from the collection. Explore the details and consider adding it to your collection."}
                  </p>
                  <div className="d-flex flex-row">
                    <div className="mr40">
                      <h6>Owner</h6>
                      <div className="item_author">
                        <div className="author_list_pp">
                          <Link to={`/author/${item.authorId}`}>
                            <img 
                              className="lazy" 
                              src={item.authorImage || AuthorImage} 
                              alt={item.title}
                              onError={(e) => { e.target.src = AuthorImage }}
                            />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>
                        <div className="author_list_info">
                          <Link to={`/author/${item.authorId}`}>
                            {authorName || item.authorName || item.ownerName || item.creator || "Owner"}
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div></div>
                  </div>
                  <div className="de_tab tab_simple">
                    <div className="de_tab_content">
                      <h6>Creator</h6>
                      <div className="item_author">
                        <div className="author_list_pp">
                          <Link to={`/author/${item.authorId}`}>
                            <img 
                              className="lazy" 
                              src={item.authorImage || AuthorImage} 
                              alt={item.title}
                              onError={(e) => { e.target.src = AuthorImage }}
                            />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>
                        <div className="author_list_info">
                          <Link to={`/author/${item.authorId}`}>
                            {authorName || item.authorName || item.creatorName || item.creator || "Creator"}
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="spacer-40"></div>
                    <h6>Price</h6>
                    <div className="nft-item-price">
                      <img src={EthImage} alt="" />
                      <span>{item.price || item.cost || item.value || "0.00"}</span>
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
};

export default ItemDetails;





