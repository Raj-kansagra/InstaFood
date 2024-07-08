import { CircularProgress} from "@mui/material";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Button from "../components/Button";
import {
  FavoriteBorderOutlined,
  FavoriteRounded,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import {
  addToCart,
  addToFavourite,
  deleteFromFavourite,
  getFavourite,
  getProductDetails,
} from "../api";  
import { toast } from "react-toastify";

const Container = styled.div`
  padding: 100px 30px;
  height: 100%;
  overflow-y: scroll;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 30px;
  @media (max-width: 768px) {
    padding: 20px 16px;
  }
  background: ${({ theme }) => theme.bg};
`;

const Wrapper = styled.div`
  width: 100%;
  flex: 1;
  max-width: 1400px;
  display: flex;
  gap: 40px;
  justify-content: center;
  @media only screen and (max-width: 700px) {
    flex-direction: column;
    gap: 32px;
  }
`;

const ImagesWrapper = styled.div`
  flex: 0.7;
  display: flex;
  justify-content: center;
`;
const Image = styled.img`
  max-width: 500px;
  width: 100%;
  max-height: 400px;
  border-radius: 12px;
  object-fit: cover;
  @media (max-width: 768px) {
    max-width: 400px;
    height: 400px;
  }
`;

const Details = styled.div`
  width:40%;
  display: flex;
  gap: 18px;
  flex-direction: column;
  @media screen and (max-width: 700px) {
    width:100%;
  } 
`;
const Title = styled.div`
  font-size: 28px;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
`;
const Desc = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_primary};
`;
const Price = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 22px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
`;
const Span = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_secondary + 60};
  text-decoration: line-through;
  text-decoration-color: ${({ theme }) => theme.text_secondary + 50};
`;

const Percent = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: green;
`;

const Ingridents = styled.div`
  font-size: 16px;
  font-weight: 500;
  diaplay: flex;
  flex-direction: column;
  gap: 24px;
`;
const Items = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;
const Item = styled.div`
  background: ${({ theme }) => theme.primary + 20};
  color: ${({ theme }) => theme.primary};
  font-size: 14px;
  padding: 4px 12px;
  display: flex;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
`;

const ButtonWrapper = styled.div`
  display: flex;
  gap: 16px;
  width:80%;
  padding: 32px 0px;
  @media only screen and (max-width: 700px) {
    gap: 12px;
    width:100%;
    padding: 12px 0px;
  }
`;

const FoodDetails = ({setOpenAuth}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [favorite, setFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState();

  const getProduct = async () => {
    setLoading(true);
    await getProductDetails(id).then((res) => {
      setProduct(res.data);
      setLoading(false);
    });
  };

  const removeFavourite = async () => {
    const token = localStorage.getItem("app-token");
    if(!token){
      setOpenAuth(true);
      return;
    } 
    await deleteFromFavourite(token, { productId: id })
      .then((res) => {
        setFavorite(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addFavourite = async () => {
    const token = localStorage.getItem("app-token");
    if(!token){
      setOpenAuth(true);
      return;
    }
    await addToFavourite(token, { productId: id })
      .then((res) => {
        setFavorite(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const checkFavorite = async () => {
    const token = localStorage.getItem("app-token");
    await getFavourite(token, { productId: id })
      .then((res) => {
        const isFavorite = res.data?.some((favorite) => favorite._id === id);
        setFavorite(isFavorite);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getProduct();
    checkFavorite();
  }, []);

  const addorder = async () => {
    addCart();
    navigate("/cart");
  }
  const addCart = async () => {
    const token = localStorage.getItem("app-token");
    if(!token){
      setOpenAuth(true);
      return;
    } 
    await addToCart(token, { productId: id, quantity: 1 })
      .then(() => {
        toast.success("Added to Cart");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Container>
      {loading ? (
        <CircularProgress />
      ) : (
        <Wrapper>
          <ImagesWrapper>
            <Image src={product?.img} />
          </ImagesWrapper>
          <Details>
            <div>
              <Title>{product?.name}</Title>
            </div>
            <Price>
              ₹{product?.price?.org} <Span>₹{product?.price?.mrp}</Span>{" "}
              <Percent> (₹{product?.price?.off}% Off) </Percent>
            </Price>

            <Desc>{product?.desc}</Desc>

            <Ingridents>
              Ingridents
              <Items>
                {product?.ingredients.map((ingredient) => (
                  <Item>{ingredient}</Item>
                ))}
              </Items>
            </Ingridents>

            <ButtonWrapper>
              <Button
                text="Add to Cart"
                full
                small
                outlined
                onClick={() => addCart()}
              />
              <Button text="Order" small full onClick={() => addorder()}/>
              <Button
                leftIcon={
                  favorite ? (
                    <FavoriteRounded sx={{ fontSize: "22px", color: "red" }} />
                  ) : (
                    <FavoriteBorderOutlined sx={{ fontSize: "22px" }} />
                  )
                }
                full
                small
                outlined
                onClick={() => (favorite ? removeFavourite() : addFavourite())}
              />
            </ButtonWrapper>
          </Details>
        </Wrapper>
      )}
    </Container>
  );
};

export default FoodDetails;
