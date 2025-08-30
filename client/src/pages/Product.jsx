import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Navbar from '../components/Navbar';
import Announcement from '../components/Announcement';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import { Add, Remove } from '@mui/icons-material';
import { mobile } from "../responsive";
import { useLocation } from 'react-router-dom';
import { publicRequest } from '../requestMethods';
import { addProduct } from '../redux/cartRedux';
import { useDispatch } from 'react-redux';


const Container = styled.div`

`;

const Wrapper = styled.div`
    padding: 50px;
    display: flex;
    ${mobile({ padding: "10px", flexDirection: "column" })}
`;
const ImgContainer = styled.div`
    flex: 1;
`;
const Image = styled.img`
    width: 100%;
    height: 70vh;
    object-fit: contain;
    ${mobile({ height: "40vh" })}
`;
const InfoContainer = styled.div`
     flex: 1;
     padding: 0px 50px;
     ${mobile({ padding: "10px" })}
`;
const Title = styled.h1`
    font-weight: 600;
    margin-bottom: 20px;
`;
const Desc = styled.p`
    margin: 20px 0px;
    line-height: 1.6;
    color: #666;
`;
const Price = styled.div`
    font-weight: 600;
    font-size: 32px;
    color: #2c2c2c;
    padding: 15px 0;
    display: flex;
    align-items: center;
    gap: 5px;

    &::before {
        content: "Rs";
        font-size: 24px;
        color: #666;
    }
`;

const ProductFeatures = styled.div`
    margin: 30px 0;
    padding: 25px;
    background-color: #f8f9fa;
    border-radius: 12px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
`;

const FeatureList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 15px;
`;

const FeatureItem = styled.li`
    display: flex;
    align-items: center;
    font-size: 15px;
    color: #4a4a4a;
    padding: 8px 0;
    border-bottom: 1px solid #eee;

    strong {
        color: #2c2c2c;
        min-width: 120px;
        margin-right: 10px;
    }

    &:last-child {
        border-bottom: none;
    }
`;

const Badge = styled.span`
    display: inline-block;
    padding: 4px 8px;
    margin: 5px;
    border-radius: 4px;
    background-color: ${props => props.type === 'inStock' ? '#e8f5e9' : '#ffebee'};
    color: ${props => props.type === 'inStock' ? '#2e7d32' : '#c62828'};
    font-size: 14px;
    font-weight: 500;
`;
const FilterContainer = styled.div`
    width: 50%;
    display: flex;
    justify-content: space-between;
    margin: 30px 0px;
    ${mobile({ width: "100%" })}
`;
const Filter = styled.div`
    display: flex;
    align-items: center;
`;
const FilterTitle = styled.span`
    font-size: 20px;
    font-weight: 500;
    margin-right: 10px;
`;
const FilterColor = styled.div`
    cursor: pointer;
    width: 30px;
    height: 30px;
    border: 2px solid ${props => props.selected ? 'teal' : '#ddd'};
    border-radius: 50%;
    margin-right: 8px;
    background-color: ${props => props.color};
    transition: transform 0.2s, border-color 0.2s;

    &:hover {
        transform: scale(1.1);
        border-color: teal;
    }
`;
const FilterSize = styled.select`
    cursor: pointer;
    margin-left: 10px;
    padding: 5px;
`;
const FilterSizeOption = styled.option``;

const AddContainer = styled.div`
    display: flex;
    width: 50%;
    align-items: center;
    justify-content: space-between;
    ${mobile({ width: "100%" })}
`;
const AmountContainer = styled.div`
        display: flex;
        align-items: center;
        font-weight: 700;
        
`;
const Amount = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 30px;
    height: 30px;
    border: 2px solid teal;
    border-radius: 10px;
    margin: 0px 5px;
`;

const Button = styled.button`
    border: none;
    background-color: teal;
    border-radius: 8px;
    padding: 15px 30px;
    font-weight: 600;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
        background-color: #006d6d;
        transform: translateY(-2px);
    }
    
    &:active {
        transform: translateY(0);
    }
`;
const ShippingDetails = styled.div`
    margin-top: 50px;
`;
const ShippingTitle = styled.h3`
    font-weight: 600;
`;
const ShippingDesc = styled.span`
     font-weight: 300;
`;


const Product = () => {
    const location = useLocation();
    const id = location.pathname.split("/")[2];
    const [product, setProduct] = useState({});
    const [quantity, setQuantity] = useState(1);
    const [color, setColor] = useState("");
    const [size, setSize] = useState("");
    const dispatch = useDispatch();


    useEffect(() => {
        const getProduct = async () => {

            try {
                const res = await publicRequest.get("/products/find/" + id)
                setProduct(res.data);
            } catch (err) {
                console.log(err);
            }
        }
        getProduct();
    }, [id]);

    const handleQuantity = (type) => {
        if (type === "dec") {
            quantity > 1 && setQuantity(quantity - 1);
        }
        else {
            setQuantity(quantity + 1);
        }
    }

    const handleClick = () => {

        dispatch(addProduct({ ...product, quantity, color, size }));
    }
    return (
        <Container>
            <Navbar />
            <Announcement />
            <Wrapper>
                <ImgContainer>
                    <Image src={product.img} />
                </ImgContainer>
                <InfoContainer>
                    <Title>{product.title}</Title>
                    <Badge type={product.inStock ? 'inStock' : 'outOfStock'}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                    <Price>{product.price}</Price>
                    <Desc>{product.desc}</Desc>
                    
                    <ProductFeatures>
                        <FeatureList>
                            {product.categories?.length > 0 && (
                                <FeatureItem>
                                    <strong>Category: </strong>
                                    {product.categories.join(", ")}
                                </FeatureItem>
                            )}
                            <FeatureItem>
                                <strong>Product ID: </strong>
                                {product._id}
                            </FeatureItem>
                            {product.size?.length > 0 && (
                                <FeatureItem>
                                    <strong>Available Sizes: </strong>
                                    {product.size.join(", ")}
                                </FeatureItem>
                            )}
                            {product.color?.length > 0 && (
                                <FeatureItem>
                                    <strong>Available Colors: </strong>
                                    {product.color.join(", ")}
                                </FeatureItem>
                            )}
                        </FeatureList>
                    </ProductFeatures>

                    <FilterContainer>
                        <Filter>
                            <FilterTitle>Color</FilterTitle>
                            {product.color?.map((c) => (
                                <FilterColor 
                                    color={c} 
                                    key={c} 
                                    onClick={() => setColor(c)}
                                    selected={color === c}
                                />
                            ))}
                        </Filter>
                        <Filter>
                            <FilterTitle>Size</FilterTitle>
                            <FilterSize onChange={(e) => setSize(e.target.value)}>
                                {product.size?.map((s) => (
                                    <FilterSizeOption key={s} >{s}</FilterSizeOption>
                                ))}
                            </FilterSize>
                        </Filter>
                    </FilterContainer>
                    <AddContainer>
                        <AmountContainer>
                            <Remove onClick={() => handleQuantity("dec")} />
                            <Amount>{quantity}</Amount>
                            <Add onClick={() => handleQuantity("inc")} />
                        </AmountContainer>
                        <Button onClick={handleClick}>ADD TO CART</Button>
                    </AddContainer>
                        <ShippingDetails>
                            <ShippingTitle>Shipping and Returns</ShippingTitle>
                            <ShippingDesc>
                        Free standard delivery on all orders and free return for all 
                        qualifying orders within <b>14 days of your order delivery date.</b>
                         Visit our Return Policy for more information.<br/><br/><br/>
                        For any queries, please contact Customer Service at 080-35353535
                         or via customercareindia@laf1ame.com .
                            </ShippingDesc>
                        </ShippingDetails>
                </InfoContainer>
            </Wrapper>
            <Newsletter />
            <Footer />
        </Container>
    )
}

export default Product