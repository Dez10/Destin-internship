import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Skeleton from 'react-loading-skeleton';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import AuthorImage from "../../images/author_thumbnail.jpg";
import nftImage from "../../images/nftImage.jpg";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonCard = () => {
  return (
    <div className="nft_coll">
      <div className="nft_wrap">
        <Skeleton height={250} />
      </div>
      <div className="nft_coll_pp">
        <Skeleton circle width={50} height={50} />
      </div>
      <div className="nft_coll_info">
        <Skeleton width="80%" height={20} />
        <Skeleton width="60%" height={15} />
      </div>
    </div>
  );
};

const HotCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axios.get('https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections');
        setCollections(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  if (error) return <div>Error: {error}</div>;

  return (
    <section id="section-collections" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Hot Collections</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          
          <div className="col-lg-12">
            <Swiper
              modules={[Navigation]}
              spaceBetween={20}
              slidesPerView={4}
              navigation
              loop={true}
              breakpoints={{
                320: {
                  slidesPerView: 1,
                  spaceBetween: 10
                },
                480: {
                  slidesPerView: 2,
                  spaceBetween: 15
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 15
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 20
                }
              }}
            >
              {loading ? (
                [1, 2, 3, 4].map((item) => (
                  <SwiperSlide key={item}>
                    <SkeletonCard />
                  </SwiperSlide>
                ))
              ) : (
                collections.map((collection) => (
                    <SwiperSlide key={collection.id}>
                      <div className="nft_coll">
                        <div className="nft_wrap">
                          <Link to={`/item-details/${collection.nftId}`}>
                            <img 
                              src={collection.nftImage || nftImage} 
                              className="lazy img-fluid" 
                              alt={collection.title} 
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = nftImage;
                              }}
                            />
                          </Link>
                        </div>
                        <div className="nft_coll_pp">
                          <Link 
                            to={`/item-details/${collection.nftId}`}
                            state={{ itemData: collection }}
                          >
                            <img 
                              className="lazy pp-coll" 
                              src={collection.authorImage || AuthorImage} 
                              alt={collection.title}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = AuthorImage;
                              }}
                            />
                          </Link>
                          <i className="fa fa-check"></i>
                        </div>
                        <div className="nft_coll_info">
                          <Link to={`/explore/${collection.id}`}>
                            <h4>{collection.title}</h4>
                          </Link>
                          <span>ERC-{collection.code}</span>
                        </div>
                      </div>
                    </SwiperSlide>
                ))
              )}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HotCollections;










