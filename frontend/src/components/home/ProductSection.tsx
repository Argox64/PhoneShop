import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, IconButton, Card, CardMedia, CardContent, Rating, Button, useMediaQuery, useTheme } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";
import { motion } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import { useNavigate } from 'react-router-dom';
import { ProductSort, ProductsSearchData, ProductType } from 'common-types';
import ProductsService from '@/services/ProductsService';
import StarBorderIcon from "@mui/icons-material/StarBorder";

interface ProductsSectionProps {
  itemPerPage: number;
  nbPagesPerLoad: number;
  category: string;
  sort: ProductSort;
}

const ProductsSection: React.FC<ProductsSectionProps> = (props) => {
  const { itemPerPage, nbPagesPerLoad, category, sort } = props;

  const [selectedPhonesIndex, setSelectedPhonesIndex] = useState<number>(0);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [totalProductsInSearch, setTotalProductsInSearch] = useState<number>(1000);

  const theme = useTheme();
  const isMdOrLess = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  //const isXs = useMediaQuery(theme.breakpoints.only('xs'));
  //const isMd = useMediaQuery(theme.breakpoints.only('md'));
  //const isLgOrMore = useMediaQuery(theme.breakpoints.up('lg'));

  useEffect(() => {
    addProducts(itemPerPage * nbPagesPerLoad - 1);
  }, []);

  const getProducts = async (limit: number, offset: number): Promise<ProductsSearchData> => {
    try {
      const products = await ProductsService.getAllProducts(limit, offset, {}, sort);
      return products.data;
    } catch (error) {
      console.error("Failed to fetch orders", error);
      throw error;
    }
  }

  const addProducts = (nbProducts: number) => {
    if (totalProductsInSearch <= products.length)
      return;

    const productsPromise = getProducts(nbProducts, products.length);
    productsPromise.then((prods) => {
      let products_new: ProductType[] = []
      products_new = products_new.concat(products).concat(prods.data);
      setProducts(products_new);
      setTotalProductsInSearch(prods.totalCount)
      console.log(totalProductsInSearch, products.length)
    });
  }

  const phoneCardWidthPx = 250;
  const phoneCardMargin = 20;

  const handleNext = () => {
    if (selectedPhonesIndex >= Math.ceil(products.length / itemPerPage) - 1) return;

    setSelectedPhonesIndex((prevIndex) => (prevIndex + 1) % (Math.ceil(products.length / itemPerPage)));
    console.log(totalProductsInSearch, products.length)
  };

  const handlePrev = () => {
    if (selectedPhonesIndex === 0) return;
    setSelectedPhonesIndex((prevIndex) => (prevIndex - 1 + Math.ceil(products.length / itemPerPage)) % Math.ceil(products.length / itemPerPage));
  };

  const handleMoreItems = () => {
    addProducts(itemPerPage * nbPagesPerLoad);
  }

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev,
    trackMouse: true
  });

  const handleCardClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <Container sx={{ mt: 4, mb: 4, margin: "0" }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {category}
        </Typography>
        <Box {...swipeHandlers} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Box sx={{ position: "relative", overflow: "hidden" }}>
            <div style={{ width: `${itemPerPage * (phoneCardWidthPx + phoneCardMargin)}px`, overflow: "hidden" }}>
              <motion.div
                style={{ display: 'flex', width: `${products.length * itemPerPage * (phoneCardWidthPx + phoneCardMargin)}px` }}
                animate={{ x: -selectedPhonesIndex * itemPerPage * (phoneCardWidthPx + phoneCardMargin) + 'px' }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                {products.map((product) => (
                  <Card key={product.id}
                    onClick={() => handleCardClick(product.id)}
                    sx={{
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: 6,
                      },
                      marginX: `${phoneCardMargin / 2}px`,
                      marginBottom: "20px",
                      marginTop: "10px",
                      width: `${phoneCardWidthPx}px`,
                      height: "320px",
                      userSelect: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={product.imageUrl}
                      alt={product.name}
                      sx={{ padding: "1em 1em 0 1em", objectFit: "contain", userSelect: 'none' }}
                    />
                    <CardContent sx={{ userSelect: 'none' }}>
                      <Typography noWrap variant="subtitle1" component="div" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "pre-line", display: "-webkit-box", WebkitLineClamp: "1", WebkitBoxOrient: "vertical", userSelect: 'none' }}>
                        {product.name}
                      </Typography>
                      <Rating
                        name="rating"
                        value={/*phone.rating*/ 4}
                        icon={<StarIcon color="primary" sx={{ fontSize: "0.8em", userSelect: 'none' }} />}
                        emptyIcon={<StarBorderIcon color="primary" sx={{ fontSize: "0.8em", userSelect: 'none' }} />}
                        readOnly
                        precision={0.5}
                      />
                      <Typography variant="body2" color="text.secondary" sx={{ userSelect: 'none' }}>
                        {product.price} €
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
                {totalProductsInSearch > products.length && <Box display="flex" justifyContent="center" alignItems="center" width={phoneCardWidthPx}>
                  <Button variant="outlined" sx={{ width: `${phoneCardWidthPx}`, height: "40px" }} onClick={handleMoreItems}>
                    Afficher plus
                  </Button>
                </Box>}
              </motion.div>
              <Box position="absolute" top={0} right={0} height="100%" width={50}></Box>
            </div>
            {!isMdOrLess && (
              <>
                <IconButton
                  onClick={() => handlePrev()}
                  disabled={selectedPhonesIndex === 0}
                  sx={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)" }}
                >
                  <ArrowBackIos />
                </IconButton>
                <IconButton
                  onClick={() => handleNext()}
                  disabled={selectedPhonesIndex >= Math.ceil(products.length / itemPerPage) - 1}
                  sx={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}
                >
                  <ArrowForwardIos/>
                </IconButton>
              </>
            )}
          </Box>
        </Box>
      </Container>
    </motion.div>
  );
};

export default ProductsSection;
