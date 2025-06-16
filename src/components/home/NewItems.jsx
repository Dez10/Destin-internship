import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import AuthorImage from "../../images/author_thumbnail.jpg";
import nftImage from "../../images/nftImage.jpg";

import "swiper/css";
import "swiper/css/navigation";

const CountdownTimer = ({ expiryDate }) => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
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

const NewItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems"
        );
        setItems(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  if (error) return <div>Error: {error}</div>;

  return (
    <section id="section-items" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>New Items</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>

          <div className="col-lg-12">
            <div style={{ position: "relative", padding: "0 20px" }}>
              <Swiper
                modules={[Navigation]}
                spaceBetween={20}
                slidesPerView={4}
                navigation
                loop={true}
                breakpoints={{
                  320: { slidesPerView: 1, spaceBetween: 10 },
                  480: { slidesPerView: 2, spaceBetween: 15 },
                  768: { slidesPerView: 3, spaceBetween: 15 },
                  1024: { slidesPerView: 4, spaceBetween: 20 },
                }}
              >
                {loading
                  ? Array(4).fill(null).map((_, index) => (
                      <SwiperSlide key={`skeleton-${index}`}>
                        <div className="nft__item">
                          <div className="author_list_pp">
                            <div className="skeleton-box" style={{ width: "50px", height: "50px", borderRadius: "50%" }}></div>
                          </div>
                          <div className="de_countdown skeleton-box" style={{ width: "120px", height: "24px" }}></div>
                          <div className="nft__item_wrap">
                            <div className="skeleton-box" style={{ height: "250px", width: "100%" }}></div>
                          </div>
                          <div className="nft__item_info">
                            <div className="skeleton-box" style={{ width: "70%", height: "24px", marginBottom: "10px" }}></div>
                            <div className="skeleton-box" style={{ width: "40%", height: "20px", marginBottom: "10px" }}></div>
                            <div className="skeleton-box" style={{ width: "30%", height: "20px" }}></div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))
                  : items.map((item) => (
                      <SwiperSlide key={item.id}>
                        <div className="nft__item">
                          <div className="author_list_pp">
                            <Link to={`/author/${item.authorId}`} title={`Creator: ${item.title}`}>
                              <img
                                className="lazy"
                                src={item.authorImage || AuthorImage}
                                alt={item.title}
                                onError={(e) => { e.target.src = AuthorImage }}
                              />
                              <i className="fa fa-check"></i>
                            </Link>
                          </div>

                          <CountdownTimer expiryDate={item.expiryDate} />

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
                                alt={item.title}
                                loading="lazy"
                                onError={(e) => { e.target.src = nftImage }}
                              />
                            </Link>
                          </div>
                          <div className="nft__item_info">
                            <Link to={`/item-details/${item.nftId}`}>
                              <h4>{item.title}</h4>
                            </Link>
                            <div className="nft__item_price">{item.price || "3.08"} ETH</div>
                            <div className="nft__item_like">
                              <i className="fa fa-heart"></i>
                              <span>{item.likes || 0}</span>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes shimmer {
            0% { background-position: -1000px 0 }
            100% { background-position: 1000px 0 }
          }
          .skeleton-box {
            display: inline-block;
            position: relative;
            overflow: hidden;
            background-color: #DDDBDD;
          }
          .skeleton-box::after {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            transform: translateX(-100%);
            background-image: linear-gradient(90deg, rgba(255,255,255,0) 0, rgba(255,255,255,0.2) 20%, rgba(255,255,255,0.5) 60%, rgba(255,255,255,0));
            animation: shimmer 2s infinite;
            content: '';
          }
        `}
      </style>
    </section>
  );
};

export default NewItems;

