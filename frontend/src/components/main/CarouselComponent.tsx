import { Paper } from "@mui/material";
import Carousel from 'react-material-ui-carousel';

type CarouselComponentProps = {
  images: string[];
  isMobile: boolean;
};

export const CarouselComponent: React.FC<CarouselComponentProps> = ({ images: promoImages, isMobile }) => (
  <Carousel animation="slide" autoPlay interval={4000}>
    {promoImages.map((item, i) => (
      <Paper
        key={i}
        square
        elevation={0}
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: isMobile ? 200 : 300, bgcolor: 'background.default' }}
      >
        <img src={item} alt={`Promotion ${i + 1}`} style={{ width: '100%', maxHeight: isMobile ? '200px' : '300px', objectFit: 'contain' }} />
      </Paper>
    ))}
  </Carousel>
);