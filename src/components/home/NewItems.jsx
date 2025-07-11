import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import NFTItemCard from "../UI/NFTItemCard";
import NFTItemSkeleton, { SkeletonStyles } from "../UI/NFTItemSkeleton";

import "swiper/css";
import "swiper/css/navigation";

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
      <SkeletonStyles />
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
                        <NFTItemSkeleton />
                      </SwiperSlide>
                    ))
                  : items.map((item) => (
                      <SwiperSlide key={item.id}>
                        <NFTItemCard item={item} showShareButtons={true} />
                      </SwiperSlide>
                    ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewItems;

