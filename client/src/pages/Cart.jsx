import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import Navbar from '../components/Navbar';
import Announcement from '../components/Announcement';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import { Add, Remove } from '@mui/icons-material';
import { mobile } from "../responsive";
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, removeProduct } from '../redux/cartRedux';
import StripeCheckout from 'react-stripe-checkout';
import { userRequest } from '../requestMethods';
import { Link, useHistory } from 'react-router-dom';

const KEY = process.env.REACT_APP_STRIPE;

const Container = styled.div``;
const Wrapper = styled.div`
    padding: 20px;
    ${mobile({ padding: "10px" })}
`;
const Title = styled.h1`
    font-weight: 300;
    text-align: center;
`;
const Top = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
`;
const TopButton = styled.button`
    padding: 10px;
    font-weight: 600;
    cursor: pointer;
    border: ${(props)=>props.type==="filled" && "none"};
    background-color : ${props=>props.type==="filled" ? "black" :"transparent"};
    color : ${(props)=>props.type=== "filled" && "white"};

`;
const TopTexts = styled.div`
     ${mobile({ display: "none" })}
`;

const TopText = styled.span`
    text-decoration: underline;
    color: black;
    font-weight: 400;
    cursor: pointer;
    margin: 0px 10px;
`;

const Bottom = styled.div`
    display: flex;
    justify-content: space-between;
    margin-left: 18px;
    ${mobile({ flexDirection: "column" })}
`;  
const Info = styled.div`
    flex: 3;
`;

const Product = styled.div`
    display: flex;
    margin-bottom: 10px;
    justify-content: space-between;
    ${mobile({ flexDirection: "column" })}
`;
const ProductDetail = styled.div`
    display: flex;
    flex: 2;
`;
const Image = styled.img`
    width: 200px;
    `;
const Details = styled.div`
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
`;
const ProductName = styled.span``;
const ProductId = styled.span`
    left: 0;
`;
const ProductColor = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: ${props=>props.color};

`;
const ProductSize = styled.span``;
const PriceDetail = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;
const ProductAmountContainer = styled.div`
    display: flex;
    align-items: center;
`;
const ProductAmount = styled.div`
    font-size: 24px;
    margin: 5px;
    ${mobile({ margin: "5px 15px" })}
`;
const ProductPrice = styled.div`
    font-size: 30px;
    font-weight: 200;
    ${mobile({ marginBottom: "20px" })}
`;
const Hr = styled.hr`
    background-color: #eee;
    height: 1px;
    border: none;
    margin-right: 20px;
`;
const Summary = styled.div`
    flex: 1;
    border: 0.5px solid #555;
    border-radius: 10px;
    padding: 20px;
    height: 50vh;
`;
const SummaryTitle = styled.h1`
    font-weight: 200;
    
`;
const SummaryItem = styled.div`
    margin: 30px 0px;
    display: flex;
    justify-content: space-between;
    font-weight: ${props=>props.type==="total" && "500"};
    font-size: ${(props) => props.type === "total" && "24px"};
`;
const SummaryItemText = styled.span``;

const SummaryItemPrice = styled.span``;

const Button = styled.button`
    width: 100%;
    padding: 10px;
    background-color: black;
    color: white;
    font-weight: 600;
    border-radius: 2px;
    cursor: pointer;
`;



const Cart = () => {
    const [stripeToken, setStripeToken] = useState(null);
    const cart = useSelector(state=>state.cart);
    const dispatch = useDispatch();
    const history = useHistory();

    const handleQuantityChange = (product, change) => {
        if (change === "inc") {
            dispatch(addProduct({ ...product, quantity: 1 }));
        } else if (change === "dec") {
            if (product.quantity > 1) {
                dispatch(addProduct({ ...product, quantity: -1 }));
            } else {
                dispatch(removeProduct(product));
            }
        }
    };
    const onToken = async (token) => {
        try {
            const res = await userRequest.post("/checkout/payment", {
                tokenId: token.id,
                amount: cart.total * 100,
                currency: "usd",
                description: `Order total: $${cart.total}`
            });
            
            if (res.data && res.data.id) {
                alert("✅ Payment Successful!");
                history.push("/success");
            }
        } catch (err) {
            console.error("Payment Error:", err);
            alert("❌ Payment failed. Please try again.");
        }
    };

    
  return (
    <Container>
        <Navbar/>
        <Announcement/>
            <Wrapper>
               <Title>YOUR BAG</Title> 
               <Top>
                <Link to="/products">
                <TopButton>CONTINUE SHOPPING</TopButton>
                </Link>
                <TopTexts>
                    <TopText>Shopping Bag ({cart.quantity}) </TopText>
                    <Link to="/wishlist">
                    <TopText>Your Wishlist</TopText>
                    </Link>
                </TopTexts>
                <StripeCheckout
                    name="Laf1ame store"
                    image="https://i.ibb.co/ZKw0764/Cute-Cat-1.jpg"
                    billingAddress
                    shippingAddress
                    description={`Your total is Rs. ${cart.total}`}
                    amount={cart.total*100}
                    token={onToken}
                    stripeKey={KEY} 
                    >
                    <TopButton type="filled" >CHECKOUT</TopButton>
                    </StripeCheckout>
               </Top>
               <Bottom>
                <Info>
                    {cart.products && cart.products.length > 0 ? (
                        cart.products.filter(product => product !== null).map((product, index) => (
                            <React.Fragment key={`${product?._id || index}-${index}`}>
                                {product && (
                                    <>
                                        <Product>
                                            <ProductDetail>
                                                <Image 
                                                    src={product.img || "https://via.placeholder.com/200"} 
                                                    onError={(e) => {
                                                        e.target.src = "https://via.placeholder.com/200";
                                                    }}
                                                />
                                                <Details>
                                                    <ProductName><b>Product: </b>{product.title || "Unknown Product"}</ProductName>
                                                    <ProductId><b>Id: </b>{product._id || "N/A"}</ProductId>
                                                    <ProductColor color={product.color || "#000000"}></ProductColor>
                                                    <ProductSize><b>Size: </b>{product.size || "N/A"}</ProductSize>
                                                </Details>
                                            </ProductDetail>
                                            <PriceDetail>
                                                <ProductAmountContainer>
                                                    <Add 
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => handleQuantityChange(product, "inc")}
                                                    />
                                                    <ProductAmount>{product.quantity || 1}</ProductAmount>
                                                    <Remove 
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => handleQuantityChange(product, "dec")}
                                                    />
                                                </ProductAmountContainer>
                                                <ProductPrice>
                                                    Rs {(product.price || 0) * (product.quantity || 1)}
                                                </ProductPrice>
                                            </PriceDetail>
                                        </Product>
                                        <Hr/>
                                    </>
                                )}
                            </React.Fragment>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '20px' }}>
                            Your cart is empty
                        </div>
                    )}
                </Info>
                <Summary>
                    <SummaryTitle>ORDER SUMMARY</SummaryTitle>
                    <SummaryItem>
                        <SummaryItemText>Subtotal :</SummaryItemText>
                        <SummaryItemPrice>Rs {cart.total}</SummaryItemPrice>
                    </SummaryItem>
                    <SummaryItem>
                        <SummaryItemText>Estimated Shipping :</SummaryItemText>
                        <SummaryItemPrice>Rs 90</SummaryItemPrice>
                    </SummaryItem>
                    <SummaryItem>
                        <SummaryItemText>Shipping Discount :</SummaryItemText>
                        <SummaryItemPrice>-Rs 90</SummaryItemPrice>
                    </SummaryItem>
                    
                    <SummaryItem  type="total">
                        <SummaryItemText> Total</SummaryItemText>
                        <SummaryItemPrice>Rs {cart.total}</SummaryItemPrice>
                    </SummaryItem>
                    <StripeCheckout
                    name="Laf1ame store"
                    image="https://i.ibb.co/ZKw0764/Cute-Cat-1.jpg"
                    billingAddress
                    shippingAddress
                    description={`Your total is Rs. ${cart.total}`}
                    amount={cart.total*100}
                    token={onToken}
                    currency="INR"
                    locale="en"
                    email=""
                    allowRememberMe={true}
                    stripeKey={KEY}
                    >
                    <Button>CHECKOUT NOW</Button>
                    </StripeCheckout>
                </Summary>
               </Bottom>
            </Wrapper>
        <Newsletter/>
        <Footer/>
    </Container>
  )
}

export default Cart