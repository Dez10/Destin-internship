import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import AuthorImage from "../../images/author_thumbnail.jpg";

const TopSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/topSellers"
        );

        setSellers(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSellers();
  }, []);

  return (
    <section id="section-popular" className="pb-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Top Sellers</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          <div className="col-md-12">
            {error ? (
              <div className="text-center">Error: {error}</div>
            ) : (
              <ol className="author_list">
                {loading
                  ? Array(12)
                      .fill(null)
                      .map((_, index) => (
                        <li key={`skeleton-${index}`}>
                          <div className="author_list_pp">
                            <div
                              className="skeleton-box"
                              style={{
                                width: "50px",
                                height: "50px",
                                borderRadius: "50%",
                              }}
                            ></div>
                          </div>
                          <div className="author_list_info">
                            <div
                              className="skeleton-box"
                              style={{
                                width: "100px",
                                height: "20px",
                                marginBottom: "5px",
                              }}
                            ></div>
                            <div
                              className="skeleton-box"
                              style={{ width: "60px", height: "16px" }}
                            ></div>
                          </div>
                        </li>
                      ))
                  : sellers.map((seller) => (
                      <li key={seller.id}>
                        <div className="author_list_pp">
                          <Link to={`/author/${seller.authorId}`}>
                            <img
                              className="lazy pp-author"
                              src={seller.authorImage}
                              alt={seller.authorName}
                              onError={(e) => {
                                e.target.src = AuthorImage;
                              }}
                            />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>
                        <div className="author_list_info">
                          <Link to={`/author/${seller.authorId}`}>
                            {seller.authorName}
                          </Link>
                          <span>{seller.price} ETH</span>
                        </div>
                      </li>
                    ))}
              </ol>
            )}
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

export default TopSellers;
