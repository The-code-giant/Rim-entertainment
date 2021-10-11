import {
  DatePicker,
  Form,
  Input,
  Tabs,
  message,
  Statistic, Slider
} from "antd";

import {
  CustomTapBarElement,
  SellAssetContent
} from "../../Components/StyledComponents/sellNft-styledComponents";
import {
  CountDownContainer
} from "../../Components/StyledComponents/explore-styledComponents";
import React, { useEffect, useState } from "react";
import { fetchBundle, fetchOne } from "/Utils/strapiApi";
import {
  getAccountTokens,
  getMetaConnected,
  getWalletConnected,
} from "store/action/accountSlice";

import Link from "next/link";
import { getAuctionPriceDetails } from "/Constants/constants";
import { sellOrder, signTransaction, unixToMilSeconds } from "Utils/utils";
import { socket } from "config/websocket";
import { useQueryParam } from "/Components/hooks/useQueryParam";
import { useSelector } from "react-redux";

const { TabPane } = Tabs;
const { Countdown } = Statistic
function SellNft() {
  const queryParam = useQueryParam();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [futureTime, setFutureTime] = useState(false);
  const [formText, setFormText] = useState({
    price: "Price",
    priceDesc: "Will be on sale until you transfer this item or cancel it",
    includeEnding: "Include ending price",
    includeEndingDesc:
      "Adding an ending price will allow this listing to expire, or for the price to be reduced until a buyer is found.",
  });
  const isWalletConnected = useSelector(getWalletConnected);
  const isMetaConnected = useSelector(getMetaConnected);
  const tokenAddresses = useSelector(getAccountTokens);
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState(null);
  const [endingPrice, setEndingPrice] = useState(false);
  const [isFixed, setIsFixed] = useState(true);
  const [posting, setPosting] = useState(false);
  const [hasOrder, setHasOrder] = useState(false);
  async function loadNft() {
    if (queryParam.sellToken != undefined && queryParam.tokenId != undefined) {
      const data = await fetchOne(queryParam.sellToken, queryParam.tokenId);
      if (data) {
        setLoading(false);
      }

      if (data.status == 200) {
        console.log(data);
        const nft = data.data;
        if (nft.sellOrder) setHasOrder(false); // console.log

        setAsset({
          name: nft.name,
          description: nft.description,
          owner: nft.owner,
          creator: nft?.creator,
          image: nft.imageUrl,
          contractAddress: nft?.assetContract?.address,
          tokenId: nft.tokenId,
          tokenAddress: nft.tokenAddress,
          collection: nft.collection,
          isPresale: nft.isPresale,
          thumbnail: nft.imageUrlThumbnail,
          sellOrder: nft.sellOrder,
          numOfSales: nft.numSales,
        });
      } else if (data == "error") {
        setNotFound(true);
      }
    }
  }
  const data = [
    {
      title: "Nft info",
    },
  ];
  function handleIncludeEndPrice(checked) {
    if (checked) {
      setFormText({
        ...formText,
        price: "Starting Price",
        priceDesc: "Set an initial price",
        includeEndingDesc: "",
      });
      setEndingPrice(true);
    } else {
      setFormText({
        ...formText,
        price: "Price",
        priceDesc: "Will be on sale until you transfer this item or cancel it",
        includeEnding: "Include ending price",
        includeEndingDesc:
          "Adding an ending price will allow this listing to expire, or for the price to be reduced until a buyer is found.",
      });
      setEndingPrice(false);
    }
  }
  function handleFutureListing(checked) {
    if (checked) {
      setFutureTime(true);
    } else {
      setFutureTime(false);
    }
  }
  const config = {
    rules: [
      {
        type: "object",
        required: true,
      },
    ],
  };
  const [bountyValue, setBountyValue] = useState(parseFloat(1).toFixed(2));
  const onChange = (value) => {
    if (isNaN(value)) {
      return;
    }
    setBountyValue(value);
  };
  const onSubmitForm = async (values) => {
    const enableAccount = await ethereum.enable();
    if (enableAccount) {
      if (enableAccount.length > 0) {
        const buySign = await signTransaction(
          enableAccount[0],
          "Request to Sell",
          asset
        );
        if (buySign.success) {
          setPosting(true);
          const sell = await sellOrder(
            queryParam.sellToken,
            queryParam.tokenId,
            address,
            asset?.contractAddress,
            values,
            isFixed
          );
          if (sell?.hash) {
            message.success("Sell order is saved");
            socket.emit("userCreatedNewFixedSell", sell);
            setHasOrder(true);
          } else {
            message.error(sell.toString());
            setPosting(false);
          }
        }
      }
    }
  };
  const onTabClick = (e) => {
    if (e == 2) {
      setIsFixed(false);
    } else if (e == 1) {
      setIsFixed(true);
    }
  };
  useEffect(() => {
    if (!queryParam) {
      return null;
    }
    if (isWalletConnected) {
      setAddress(tokenAddresses.walletToken[0]);
      setBalance(tokenAddresses.walletBalance);
    } else if (isMetaConnected) {
      setAddress(tokenAddresses.metaToken[0]);
      setBalance(tokenAddresses.metaBalance);
    }
    loadNft();
  }, [queryParam]);
  return (
    <div className="no-bottom" id="content">
      <section id="subheader" className="text-light AssetSubheader">
        <div className="center-y relative text-center">
          <div className="container">
            <div className="row">
              <div className="col-md-12 text-center">
                <h1>Sell your Asset</h1>
              </div>
              <div className="clearfix"></div>
            </div>
          </div>
        </div>
      </section>
      <section aria-label="section">
        <SellAssetContent className="container">
          <div className="row fadeIn">
            <div className="col-lg-7 offset-lg-1">
              <Form onFinish={onSubmitForm} className="form-border">

                <div className="field-set">
                  <h5>Select method</h5>
                  <Tabs
                    defaultActiveKey="1"
                    onTabClick={onTabClick}
                    tabBarGutter={10}
                    // style={{ height: "500px" }}
                    // size={"large"}
                    type={"card"}
                  >
                    <TabPane
                      tab={
                        <CustomTapBarElement>
                          <div><i className="fa fa-tag"></i></div>
                          <span>
                            {"Fixed Price"}
                          </span>
                        </CustomTapBarElement>
                      }
                      key="1"
                      style={{ height: 200 }}
                    >
                      <h5>Price</h5>
                      <Form.Item
                        name={["price", "amount"]}
                      >
                        <input type="text" name="item_price" id="item_price" className="form-control" placeholder="enter price for one item (ETH)" />
                      </Form.Item>
                    </TabPane>
                    <TabPane
                      tab={
                        <CustomTapBarElement>
                          <div>{<i className="fa fa-hourglass-1"></i>}</div>
                          <span>
                            {"Timed Auction"}
                          </span>
                        </CustomTapBarElement>
                      }
                      key="2"
                      style={{ height: 200 }}
                    >
                      {!isFixed && (<>
                        <h5>Minimum bid</h5>
                        <Form.Item
                          name={["price", "minAmount"]}
                          noStyle
                          rules={[
                            {
                              required: true,
                              message: "Amount is required",
                            },
                          ]}
                        >
                          <Input size={"middle"} className={"form-control"} placeholder={"Enter minimum bid"} />
                          {/* <input type="text" name="item_price_bid" id="item_price_bid" className="form-control" placeholder="enter minimum bid" /> */}
                        </Form.Item>

                        <div className="spacer-10"></div>

                        <div className="row">
                          {/* <div className="col-md-6">
                          <h5>Starting date</h5>
                          <input type="date" name="bid_starting_date" id="bid_starting_date" className="form-control" min="1997-01-01" />
                        </div> */}
                          <div className="col-md-12">
                            <h5>Expiration date</h5>
                            <Form.Item
                              name={["date", "auctionExpirationTime"]}
                            >
                              <DatePicker

                                showTime
                                allowClear={false}
                                format="YYYY-MM-DD HH:mm:ss"
                                {...config}
                                className={"form-control"}
                                size={"large"}
                              />
                            </Form.Item>
                          </div>
                          <div className="spacer-single"></div>
                        </div>
                      </>)}
                    </TabPane>
                  </Tabs>
                  <input type="submit" id="submit" className="btn-main" value="Create Item" />
                  <div className="spacer-single"></div>
                </div>
              </Form>
            </div>

            <div className="col-lg-3 col-sm-6 col-xs-12">
              <h5>Asset preview</h5>
              <div className="nft__item">
                {/* <div className="de_countdown" data-year="2021" data-month="10" data-day="16" data-hour="8"></div> */}
                {asset?.asset?.sellOrders && asset?.asset?.sellOrders?.length > 0 && asset?.asset?.sellOrders[0].expirationTime !== "0" &&
                  <CountDownContainer>
                    <Countdown
                      value={unixToMilSeconds(asset?.asset?.sellOrders[0].expirationTime)}
                      format={`D[d] HH[h] mm[m] ss[s]`}
                      valueStyle={{ lineHeight: "1.1", color: "white" }}
                    />
                  </CountDownContainer>}
                <div className="author_list_pp">
                  <a href="#">
                    <img className="lazy" src={asset?.owner?.profile_img_url} alt="" />
                    <i className="fa fa-check"></i>
                  </a>
                </div>
                <div className="nft__item_wrap">
                  <Link href={`/nft/${asset?.tokenAddress}?tokenId=${asset?.tokenId}`}>
                    <a>
                      <img src={asset?.thumbnail} id="get_file_2" className="lazy nft__item_preview" alt="" />
                    </a>
                  </Link>
                </div>
                <div className="nft__item_info">
                  <Link href={`/nft/${asset?.tokenAddress}?tokenId=${asset?.tokenId}`}>
                    <a>
                      <h4>{asset?.name}</h4>
                    </a>
                  </Link>
                  <div className="nft__item_price">
                    <span> {asset?.sellOrders?.length > 0 ? `${getAuctionPriceDetails(asset?.asset?.sellOrders[0]).priceBase} ${asset?.asset?.sellOrders[0]?.paymentTokenContract.symbol}` : ""}</span>
                  </div>
                  <div className="nft__item_action">
                    <Link href={`/nft/${asset?.tokenAddress}?tokenId=${asset?.tokenId}`}>
                      <a target={"_blank"}>View in other Page</a>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SellAssetContent>
      </section>

    </div>
  );
}

export default SellNft;
