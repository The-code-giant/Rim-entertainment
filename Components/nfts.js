import { Menu, Dropdown, Avatar, Tooltip } from "antd";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  Button,
  CardTitle,
  ProductPrice,
  ProductCard,
  ProductList,
  ProductCardHeader,
  ProductDescription,
  CardsContainer,
  ProductCardContainer,
} from "./StyledComponents/liveAuctions-styledComponents";

function Products(props) {
  console.log("probs: ", props.data);
  const menu = (
    <Menu>
      <Menu.Item key="1">Purchase now</Menu.Item>
      <Menu.Item key="2">Place a bid</Menu.Item>
      <Menu.Item key="3">View on OpenSea</Menu.Item>
      <Menu.Item key="3">Share</Menu.Item>
    </Menu>
  );

  return (
    <>
      <CardsContainer>
        {props.data &&
          props.data.assets.map((n, index) =>
            n.name != null ? (
              <ProductCardContainer key={index} className={"p-1"}>
                <ProductCard
                  // style={{ width: "280px" }}
                  className="p-3 p-sm-2 p-md-2 p-lg-3"
                >
                  <ProductCardHeader className={`mt-1`}>
                    <div className={"pl-3 float-left"}>
                      <Avatar.Group>
                        <Tooltip title={"Owner"} placement="top">
                          <Avatar
                            icon={
                              <img
                                src={
                                  props.data.talent
                                    ? props.data.talent.talentAvatar.url
                                    : props.data.talentAvatar.url
                                }
                                width={12}
                                height={12}
                              />
                            }
                          />
                        </Tooltip>
                      </Avatar.Group>
                    </div>
                    <Dropdown
                      trigger={["click"]}
                      overlay={menu}
                      placement="bottomRight"
                    >
                      <Button>...</Button>
                    </Dropdown>
                  </ProductCardHeader>
                  <div className={`col-md-12 p-1`}>
                    <Link
                      href={{
                        pathname: "/product-details",
                        query: {
                          explore: JSON.stringify(n),
                        },
                      }}
                    >
                      <a>
                        {" "}
                        <img
                          style={{ height: "250px", width: "auto" }}
                          src={n.imageUrl}
                          className="w-100 img-fluid"
                        />
                      </a>
                    </Link>
                  </div>
                  <ProductDescription>
                    {/* <Link
                      href={`/product-details?ta=${n?.asset_contract.address}&ti=${n?.token_id}`}
                    > */}
                    <Link
                      href={{
                        pathname: "/product-details",
                        query: {
                          explore: JSON.stringify(n),
                        },
                      }}
                    >
                      <a>
                        <CardTitle>{n?.name}</CardTitle>
                      </a>
                    </Link>
                    <ProductPrice>{n.price}</ProductPrice>
                    <ProductList>
                      {/* {" " + n.currentQTY + " of " + n.totalQTY} */}
                    </ProductList>
                    <br />
                    {/* <ProductPrice fontSize={"12px"}>{n.price}</ProductPrice> */}
                  </ProductDescription>
                </ProductCard>
              </ProductCardContainer>
            ) : (
              ""
            )
          )}
      </CardsContainer>
    </>
  );
}

export default Products;
