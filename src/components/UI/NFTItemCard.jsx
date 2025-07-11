import React from "react";
import { Link } from "react-router-dom";
import AuthorImage from "../../images/author_thumbnail.jpg";
import nftImage from "../../images/nftImage.jpg";

const CountdownTimer = ({ expiryDate }) => {
  const [timeLeft, setTimeLeft] = React.useState({ hours: 0, minutes: 0, seconds: 0 });

  React.useEffect(() => {
    if (!expiryDate) return;
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const diff = expiryDate - now;
      
      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
        return;
      }
      
      setTimeLeft({
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [expiryDate]);

  const format = num => String(num).padStart(2, "0");
  
  return (
    <div className="de_countdown">
      {!expiryDate ? "No Time Limit" : 
        `${format(timeLeft.hours)}h ${format(timeLeft.minutes)}m ${format(timeLeft.seconds)}s`}
    </div>
  );
};

const NFTItemCard = ({ item, showShareButtons = true }) => {
  return (
    <div className="nft__item">
      <div className="author_list_pp">
        <Link
          to={`/author/${item.authorId}`}
          data-bs-toggle="tooltip"
          data-bs-placement="top"
          title={`Creator: ${item.title}`}
        >
          <img 
            className="lazy" 
            src={item.authorImage || AuthorImage} 
            alt={item.authorName || item.title || "Author"}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = AuthorImage;
            }}
          />
          <i className="fa fa-check"></i>
        </Link>
      </div>

      {item.expiryDate && (
        <CountdownTimer expiryDate={item.expiryDate} />
      )}

      <div className="nft__item_wrap">
        {showShareButtons && (
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
        )}
        
        <Link to={`/item-details/${item.nftId}`}>
          <img 
            src={item.nftImage || nftImage} 
            className="lazy nft__item_preview" 
            alt={item.title || "NFT"}
            loading="lazy"
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
  );
};

export default NFTItemCard;
