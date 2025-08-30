import React from 'react'
import Navbar from '../components/Navbar'
import styled from 'styled-components'
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import { useSelector } from 'react-redux';
import Product from '../components/Product';

const Container = styled.div``;
const Title = styled.h2`
   font-size: 30px;
   font-weight: 500;
   margin-left: 50px;
   margin-top: 50px;
`;

const ProductList = styled.div`
    padding: 20px;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
`;

const EmptyMessage = styled.div`
    text-align: center;
    padding: 20px;
    font-size: 20px;
    color: #666;
`;

const WishList = () => {
    const wishlist = useSelector(state => state?.wishList?.products || []);
    
    return (
        <Container>
            <Navbar/>
            <Title>YOUR WISHLIST</Title>
            {wishlist && wishlist.length > 0 ? (
                <ProductList>
                    {wishlist.map((item) => (
                        <Product item={item} key={item._id} />
                    ))}
                </ProductList>
            ) : (
                <EmptyMessage>
                    Your wishlist is empty
                </EmptyMessage>
            )}
            <Newsletter/>
            <Footer/>
        </Container>
    )
}

export default WishList