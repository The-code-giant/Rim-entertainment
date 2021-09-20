import {
  Avatar,
  Card,
  Dropdown,
  Menu,
  Space,
  Spin,
  Statistic,
  Tooltip,
} from "antd";
import {
  BidsStatus,
  Button,
  CardImage,
  CardTitle,
  CountDown,
  CountDownContainer,
  ProductCard,
  ProductCardHeader,
  ProductCardHeaderButton,
  ProductCardHeaderOwners,
  ProductDescription,
  ProductDescriptionBottom,
  ProductList,
  ProductPrice,
} from "./StyledComponents/liveAuctions-styledComponents";
import React, { useEffect, useState } from "react";
import { checkName, unixToMilSeconds } from "/Utils/utils";

import CONSTANTS from "/Constants/fixedSellsConstants";
import Carousel from "react-elastic-carousel";
import CustomNotification from "./commons/customNotification";
import Link from "next/link";
import { SectionHeading } from "./StyledComponents/globalStyledComponents";
import { fetch } from "Utils/strapiApi";
import { getAuctionPriceDetails } from "/Constants/constants";
import { socket } from "config/websocket";
import styles from "/styles/ui.module.css";

const breakPoints = [
  { width: 1, itemsToShow: 1 },
  { width: 550, itemsToShow: 2, itemsToScroll: 2 },
  { width: 768, itemsToShow: 3, itemsToScroll: 3 },
  { width: 1024, itemsToShow: 4, itemsToScroll: 4 },
  { width: 1200, itemsToShow: 5, itemsToScroll: 5 },
];
const deadline = Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30;

const { Countdown } = Statistic;
function FixedSells({ data }) {
  const [serverFixedPriceSells, setServerFixedPriceSells] = useState(data);

  // const loadServerFixedPriceSells = async () => {
  //   await fetch("/nfts/fixed")
  //     .then((response) => {
  //       console.log("seeting collection data");
  //       const fixed = response.data;
  //       setServerFixedPriceSells(fixed);
  //     })
  //     .catch((e) => {
  //       console.log("error in loading collection", e);
  //       CustomNotification(
  //         "warning",
  //         "Fixed Price",
  //         "Error loading Fix Price sell, try later"
  //       );
  //     });
  // };

  useEffect(() => {
    socket.on("serverBroadCaseNewFixedPriceSell", (data) => {
      if (data.saleKind == 0) {
        setServerFixedPriceSells((prev) => [data, ...prev]);
      }
    });
    // loadServerFixedPriceSells();
  }, []);

  return (
    <>
      <SectionHeading>{CONSTANTS.fixedSells}</SectionHeading>
      <Carousel
        breakPoints={breakPoints}
        pagination={false}
        transitionMs={1000}
      >
        {serverFixedPriceSells &&
          serverFixedPriceSells?.map((product, index) =>
            Product(product, index)
          )}
      </Carousel>
    </>
  );
}

function Product(product, index) {
  const pr = getAuctionPriceDetails(product);
  const price = pr.priceBase;
  return (
    <ProductCard key={index} className={`p-2 p-lg-1 mr-3`}>
      <ProductCardHeader className={`mt-3`}>
        <ProductCardHeaderOwners>
          <Avatar.Group>
            <Tooltip
              title={`Owner: ${checkName(
                product?.asset?.owner?.user?.username
              )}`}
              placement="top"
            >
              <Avatar
                key={product.asset?.owner.address}
                icon={
                  <img src={product.asset?.owner.profile_img_url} width={22} />
                }
              />
            </Tooltip>
            <Tooltip
              title={`Maker: ${checkName(
                product?.makerAccount.user?.username
              )}`}
              placement="top"
            >
              <Avatar
                key={product?.makerAccount.address}
                icon={
                  <img src={product?.makerAccount.profile_img_url} width={22} />
                }
              />
            </Tooltip>
          </Avatar.Group>
        </ProductCardHeaderOwners>
        <ProductCardHeaderButton>
          <Dropdown
            trigger={["click"]}
            overlay={
              <Menu>
                <Menu.Item key="2">
                  <Link
                    href={
                      product?.asset
                        ? `/nft/${product.asset?.tokenAddress}?tokenId=${product.asset?.tokenId}`
                        : `/nft/${product?.assetBundle?.maker?.address}?slug=${product?.assetBundle?.slug}`
                    }
                  >
                    <a>
                      <span>{CONSTANTS.placeBid}</span>
                    </a>
                  </Link>
                </Menu.Item>
              </Menu>
            }
            placement="bottomRight"
          >
            <Button>...</Button>
          </Dropdown>
        </ProductCardHeaderButton>
      </ProductCardHeader>
      <CardImage className={`p-3`}>
        <Link
          href={
            product?.asset
              ? `/nft/${product.asset?.tokenAddress}?tokenId=${product.asset?.tokenId}`
              : `/nft/${product?.assetBundle?.maker?.address}?slug=${product?.assetBundle?.slug}`
          }
        >
          <a>
            {" "}
            <img
              src={
                product?.asset
                  ? product.asset?.imageUrl
                  : product?.assetBundle?.assets[0].imageUrl
              }
              className="rounded"
            />
          </a>
        </Link>
      </CardImage>
      <ProductDescription>
        <Link
          href={
            product?.asset
              ? `/nft/${product.asset?.tokenAddress}?tokenId=${product.asset?.tokenId}`
              : `/nft/${product?.assetBundle?.maker?.address}?slug=${product?.assetBundle?.slug}`
          }
        >
          <a>
            <CardTitle>
              {product?.asset
                ? product.asset?.name
                  ? product.asset?.name
                  : product.asset?.collection?.name
                : product?.assetBundle?.name}
            </CardTitle>
          </a>
        </Link>
        {/* <BidsStatus>{CONSTANTS.bidsStatus}</BidsStatus> */}
        <ProductDescriptionBottom>
          <ProductPrice>{`${price} ${product.paymentTokenContract.symbol}`}</ProductPrice>
          {/* <ProductList>
            {" " + "1" + " of " + "2"}
          </ProductList> */}
        </ProductDescriptionBottom>
      </ProductDescription>
    </ProductCard>
  );
}
export default FixedSells;
