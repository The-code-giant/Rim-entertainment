import React, { useState, useEffect } from "react";
import Products from "/Components/nfts";
import Link from "next/link";
import { Spin } from "antd";
import EXPLORE_CONSTANTS from "/Constants/exploreConstants";
import {
  CategoriesListContainer,
  CategoriesListScroll,
  CategoriesList,
} from "./StyledComponents/explore-styledComponents";
import {
  SectionHeading,
  LoadingContainer,
  LoadMoreButton,
} from "./StyledComponents/globalStyledComponents";
import { useRouter } from "next/router";
import api from "/Components/axiosRequest";

function Explore() {
  const [isLoad, setLoad] = useState(false);
  const [categories, setCategories] = useState([]);
  const [explores, setExplores] = useState({ assets: [] });
  const [loadMore, setLoadMore] = useState({
    dataLimit: 2,
    dataStart: 0,
    countBy: 2,
    dataLoad: true,
    dataLoadMoreButtonLoading: false,
  });
  async function LoadMoreData(slug) {
    setLoadMore({
      ...loadMore,
      dataLoadMoreButtonLoading: true,
    });
    const fetchedData = await api.get(
      `/categories/${slug}?limit=${loadMore.dataLimit}&offset=${loadMore.dataStart}`
    );
    const assetLength = fetchedData.data.assets.length;
    assetLength === 0
      ? setLoadMore({ ...loadMore, dataLoad: false })
      : (() => {
          setExplores({
            ...explores,
            assets: [...explores.assets, ...fetchedData.data.assets],
          });
          setLoadMore({
            ...loadMore,
            dataStart: loadMore.dataStart + loadMore.countBy,
            dataLoadMoreButtonLoading: false,
          });
        })();
  }

  const router = useRouter();
  const { cat } = router.query;

  async function fetchingData(slug) {
    const fetchedData = await api.get(
      `/categories/${slug}?limit=${loadMore.dataLimit}&offset=0`
    );
    setExplores({
      ...fetchedData.data,
    });
    setLoadMore({
      ...loadMore,
      dataStart: loadMore.countBy,
      dataLoad: true,
    });
    setLoad(true);
  }
  useEffect(() => {
    async function fetchingCats() {
      const data = await api.get("/categories?_sort=id:ASC");
      setCategories(await data.data);
    }
    fetchingCats();

    if (cat != undefined) {
      fetchingData(cat);
    } else {
      fetchingData("all");
    }
  }, [cat]);
  return (
    <>

                            <div className="row  fadeIn"> 
                                <div className="col-lg-12">
                                    <h2 className="style-2">New Items</h2>
                                </div>

                                {/* <!-- nft item begin --> */}
                                <div className=" col-lg-3 col-md-6 col-sm-6 col-xs-12">
                                    <div className="nft__item style-2">
                                        <div className="de_countdown bg-color-secondary text-white" data-year="2021" data-month="10" data-day="16" data-hour="8"></div>
                                        <div className="author_list_pp">
                                            <a href="author.html">                                    
                                                <img className="lazy" src="images/author/author-1.jpg" alt=""  />
                                                <i className="fa fa-check"></i>
                                            </a>
                                        </div>
                                        <div className="nft__item_wrap">
                                            <a href="item-details.html">
                                                <img src="images/items-alt/static-1.jpg" className="lazy nft__item_preview" alt=""  />
                                            </a>
                                        </div>
                                        <div className="nft__item_info">
                                            <a href="item-details.html">
                                                <h4>Sunny Day</h4>
                                            </a>
                                            <div className="nft__item_price">
                                                0.08 ETH<span>1/20</span>
                                            </div>
                                            <div className="nft__item_action">
                                                <a href="#">Place a bid</a>
                                            </div>
                                            <div className="nft__item_like">
                                                <i className="fa fa-heart"></i><span>50</span>
                                            </div>                            
                                        </div> 
                                    </div>
                                </div>                 
                                {/* <!-- nft item begin --> */}
                                <div className=" col-lg-3 col-md-6 col-sm-6 col-xs-12">
                                    <div className="nft__item style-2">
                                        <div className="author_list_pp">
                                            <a href="author.html">                                    
                                                <img className="lazy" src="images/author/author-10.jpg" alt=""  />
                                                <i className="fa fa-check"></i>
                                            </a>
                                        </div>
                                        <div className="nft__item_wrap">
                                            <a href="item-details.html">
                                                <img src="images/items-alt/static-2.jpg" className="lazy nft__item_preview" alt=""  />
                                            </a>
                                        </div>
                                        <div className="nft__item_info">
                                            <a href="item-details.html">
                                                <h4>Blue Planet</h4>
                                            </a>
                                            <div className="nft__item_price">
                                                0.06 ETH<span>1/22</span>
                                            </div>
                                            <div className="nft__item_action">
                                                <a href="#">Place a bid</a>
                                            </div>
                                            <div className="nft__item_like">
                                                <i className="fa fa-heart"></i><span>80</span>
                                            </div>                                 
                                        </div> 
                                    </div>
                                </div>
                                {/* <!-- nft item begin --> */}
                                <div className=" col-lg-3 col-md-6 col-sm-6 col-xs-12">
                                    <div className="nft__item style-2">
                                        <div className="de_countdown bg-color-secondary text-white" data-year="2021" data-month="10" data-day="14" data-hour="8"></div>
                                        <div className="author_list_pp">
                                            <a href="author.html">                                    
                                                <img className="lazy" src="images/author/author-11.jpg" alt=""  />
                                                <i className="fa fa-check"></i>
                                            </a>
                                        </div>
                                        <div className="nft__item_wrap">
                                            <a href="item-details.html">
                                                <img src="images/items-alt/static-3.jpg" className="lazy nft__item_preview" alt=""  />
                                            </a>
                                        </div>
                                        <div className="nft__item_info">
                                            <a href="item-details.html">
                                                <h4>Finally Free</h4>
                                            </a>
                                            <div className="nft__item_price">
                                                0.05 ETH<span>1/11</span>
                                            </div>
                                            <div className="nft__item_action">
                                                <a href="#">Place a bid</a>
                                            </div>
                                            <div className="nft__item_like">
                                                <i className="fa fa-heart"></i><span>97</span>
                                            </div>                                 
                                        </div> 
                                    </div>
                                </div>
                                {/* <!-- nft item begin --> */}
                                <div className=" col-lg-3 col-md-6 col-sm-6 col-xs-12">
                                    <div className="nft__item style-2">
                                        <div className="author_list_pp">
                                            <a href="author.html">                                    
                                                <img className="lazy" src="images/author/author-12.jpg" alt=""  />
                                                <i className="fa fa-check"></i>
                                            </a>
                                        </div>
                                        <div className="nft__item_wrap">
                                            <a href="item-details.html">
                                                <img src="images/items-alt/static-4.jpg" className="lazy nft__item_preview" alt=""  />
                                            </a>
                                        </div>
                                        <div className="nft__item_info">
                                            <a href="item-details.html">
                                                <h4>Work From Home</h4>
                                            </a>
                                            <div className="nft__item_price">
                                                0.02 ETH<span>1/15</span>
                                            </div>
                                            <div className="nft__item_action">
                                                <a href="#">Place a bid</a>
                                            </div>
                                            <div className="nft__item_like">
                                                <i className="fa fa-heart"></i><span>73</span>
                                            </div>                                 
                                        </div> 
                                    </div>
                                </div>
                                {/* <!-- nft item begin --> */}
                                <div className=" col-lg-3 col-md-6 col-sm-6 col-xs-12">
                                    <div className="nft__item style-2">
                                        <div className="author_list_pp">
                                            <a href="author.html">                                    
                                                <img className="lazy" src="images/author/author-9.jpg" alt=""  />
                                                <i className="fa fa-check"></i>
                                            </a>
                                        </div>
                                        <div className="nft__item_wrap">
                                            <a href="item-details.html">
                                                <img src="images/items/anim-4.webp" className="lazy nft__item_preview" alt=""  />
                                            </a>
                                        </div>
                                        <div className="nft__item_info">
                                            <a href="item-details.html">
                                                <h4>The Truth</h4>
                                            </a>
                                            <div className="nft__item_price">
                                                0.06 ETH<span>1/20</span>
                                            </div>
                                            <div className="nft__item_action">
                                                <a href="#">Place a bid</a>
                                            </div>
                                            <div className="nft__item_like">
                                                <i className="fa fa-heart"></i><span>26</span>
                                            </div>                                 
                                        </div>
                                    </div>
                                </div>
                                {/* <!-- nft item begin --> */}
                                <div className=" col-lg-3 col-md-6 col-sm-6 col-xs-12">
                                    <div className="nft__item style-2">
                                        <div className="de_countdown bg-color-secondary text-white" data-year="2021" data-month="10" data-day="15" data-hour="8"></div>
                                        <div className="author_list_pp">
                                            <a href="author.html">                                    
                                                <img className="lazy" src="images/author/author-2.jpg" alt=""  />
                                                <i className="fa fa-check"></i>
                                            </a>
                                        </div>
                                        <div className="nft__item_wrap">
                                            <a href="item-details.html">
                                                <img src="images/items-alt/static-5.jpg" className="lazy nft__item_preview" alt=""  />
                                            </a>
                                        </div>
                                        <div className="nft__item_info">
                                            <a href="item-details.html">
                                                <h4>Running Puppets</h4>
                                            </a>
                                            <div className="nft__item_price">
                                                0.03 ETH<span>1/24</span>
                                            </div>    
                                            <div className="nft__item_action">
                                                <a href="#">Place a bid</a>
                                            </div>
                                            <div className="nft__item_like">
                                                <i className="fa fa-heart"></i><span>45</span>
                                            </div>                                  
                                        </div> 
                                    </div>
                                </div>
                                {/* <!-- nft item begin --> */}
                                <div className=" col-lg-3 col-md-6 col-sm-6 col-xs-12">
                                    <div className="nft__item style-2">
                                        <div className="author_list_pp">
                                            <a href="author.html">                                    
                                                <img className="lazy" src="images/author/author-3.jpg" alt=""  />
                                                <i className="fa fa-check"></i>
                                            </a>
                                        </div>
                                        <div className="nft__item_wrap">
                                            <a href="item-details.html">
                                                <img src="images/items-alt/static-6.jpg" className="lazy nft__item_preview" alt=""  />
                                            </a>
                                        </div>
                                        <div className="nft__item_info">
                                            <a href="item-details.html">
                                                <h4>Green Frogman</h4>
                                            </a>
                                            <div className="nft__item_price">
                                                0.09 ETH<span>1/25</span>
                                            </div>
                                            <div className="nft__item_action">
                                                <a href="#">Place a bid</a>
                                            </div>
                                            <div className="nft__item_like">
                                                <i className="fa fa-heart"></i><span>76</span>
                                            </div>                                 
                                        </div> 
                                    </div>
                                </div>
                                {/* <!-- nft item begin --> */}
                                <div className=" col-lg-3 col-md-6 col-sm-6 col-xs-12">
                                    <div className="nft__item style-2">
                                        <div className="de_countdown bg-color-secondary text-white" data-year="2021" data-month="9" data-day="29" data-hour="8"></div>
                                        <div className="author_list_pp">
                                            <a href="author.html">                                    
                                                <img className="lazy" src="images/author/author-4.jpg" alt=""  />
                                                <i className="fa fa-check"></i>
                                            </a>
                                        </div>
                                        <div className="nft__item_wrap">
                                            <a href="item-details.html">
                                                <img src="images/items/anim-5.webp" className="lazy nft__item_preview" alt=""  />
                                            </a>
                                        </div>
                                        <div className="nft__item_info">
                                            <a href="item-details.html">
                                                <h4>Loop Donut</h4>
                                            </a>
                                            <div className="nft__item_price">
                                                0.09 ETH<span>1/14</span>
                                            </div>
                                            <div className="nft__item_action">
                                                <a href="#">Place a bid</a>
                                            </div>
                                            <div className="nft__item_like">
                                                <i className="fa fa-heart"></i><span>94</span>
                                            </div>                                 
                                        </div> 
                                    </div>
                                </div>
                            </div>

                                {/* <div className="spacer-single"></div> */}

                                <div className="spacer-single"></div>

                                <div className="row">
                                    <div className="col-lg-12">
                                        <h2 className="style-2">Top Sellers</h2>
                                    </div>
                                    <div className="col-md-12  fadeIn">
                                        <ol className="author_list">
                                            <li>                                    
                                                <div className="author_list_pp">
                                                    <a href="author.html">
                                                        <img className="lazy" src="images/author/author-1.jpg" alt=""  />
                                                        <i className="fa fa-check"></i>
                                                    </a>
                                                </div>                                    
                                                <div className="author_list_info">
                                                    <a href="author.html">Monica Lucas</a>
                                                    <span>3.2 ETH</span>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="author_list_pp">
                                                    <a href="author.html">                                    
                                                        <img className="lazy" src="images/author/author-2.jpg" alt=""  />
                                                        <i className="fa fa-check"></i>
                                                    </a>
                                                </div>
                                                <div className="author_list_info">
                                                    <a href="author.html">Mamie Barnett</a>
                                                    <span>2.8 ETH</span>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="author_list_pp">
                                                    <a href="author.html">                                    
                                                        <img className="lazy" src="images/author/author-3.jpg" alt=""  />
                                                        <i className="fa fa-check"></i>
                                                    </a>
                                                </div>
                                                <div className="author_list_info">
                                                    <a href="author.html">Nicholas Daniels</a>
                                                    <span>2.5 ETH</span>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="author_list_pp">
                                                    <a href="author.html">                                    
                                                        <img className="lazy" src="images/author/author-4.jpg" alt=""  />
                                                        <i className="fa fa-check"></i>
                                                    </a>
                                                </div>
                                                <div className="author_list_info">
                                                    <a href="author.html">Lori Hart</a>
                                                    <span>2.2 ETH</span>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="author_list_pp">
                                                    <a href="author.html">                                    
                                                        <img className="lazy" src="images/author/author-5.jpg" alt=""  />
                                                        <i className="fa fa-check"></i>
                                                    </a>
                                                </div>
                                                <div className="author_list_info">
                                                    <a href="author.html">Jimmy Wright</a>
                                                    <span>1.9 ETH</span>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="author_list_pp">
                                                    <a href="author.html">                                    
                                                        <img className="lazy" src="images/author/author-6.jpg" alt=""  />
                                                        <i className="fa fa-check"></i>
                                                    </a>
                                                </div>
                                                <div className="author_list_info">
                                                    <a href="author.html">Karla Sharp</a>
                                                    <span>1.6 ETH</span>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="author_list_pp">
                                                    <a href="author.html">                                    
                                                        <img className="lazy" src="images/author/author-7.jpg" alt=""  />
                                                        <i className="fa fa-check"></i>
                                                    </a>
                                                </div>
                                                <div className="author_list_info">
                                                    <a href="author.html">Gayle Hicks</a>
                                                    <span>1.5 ETH</span>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="author_list_pp">
                                                    <a href="author.html">                                    
                                                        <img className="lazy" src="images/author/author-8.jpg" alt=""  />
                                                        <i className="fa fa-check"></i>
                                                    </a>
                                                </div>
                                                <div className="author_list_info">
                                                    <a href="author.html">Claude Banks</a>
                                                    <span>1.3 ETH</span>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="author_list_pp">
                                                    <a href="author.html">                                    
                                                        <img className="lazy" src="images/author/author-9.jpg" alt=""  />
                                                        <i className="fa fa-check"></i>
                                                    </a>
                                                </div>
                                                <div className="author_list_info">
                                                    <a href="author.html">Franklin Greer</a>
                                                    <span>0.9 ETH</span>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="author_list_pp">
                                                    <a href="author.html">                                    
                                                        <img className="lazy" src="images/author/author-10.jpg" alt=""  />
                                                        <i className="fa fa-check"></i>
                                                    </a>
                                                </div>
                                                <div className="author_list_info">
                                                    <a href="author.html">Stacy Long</a>
                                                    <span>0.8 ETH</span>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="author_list_pp">
                                                    <a href="author.html">                                    
                                                        <img className="lazy" src="images/author/author-11.jpg" alt=""  />
                                                        <i className="fa fa-check"></i>
                                                    </a>
                                                </div>
                                                <div className="author_list_info">
                                                    <a href="author.html">Ida Chapman</a>
                                                    <span>0.6 ETH</span>
                                                </div>
                                            </li>
                                            <li>
                                                <div className="author_list_pp">
                                                    <a href="author.html">                                    
                                                        <img className="lazy" src="images/author/author-12.jpg" alt=""  />
                                                        <i className="fa fa-check"></i>
                                                    </a>
                                                </div>
                                                <div className="author_list_info">
                                                    <a href="author.html">Fred Ryan</a>
                                                    <span>0.5 eth</span>
                                                </div>
                                            </li>
                                        </ol>
                                    </div>
                                </div>
                     
    </>
  );
}
export default Explore;
