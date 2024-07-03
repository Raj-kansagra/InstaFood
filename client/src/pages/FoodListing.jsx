import React, { useEffect, useState } from "react";
import styled from "styled-components";
import ProductCard from "../components/cards/ProductsCard";
import { filter } from "../utils/data";
import { CircularProgress } from "@mui/material";
import { getAllProducts } from "../api";
import Button from "../components/Button";

const StyledInput = styled.input`
  width: 100%;
  padding: 8px;
  margin: 8px 0;
  box-sizing: border-box;
  border: 1px solid ${({ theme }) => theme.text_secondary + 50};
  border-radius: 8px;
  font-size: 16px;
  color: ${({ theme }) => theme.text_secondary};
  background-color: ${({ theme }) => theme.bg_secondary};

  &:focus {
    border-color: ${({ theme }) => theme.text_primary};
    outline: none;
  }

  &::placeholder {
    color: ${({ theme }) => theme.text_secondary + 70};
  }
`;
const Container = styled.div`
  padding: 0px 30px;
  height: 100%;
  display: flex;
  align-items: top;
  flex-direction: row;
  gap: 30px;
  @media (max-width: 700px) {
    flex-direction: column;
    padding: 20px 12px;
    align-items: center ;
  }
  background: ${({ theme }) => theme.bg};
`;

const Filters = styled.div`
  top margin: 0px;
  padding: 20px 16px;
  flex: 1;
  width: 100%;
  max-width: 300px;
  @media (max-width: 700px) {
  }
`;

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Products = styled.div`
  flex: 1;
  padding: 20px 50px;
  overflow-y: auto; /* Allow scrolling for the Products component */
  height: calc(100vh - 120px); /* Adjust height to allow scrolling within available viewport height */
`;

const CardWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  justify-content: left;
  @media (max-width: 760px) {
    gap: 16px;
    justify-content: center;
  }
`;

const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 12px;
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 500;
`;

const Item = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Selectableitem = styled.div`
  cursor: pointer;
  display: flex;
  border: 1px solid ${({ theme }) => theme.text_secondary + 50};
  color: ${({ theme }) => theme.text_secondary + 90};
  border-radius: 8px;
  padding: 2px 8px;
  font-size: 16px;
  width: fit-content;
  ${({ selected, theme }) =>
    selected &&
    `
  border: 1px solid ${theme.text_primary};
  color: ${theme.text_primary};
  background: ${theme.text_primary + 30};
  font-weight: 500;
  `}
`;

const FoodListing = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]); // Default price range
  const [selectedCategories, setSelectedCategories] = useState([]); // Default selected categories
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);

  const getFilteredProductsData = async () => {
    setLoading(true);
    // Call the API function for filtered products
    await getAllProducts(
      selectedCategories.length > 0
        ? `minPrice=${priceRange[0]}&maxPrice=${
            priceRange[1]
          }&categories=${selectedCategories.join(",")}`
        : `minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}`
    ).then((res) => {
      setProducts(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    getFilteredProductsData();
  }, [priceRange, selectedCategories]);

  const handleSavePriceRange = () => {
    setPriceRange([minPrice, maxPrice]);
  };

  const handleMax = (e) => {
    const value = e.target.value;
    const parsedValue = value ? parseInt(value, 10) : '';
    const formattedValue = isNaN(parsedValue) || parsedValue < 0 ? 0 : parsedValue;
    setMaxPrice(formattedValue);
  };

  const handleMin = (e) => {
    const value = e.target.value;
    const parsedValue = value ? parseInt(value, 10) : '';
    const formattedValue = isNaN(parsedValue) || parsedValue < 0 ? 0 : parsedValue;
    setMinPrice(formattedValue);
  };

  return (
    <Container>
      <Filters>
        <Menu>
          {filter.map((filters) => (
            <FilterSection key={filters.name}>
              <Title>{filters.name}</Title>
              {filters.value === "price" ? (
                <>
                  <div>
                    <label>Min Price: </label>
                    <StyledInput
                      type="number"
                      value={minPrice}
                      onChange={handleMin}
                    />
                  </div>
                  <div>
                    <label>Max Price: </label>
                    <StyledInput
                      type="number"
                      value={maxPrice}
                      onChange={handleMax}
                    />
                  </div>
                  <Button text="Save" small  onClick={handleSavePriceRange}/>
                </>
              ) : filters.value === "category" ? (
                <Item>
                  {filters.items.map((item) => (
                    <Selectableitem
                      key={item}
                      selected={selectedCategories.includes(item)}
                      onClick={() =>
                        setSelectedCategories((prevCategories) =>
                          prevCategories.includes(item)
                            ? prevCategories.filter(
                                (category) => category !== item
                              )
                            : [...prevCategories, item]
                        )
                      }
                    >
                      {item}
                    </Selectableitem>
                  ))}
                </Item>
              ) : null}
            </FilterSection>
          ))}
        </Menu>
      </Filters>
      <Products>
        <CardWrapper>
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </>
          )}
        </CardWrapper>
      </Products>
    </Container>
  );
};

export default FoodListing;
