import React, { useEffect, useState } from "react";
import styled from "styled-components";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import { addToCart, deleteFromCart, getCart, placeOrder } from "../api";
import { CircularProgress } from "@mui/material";
import { DeleteOutline } from "@mui/icons-material";
import { toast } from "react-toastify";

const Container = styled.div`
  padding: 20px 30px;
  height: 100%;
  display: flex;
  overflow-y: scroll;
  align-items: center;
  flex-direction: column;
  gap: 30px;
  @media (max-width: 768px) {
    padding: 20px 12px;
  }
  background: ${({ theme }) => theme.bg};
`;
const Section = styled.div`
  width: 100%;
  max-width: 1400px;
  padding: 32px 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 22px;
  gap: 28px;
  @media (max-width: 750px) {
    font-size: 20px;
  }
`;
const Title = styled.div`
  font-size: 28px;
  font-weight: 500;
  display: flex;
  justify-content: ${({ center }) => (center ? "center" : "space-between")};
  align-items: center;
`;

const Wrapper = styled.div`
  display: flex;
  gap: 32px;
  width: 100%;
  padding: 12px;
  @media (max-width: 750px) {
    flex-direction: column;
  }
`;
const Left = styled.div`
  flex: 2;
  display: flex;
  overflow-x: hidden;
  flex-direction: column;
  gap: 12px;
  @media (max-width: 750px) {
    flex: 1;
  }
`;
const Table = styled.div`
  font-size: 16px;
  display: flex;
  align-items: center;
  gap: 30px;
  ${({ head }) => head && `margin-bottom: 22px`}
  @media (max-width: 750px) {
    font-size: 16px;
  }
`;
const TableItem = styled.div`
  ${({ flex }) => flex && `flex: 1;`}
  ${({ bold }) =>
    bold &&
    `font-weight: 600; 
  font-size: 18px;`}
  min-width:60px;
`;
const Counter = styled.div`
  display: flex;
  gap: 5px;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.text_secondary + 40};
  border-radius: 8px;
  padding: 4px 8px;
`;

const Product = styled.div`
  display: flex;
  gap: 15px;
`;
const Img = styled.img`
  min-height: 80px;
  max-height: 80px;
  min-width: 100px;
  max-width: 100px;
  @media (max-width: 575px) {
    display: none;
  }
  
`;
const Details = styled.div`
  max-width: 130px;
  @media (max-width: 700px) {
    max-width: 60px;
  }
`;
const Protitle = styled.div`
  color: ${({ theme }) => theme.primary};
  font-size: 16px;
  font-weight: 500;
`;
const ProDesc = styled.div`
  font-size: 14px;
  font-weight: 40 0;
  color: ${({ theme }) => theme.text_primary};
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  @media (max-width: 1100px) {
    display: none;
    text-overflow: ellipsis;
  }
`;


const Right = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  @media (max-width: 750px) {
    flex: 0.8;
  }
`;
const Subtotal = styled.div`
  font-size: 22px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
`;
const Delivery = styled.div`
  font-size: 18px;
  font-weight: 500;
  display: flex;
  gap: 6px;
  flex-direction: column;
`;

const Cart = ({setOpenAuth}) => {
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [products, setProducts] = useState([]);
  const [buttonLoad, setButtonLoad] = useState(false);
  const [deliveryDetails, setDeliveryDetails] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    phoneNumber: "",
    completeAddress: "",
  });

  const getProducts = async () => {
    setLoading(true);
    const token = localStorage.getItem("app-token");
    await getCart(token).then((res) => {
      setProducts(res.data);
      setLoading(false);
    });
  };

  const calculateSubtotal = () => {
    return products.reduce(
      (total, item) => total + item.quantity * item?.product?.price?.org,
      0
    );
  };
  const convertAddressToString = (addressObj) => {
    // Convert the address object to a string representation
    return `${addressObj.firstName} ${addressObj.lastName}, ${addressObj.completeAddress}, ${addressObj.phoneNumber}, ${addressObj.emailAddress}`;
  };

  const PlaceOrder = async () => {
    setButtonLoad(true);
    try {
      const isDeliveryDetailsFilled =
        deliveryDetails.firstName &&
        deliveryDetails.lastName &&
        deliveryDetails.completeAddress &&
        deliveryDetails.phoneNumber &&
        deliveryDetails.emailAddress;

      if (!isDeliveryDetailsFilled) {
        toast.error("Invalid Details");
        return;
      }

      const token = localStorage.getItem("app-token");
      if(!token){
      setOpenAuth(true);
      return;
    } 
      const totalAmount = calculateSubtotal().toFixed(2);
      const orderDetails = {
        products,
        address: convertAddressToString(deliveryDetails),
        totalAmount,
      };

      await placeOrder(token, orderDetails)
      .then(()=>{
        toast.success("Order placed");
      })
      setButtonLoad(false);
      // Clear the cart and update the UI
      setReload(!reload);
    } catch (err) {
      setButtonLoad(false);
    } finally{
      setButtonLoad(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, [reload]);

  const addCart = async (id) => {
    const token = localStorage.getItem("app-token");
    if(!token){
      setOpenAuth(true);
      return;
    } 
    await addToCart(token, { productId: id, quantity: 1 })
      .then((res) => {
        setReload(!reload);
      })
      .catch((err) => {
        console.log(err);
        setReload(!reload);
      });
  };

  const removeCart = async (id, quantity, type) => {
    const token = localStorage.getItem("app-token");
    if(!token){
      setOpenAuth(true);
      return;
    } 
    let qnt = quantity > 0 ? 1 : null;
    if (type === "full") qnt = null;
    await deleteFromCart(token, {
      productId: id,
      quantity: qnt,
    })
      .then((res) => {
        setReload(!reload);
      })
      .catch((err) => {
        setReload(!reload);
        console.log(err);
      });
  };
  return (
    <Container>
      <Section>
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            {products.length === 0 ? (
              <>Cart is empty</>
            ) : (
              <Wrapper>
                <Left>
                <Title>Your Shopping Cart</Title>
                  <Table>
                    <TableItem bold flex>
                      Product
                    </TableItem>
                    <TableItem bold>Price</TableItem>
                    <TableItem bold>Quantity</TableItem>
                    <TableItem bold>Subtotal</TableItem>
                    <TableItem></TableItem>
                  </Table>
                  {products.map((item) => (
                    <Table>
                      <TableItem flex>
                        <Product>
                          <Img src={item?.product?.img} />
                          <Details>
                            <Protitle>{item?.product?.name}</Protitle>
                            <ProDesc>{item?.product?.desc}</ProDesc>
                          </Details>
                        </Product>
                      </TableItem>
                      <TableItem>${item?.product?.price?.org}</TableItem>
                      <TableItem>
                        <Counter>
                          <div
                            style={{
                              cursor: "pointer",
                              flex: 1,
                            }}
                            onClick={() =>
                              removeCart(item?.product?._id, item?.quantity - 1)
                            }
                          >
                            -
                          </div>
                          {item?.quantity}{" "}
                          <div
                            style={{
                              cursor: "pointer",
                              flex: 1,
                            }}
                            onClick={() => addCart(item?.product?._id)}
                          >
                            +
                          </div>
                        </Counter>
                      </TableItem>
                      <TableItem>
                        {" "}
                        $
                        {(item.quantity * item?.product?.price?.org).toFixed(2)}
                      </TableItem>
                      <TableItem>
                        <DeleteOutline
                          sx={{ color: "red" ,cursor: "pointer"}}
                          onClick={() =>
                            removeCart(
                              item?.product?._id,
                              item?.quantity - 1,
                              "full"
                            )
                          }
                        />
                      </TableItem>
                    </Table>
                  ))}
                </Left>
                <Right>
                  <Subtotal>
                    Subtotal : ${calculateSubtotal().toFixed(2)}
                  </Subtotal>
                  <Delivery>
                    Delivery Details:
                    <div>
                      <div
                        style={{
                          display: "flex",
                          gap: "6px",
                        }}
                      >
                        <TextInput
                          small
                          placeholder="First Name"
                          value={deliveryDetails.firstName}
                          handelChange={(e) =>
                            setDeliveryDetails({
                              ...deliveryDetails,
                              firstName: e.target.value,
                            })
                          }
                        />
                        <TextInput
                          small
                          placeholder="Last Name"
                          value={deliveryDetails.lastName}
                          handelChange={(e) =>
                            setDeliveryDetails({
                              ...deliveryDetails,
                              lastName: e.target.value,
                            })
                          }
                        />
                      </div>
                      <TextInput
                        small
                        placeholder="Email Address"
                        value={deliveryDetails.emailAddress}
                        handelChange={(e) =>
                          setDeliveryDetails({
                            ...deliveryDetails,
                            emailAddress: e.target.value,
                          })
                        }
                      />
                      <TextInput
                        small
                        placeholder="Phone no. +91 XXXXX XXXXX"
                        value={deliveryDetails.phoneNumber}
                        handelChange={(e) =>
                          setDeliveryDetails({
                            ...deliveryDetails,
                            phoneNumber: e.target.value,
                          })
                        }
                      />
                      <TextInput
                        small
                        textArea
                        rows="5"
                        placeholder="Complete Address (Address, State, Country, Pincode)"
                        value={deliveryDetails.completeAddress}
                        handelChange={(e) =>
                          setDeliveryDetails({
                            ...deliveryDetails,
                            completeAddress: e.target.value,
                          })
                        }
                      />
                    </div>
                  </Delivery>
                  <Button
                    text="Place Order"
                    small
                    onClick={PlaceOrder}
                    isLoading={buttonLoad}
                    isDisabled={buttonLoad}
                  />
                </Right>
              </Wrapper>
            )}
          </>
        )}
      </Section>
    </Container>
  );
};

export default Cart;
