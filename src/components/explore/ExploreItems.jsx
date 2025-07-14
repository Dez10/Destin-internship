import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import NFTItemCard from "../UI/NFTItemCard";
import NFTItemSkeleton, { SkeletonStyles } from "../UI/NFTItemSkeleton";

const ExploreItems = () => {
  const { id: categoryId } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("");
  const [displayedItems, setDisplayedItems] = useState(8);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        let response;
        
        try {
          let url = categoryId 
            ? `https://us-central1-nft-cloud-functions.cloudfunctions.net/explore/${categoryId}` 
            : `https://us-central1-nft-cloud-functions.cloudfunctions.net/explore`;
          
          if (filter) {
            url += `?filter=${filter}`;
          }
          
          response = await axios.get(url, { timeout: 5000 });
          
        } catch (exploreError) {
          if (categoryId) {
            response = await axios.get('https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections');
          } else {
            response = await axios.get('https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections');
          }
        }
        
        setItems(response.data);
        setDisplayedItems(8);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchItems();
  }, [categoryId, filter]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setLoading(true);
    setDisplayedItems(8);
  };

  const handleLoadMore = () => {
    setDisplayedItems(prevCount => prevCount + 4);
  };

  if (loading) {
    return (
      <>
        <SkeletonStyles />
        <div>
          <select id="filter-items" defaultValue="" disabled>
            <option value="">Default</option>
          </select>
        </div>
        {Array(8).fill(null).map((_, index) => (
          <div
            key={index}
            className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
          >
            <NFTItemSkeleton />
          </div>
        ))}
      </>
    );
  }

  if (error) return <div>Error: {error}</div>;
  if (!items || items.length === 0) return <div>No items found.</div>;

  return (
    <>
      <div>
        <select id="filter-items" value={filter} onChange={handleFilterChange}>
          <option value="">Default</option>
          <option value="price_low_to_high">Price, Low to High</option>
          <option value="price_high_to_low">Price, High to Low</option>
          <option value="likes_high_to_low">Most Liked</option>
        </select>
        <span style={{ marginLeft: "20px", color: "#666", fontSize: "14px" }}>
          Showing {Math.min(displayedItems, items.length)} of {items.length} items
        </span>
      </div>
      {items.slice(0, displayedItems).map((item, index) => (
        <div
          key={item.nftId || item.id || index}
          className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
          style={{ display: "block", backgroundSize: "cover" }}
        >
          <NFTItemCard item={item} showShareButtons={true} />
        </div>
      ))}
      {displayedItems < items.length && (
        <div className="col-md-12 text-center">
          <Link 
            to="#" 
            id="loadmore" 
            className="btn-main lead" 
            onClick={(e) => {
              e.preventDefault();
              handleLoadMore();
            }}
          >
            Load more
          </Link>
        </div>
      )}
    </>
  );
};

export default ExploreItems;

