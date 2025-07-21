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

  const itemFromState = location.state?.itemData;

  const fetchAuthorName = async (authorId) => {
    try {
      const response = await axios.get(
        `https://us-central1-nft-cloud-functions.cloudfunctions.net/authors?author=${authorId}`
      );
      
      if (response.data && response.data.authorName) {
        setAuthorName(response.data.authorName);
      } else {
        const sellersResponse = await axios.get('https://us-central1-nft-cloud-functions.cloudfunctions.net/topSellers');
        const seller = sellersResponse.data.find(seller => 
          seller.authorId.toString() === authorId.toString() ||
          seller.ownerId?.toString() === authorId.toString() ||
          seller.creatorId?.toString() === authorId.toString()
        );
        if (seller) {
          setAuthorName(seller.authorName);
        }
      }
    } catch (err) {
      try {
        const sellersResponse = await axios.get('https://us-central1-nft-cloud-functions.cloudfunctions.net/topSellers');
        const seller = sellersResponse.data.find(seller => 
          seller.authorId.toString() === authorId.toString() ||
          seller.ownerId?.toString() === authorId.toString() ||
          seller.creatorId?.toString() === authorId.toString()
        );
        if (seller) {
          setAuthorName(seller.authorName);
        }
      } catch (fallbackErr) {
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (itemFromState) {
      setItem(itemFromState);        if (itemFromState.authorId || itemFromState.ownerId || itemFromState.creatorId) {
          fetchAuthorName(itemFromState.authorId || itemFromState.ownerId || itemFromState.creatorId);
        } else {
          setLoading(false);
        }
      return;
    }
     
    if (nftId) {
      const fetchItemDetails = async () => {
        try {
          const response = await axios.get(
            `https://us-central1-nft-cloud-functions.cloudfunctions.net/itemDetails?nftId=${nftId}`
          );
          
          if (response.data) {
            setItem(response.data);
            
            if (response.data.authorId || response.data.ownerId || response.data.creatorId) {
              fetchAuthorName(response.data.authorId || response.data.ownerId || response.data.creatorId);
            } else {
              setLoading(false);
            }
          } else {
            setError("NFT not found");
            setLoading(false);
          }
        } catch (err) {
          const fallbackFetch = async () => {
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
                if (foundItem.authorId || foundItem.ownerId || foundItem.creatorId) {
                  fetchAuthorName(foundItem.authorId || foundItem.ownerId || foundItem.creatorId);
                } else {
                  setLoading(false);
                }
              } else {
                setError("NFT not found");
                setLoading(false);
              }
            } catch (fallbackErr) {
              setError("Failed to fetch NFT details");
              setLoading(false);
            }
          };
          
          fallbackFetch();
        }
      };
      
      fetchItemDetails();
    } else {
      setError("No NFT ID provided");
      setLoading(false);
    }
  }, [nftId, itemFromState]);

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
                  <h2>{item.title}{item.tag ? ` #${item.tag}` : ''}</h2>

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
                          <Link to={`/author/${item.ownerId || item.authorId}`}>
                            <img 
                              className="lazy" 
                              src={item.ownerImage || item.authorImage || AuthorImage} 
                              alt={item.title}
                              onError={(e) => { e.target.src = AuthorImage }}
                            />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>
                        <div className="author_list_info">
                          <Link to={`/author/${item.ownerId || item.authorId}`}>
                            {authorName || item.ownerName || item.authorName || item.creator || "Owner"}
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
                          <Link to={`/author/${item.creatorId || item.authorId}`}>
                            <img 
                              className="lazy" 
                              src={item.creatorImage || item.authorImage || AuthorImage} 
                              alt={item.title}
                              onError={(e) => { e.target.src = AuthorImage }}
                            />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>
                        <div className="author_list_info">
                          <Link to={`/author/${item.creatorId || item.authorId}`}>
                            {authorName || item.creatorName || item.authorName || item.creator || "Creator"}
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





