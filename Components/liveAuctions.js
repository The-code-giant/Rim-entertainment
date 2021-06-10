import React, { useEffect, useState } from "react";
import { PRODUCTS, getAuctionPriceDetails } from "/Constants/constants";
import Carousel from "react-elastic-carousel";
import { Menu, Dropdown, Avatar, Tooltip } from "antd";
import Link from "next/link";
import CONSTANTS from "/Constants/liveAuctionsConstants";
import {
  Button,
  CardTitle,
  ProductPrice,
  BidsStatus,
  ProductCard,
  ProductList,
  ProductCardHeader,
  ProductDescriptionBottom,
  ProductDescription,
  CountDownContainer,
  CountDown,
  ProductCardHeaderButton,
  ProductCardHeaderOwners
} from "./StyledComponents/liveAuctions-styledComponents";
import { SectionHeading } from "./StyledComponents/globalStyledComponents";
const breakPoints = [
  { width: 1, itemsToShow: 1 },
  { width: 550, itemsToShow: 2, itemsToScroll: 2 },
  { width: 768, itemsToShow: 3, itemsToScroll: 3 },
  { width: 1024, itemsToShow: 4, itemsToScroll: 4 },
  { width: 1200, itemsToShow: 5, itemsToScroll: 5 },
];
function LiveAuctions(props) {
  const [items, setItems] = useState(props.data)

  useEffect(()=> {
    setItems(props.data)
  })
  return (
    <>
      <div>
        <div className="pl-3">
          <SectionHeading>{CONSTANTS.liveAuctions}</SectionHeading>
        </div>

        <Carousel
          breakPoints={breakPoints}
          pagination={false}
          transitionMs={1000}
        >
          {items != undefined ? items.map((product) => 
            Product(product)
          ) : ""}
        </Carousel>
      </div>
    </>
  );
}

function Product(product) {
  const pr = getAuctionPriceDetails(product);
  const price = pr.priceBase;
  const menu = (
    <Menu>
      <Menu.Item key="1">
        <span>{CONSTANTS.purchaseNow}</span>
      </Menu.Item>
      <Menu.Item key="2">
        <span>{CONSTANTS.placeBid}</span>
      </Menu.Item>
      <Menu.Item key="3">
        <span>{CONSTANTS.viewOnOpenSea}</span>
      </Menu.Item>
      <Menu.Item key="4">
        <span>{CONSTANTS.share}</span>
      </Menu.Item>
    </Menu>
  );
  return (
    <ProductCard className={`p-2 p-lg-1 mr-3`}>   
      <ProductCardHeader className={`mt-3`}>
        <ProductCardHeaderOwners>
          <Avatar.Group>
              <Tooltip title={"Owner"} placement="top">
                <Avatar key={product.asset?.owner.address} icon={<img src={product.asset?.owner.profile_img_url} width={22} />} />
              </Tooltip>
              <Tooltip title={"Maker"} placement="top">
                <Avatar key={product?.makerAccount.address} icon={<img src={product?.makerAccount.profile_img_url} width={22} />} />
              </Tooltip>
          </Avatar.Group>
        </ProductCardHeaderOwners>
        <ProductCardHeaderButton>
        <Dropdown trigger={["click"]} overlay={menu} placement="bottomRight">
          <Button>...</Button>
        </Dropdown>
        </ProductCardHeaderButton>
      </ProductCardHeader>
      <div className={`col-md-12 p-3`}>
      <a href={`/product-details?ta=${product.asset?.tokenAddress}&ti=${product.asset?.tokenId}`}>
        <img src={product.asset?.imageUrl} style={{height: "250px", width: "auto"}} className="w-100 rounded" />
        </a>
      </div>
      <ProductDescription>
        <CountDownContainer>
          <CountDown>{"043h 34m 34s left"} 🔥</CountDown>
        </CountDownContainer>
        <a href={`/product-details`}>
          <CardTitle>{product.asset?.name}</CardTitle>
        </a>
        {/* <BidsStatus>{CONSTANTS.bidsStatus}</BidsStatus> */}
        <ProductDescriptionBottom>
          <ProductPrice>{price+" eth"}</ProductPrice>
          {/* <ProductList>
            {" " + "1" + " of " + "2"}
          </ProductList> */}
        </ProductDescriptionBottom>
      </ProductDescription>
    </ProductCard>
  );
}
export default LiveAuctions;
