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
  const [displayedItems, setDisplayedItems] = useState(8); // Show 8 items initially

  useEffect(() => {
    const fetchItems = async () => {
      try {
        let response;
        
        // First try the correct API endpoint with filter support
        try {
          console.log("Attempting to fetch explore items...");
          
          let url = categoryId 
            ? `https://us-central1-nft-cloud-functions.cloudfunctions.net/explore/${categoryId}` 
            : `https://us-central1-nft-cloud-functions.cloudfunctions.net/explore`;
          
          // Add filter parameter if one is selected
          if (filter) {
            url += `?filter=${filter}`;
          }
          
          response = await axios.get(url, { timeout: 5000 });
          console.log("Successfully fetched from explore API:", response.data);
          
        } catch (exploreError) {
          console.log("explore API not available, using fallback APIs");
          console.log("Error details:", exploreError.message);
          
          // Fallback to working APIs
          if (categoryId) {
            // If there's a category ID, we'll need to filter later or use a different approach
            response = await axios.get('https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections');
          } else {
            // Use hotCollections as fallback for general explore
            response = await axios.get('https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections');
          }
        }
        
        console.log("Explore items:", response.data);
        console.log("First item structure:", response.data[0]); // Log first item to see data structure
        setItems(response.data);
        setDisplayedItems(8); // Reset to show 8 items initially
        setLoading(false);
      } catch (err) {
        console.error("Error fetching explore items:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchItems();
  }, [categoryId, filter]); // Add filter to dependency array

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setLoading(true); // Show loading state while fetching filtered data
    setDisplayedItems(8); // Reset to 8 items when filter changes
    // The useEffect will automatically trigger with the new filter value
  };

  const handleLoadMore = () => {
    setDisplayedItems(prevCount => prevCount + 4); // Add 4 more items
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

