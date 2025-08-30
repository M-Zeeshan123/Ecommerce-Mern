import { Favorite, FavoriteBorder, SearchOutlined, ShoppingCartOutlined } from '@mui/icons-material'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import styled from 'styled-components'
import { addWishList, removeFromWishList } from '../redux/wishListRedux';
import { useDispatch, useSelector } from 'react-redux';

const Info = styled.div`
    opacity: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgb(0, 0, 0,0.2);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    z-index: 3;
    transition: all 0.50s ease;
    cursor: pointer;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    margin: 15px;
    min-width: 280px;
    background-color: white;
    position: relative;
    max-width: 400px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }

    &:hover ${Info} {
        opacity: 1;
    }
`;
const Image = styled.img`
    object-fit: contain;
    width: 100%;
    height: 350px;
    z-index: 2;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
`

const ProductDetails = styled.div`
    padding: 15px;
    background-color: white;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
`;

const Title = styled.h3`
    font-size: 16px;
    margin: 0 0 8px 0;
    color: #2c2c2c;
    font-weight: 500;
`;

const Price = styled.div`
    font-size: 18px;
    font-weight: 600;
    color: #2c2c2c;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 4px;

    &::before {
        content: "Rs";
        color: #666;
    }
`;

const Details = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 8px;
`;

const Colors = styled.div`
    display: flex;
    gap: 5px;
`;

const ColorDot = styled.div`
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background-color: ${props => props.color};
    border: 1px solid #ddd;
`;

const Sizes = styled.div`
    font-size: 14px;
    color: #666;
`;

const StockBadge = styled.span`
    font-size: 12px;
    padding: 3px 8px;
    border-radius: 12px;
    background-color: ${props => props.inStock ? '#e8f5e9' : '#ffebee'};
    color: ${props => props.inStock ? '#2e7d32' : '#c62828'};
    font-weight: 500;
    margin-left: 8px;
`

const Icon = styled.div`
    display: flex;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: white;
    margin: 10px;
    align-items: center;
    justify-content: center;
    transition: all 0.5s ease;
    &:hover {
        background-color: aliceblue;
        transform: scale(1.3);
    }
`;

const Product = ({item}) => {
    const dispatch = useDispatch();
    const wishlist = useSelector(state => state?.wishList?.products || []);
    const [isInWishlist, setIsInWishlist] = useState(false);

    useEffect(() => {
        setIsInWishlist(wishlist.some(product => product._id === item._id));
    }, [wishlist, item._id]);

    const handleWish = () => {
        if (isInWishlist) {
            dispatch(removeFromWishList(item._id));
        } else {
            dispatch(addWishList(item));
        }
    };

    return (
        <Container>
            <div style={{ position: 'relative' }}>
                <Image src={item.img} />
                <Info>
                    <Link to="/cart">
                        <Icon>
                            <ShoppingCartOutlined/>
                        </Icon>
                    </Link>
                    <Link to={`/product/${item._id}`} style={{color: "blue"}}>
                        <Icon>
                            <SearchOutlined style={{color: "green"}}/>
                        </Icon>
                    </Link>    
                    <Icon onClick={handleWish}>
                        {isInWishlist ? (
                            <Favorite style={{color: "red"}}/>
                        ) : (
                            <FavoriteBorder style={{color: "red"}}/>
                        )}
                    </Icon>
                </Info>
            </div>
            <ProductDetails>
                <Title>{item.title}</Title>
                <Price>{item.price}</Price>
                <Details>
                    <Colors>
                        {Array.isArray(item.color) && item.color.map((color, index) => (
                            <ColorDot key={index} color={color} />
                        ))}
                    </Colors>
                    <Sizes>
                        {Array.isArray(item.size) && item.size.join(", ")}
                    </Sizes>
                </Details>
                <Details>
                    <div style={{ fontSize: '14px', color: '#666' }}>
                        {Array.isArray(item.categories) && item.categories[0]}
                    </div>
                    <StockBadge inStock={item.inStock}>
                        {item.inStock ? 'In Stock' : 'Out of Stock'}
                    </StockBadge>
                </Details>
            </ProductDetails>
        </Container>
    )
}

export default Product