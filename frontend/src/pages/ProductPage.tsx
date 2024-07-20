import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  useTheme
} from '@mui/material';
import { styled } from '@mui/system';
import { ProductType } from 'common-types';
import ProductsService from '@/services/ProductsService';
import NotFoundPage from './NotFoundPage';
import { useCart } from '@/components/contexts/CartContext';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

// Styles for the image container
const ImageContainer = styled('div')(({ theme }) => ({
  height: 460,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[300],
  marginBottom: theme.spacing(2),
  overflow: 'hidden',
  position: 'relative', // to position the animated image over it
}));

// Styles for the color button to be circular
const ColorButton = styled(Button)(({ theme }) => ({
  width: 24,
  height: 24,
  minWidth: 24,
  borderRadius: '50%',
  marginRight: theme.spacing(1),
  padding: 0,
}));

// Styles for the size button
const SizeButton = styled(Button)(({ theme }) => ({
  marginRight: theme.spacing(1),
  fontWeight: 'bold',
}));

const ProductPage: React.FC = () => {
  const theme = useTheme();
  const { productId } = useParams<{ productId: string }>();
  const [notFound, setNotFound] = useState<boolean>(false);
  const [product, setProduct] = useState<ProductType | null>(null);
  const { addItem } = useCart();

  useEffect(() => {
    getProduct();
  }, [productId]);

  const getProduct = async (): Promise<ProductType | null> => {
    let prod_id: number = 0;
    if(productId)
    { 
      prod_id = parseFloat(productId);
      if(isNaN(prod_id)){
        setNotFound(true);
        return null;
      }
    }
    else {
      setNotFound(true);
      return null;
    }

    try {
      const result = await ProductsService.getProduct(prod_id);
      
      let prod = result.data;
      setProduct(prod);
      return prod;
    } catch (error) {
      console.error("Failed to fetch product", error);
      setNotFound(true);
      return null;
    }
  }

  const handleAddToCart = () => {
    if (product) {
      addItem(product, 1);
    }
  }

  if(notFound) 
    return <NotFoundPage/>

  return (
    <Box
      sx={{
        bgcolor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100],
        py: 8,
        position: 'relative', // ensure relative positioning for the whole container
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <ImageContainer>
              <img
                src={product?.imageUrl}
                alt={product?.name}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </ImageContainer>
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ py: 2, fontWeight: 'bold', position: 'relative' }}
                  onClick={handleAddToCart}
                  startIcon={<ShoppingCartIcon />}
                >
                  Add to Cart
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{ py: 2, fontWeight: 'bold' }}
                  startIcon={<FavoriteBorderIcon />}
                >
                  Add to Wishlist
                </Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom>
              {product?.name}
            </Typography>
            <Typography variant="body2" color="textSecondary" paragraph>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sed ante justo. Integer euismod libero id mauris malesuada tincidunt.
            </Typography>
            <Box display="flex" mb={2}>
              <Box mr={4}>
                <Typography variant="body1" fontWeight="bold">
                  Price:
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {product?.price} €
                </Typography>
              </Box>
              <Box>
                <Typography variant="body1" fontWeight="bold">
                  Availability:
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  In Stock
                </Typography>
              </Box>
            </Box>
            <Box mb={2}>
              <Typography variant="body1" fontWeight="bold">
                Select Color:
              </Typography>
              <Box display="flex" mt={1}>
                <ColorButton style={{ backgroundColor: theme.palette.grey[800] }} />
                <ColorButton style={{ backgroundColor: theme.palette.error.main }} />
                <ColorButton style={{ backgroundColor: theme.palette.info.main }} />
                <ColorButton style={{ backgroundColor: theme.palette.warning.main }} />
              </Box>
            </Box>
            <Box mb={2}>
              <Typography variant="body1" fontWeight="bold">
                Select Size:
              </Typography>
              <Box display="flex" mt={1}>
                <SizeButton variant="outlined">S</SizeButton>
                <SizeButton variant="outlined">M</SizeButton>
                <SizeButton variant="outlined">L</SizeButton>
                <SizeButton variant="outlined">XL</SizeButton>
                <SizeButton variant="outlined">XXL</SizeButton>
              </Box>
            </Box>
            <Box>
              <Typography variant="body1" fontWeight="bold">
                Product Description:
              </Typography>
              <Typography variant="body2" color="textSecondary" mt={1}>
                {product?.description}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ProductPage;
