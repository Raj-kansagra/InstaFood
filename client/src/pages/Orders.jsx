import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getOrders } from "../api";

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
  background: ${({ theme }) => theme.bg || "#f0f0f0"};
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
`;

const Title = styled.div`
  font-size: 28px;
  font-weight: 500;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const Thead = styled.thead`
  background-color: #f5f5f5;
`;

const Th = styled.th`
  padding: 12px;
  border: 1px solid #ddd;
  text-align: left;
  font-weight: bold;
  @media (max-width: 768px) {
    padding: 8px;
  }
`;

const Tbody = styled.tbody`
  & > tr:nth-child(even) {
    background-color: #f9f9f9;
  }
`;

const Tr = styled.tr`
  &:hover {
    background-color: #f1f1f1;
  }
`;

const Td = styled.td`
  padding: 12px;
  border: 1px solid #ddd;

  ${({ overflow }) =>
    overflow &&`
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `}

  @media (max-width: 768px) {
    padding: 8px;
    max-width: 100px;
    font-size: 12px;
  }
`;


const Orders = ({setOpenAuth}) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("app-token");
        if(!token){
          setOpenAuth(true);
          return;
        }
        const response = await getOrders(token); // Update the URL to your API endpoint
        setOrders(response.data);
      }finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div>Loading...</div>;
  return (
    <Container>
      <Section>
        {orders.length === 0 ? (
          <Title>No Orders</Title>
        ) : (
          <>
          <Title>Your Orders</Title>
          <Table>
            <Thead>
              <Tr>
                <Th>Order Id</Th>
                <Th>Total</Th>
                <Th>Date</Th>
                <Th>Time</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {orders.map(order => (
                <Tr key={order._id}>
                  <Td overflow>{order._id}</Td>
                  <Td>${order.total_amount}</Td>
                  <Td>{new Date(order.createdAt).toLocaleDateString()}</Td>
                  <Td>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Td>
                  <Td>{order.status}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          </>
        )}
      </Section>
    </Container>
  );
};

export default Orders;
