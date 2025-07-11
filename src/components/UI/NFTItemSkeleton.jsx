import React from "react";

const NFTItemSkeleton = () => {
  return (
    <div className="nft__item">
      <div className="author_list_pp">
        <div className="skeleton-box" style={{ 
          width: "50px", 
          height: "50px", 
          borderRadius: "50%",
          marginBottom: "15px"
        }}></div>
      </div>
      <div className="de_countdown skeleton-box" style={{ 
        width: "120px", 
        height: "24px",
        marginBottom: "15px",
        borderRadius: "12px"
      }}></div>
      <div className="nft__item_wrap">
        <div className="skeleton-box" style={{ 
          height: "250px", 
          width: "100%",
          borderRadius: "8px",
          marginBottom: "15px"
        }}></div>
      </div>
      <div className="nft__item_info">
        <div className="skeleton-box" style={{ 
          width: "70%", 
          height: "24px", 
          marginBottom: "10px",
          borderRadius: "4px"
        }}></div>
        <div className="skeleton-box" style={{ 
          width: "40%", 
          height: "20px", 
          marginBottom: "10px",
          borderRadius: "4px"
        }}></div>
        <div className="skeleton-box" style={{ 
          width: "30%", 
          height: "20px",
          borderRadius: "4px"
        }}></div>
      </div>
    </div>
  );
};

// Skeleton styles as a separate component to be imported once
export const SkeletonStyles = () => (
  <style>
    {`
      @keyframes shimmer {
        0% { 
          transform: translateX(-100%);
        }
        50% {
          transform: translateX(-100%);
        }
        100% { 
          transform: translateX(100%);
        }
      }
      
      .skeleton-box {
        position: relative;
        overflow: hidden;
        background: #f0f0f0;
        background: linear-gradient(90deg, #f0f0f0 25%, transparent 37%, #f0f0f0 63%);
        background-size: 400% 100%;
        animation: shimmer 1.5s ease-in-out infinite;
        border-radius: 4px;
        display: block;
      }
      
      .skeleton-box::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
        transform: translateX(-100%);
        animation: shimmer-wave 2s infinite;
      }
      
      @keyframes shimmer-wave {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(100%);
        }
      }
    `}
  </style>
);

export default NFTItemSkeleton;
