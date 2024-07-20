import React from "react";
import { Card, Typography, Box, CardMedia, Button } from "@mui/material";

const ShippingDetails: React.FC = () => (
  <Card sx={{ bgcolor: 'background.paper', p: 4, flexGrow: 1 }}>
    <Typography variant="h6" fontWeight="bold" color="text.primary" gutterBottom>
      Shipping
    </Typography>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <CardMedia
          component="img"
          image="https://i.ibb.co/L8KSdNQ/image-3.png"
          alt="logo"
          sx={{ width: 32, height: 32 }}
        />
        <Box>
          <Typography variant="body1" fontWeight="bold" color="text.primary">
            DPD Delivery
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Delivery within 24 Hours
          </Typography>
        </Box>
      </Box>
      <Typography variant="body1" fontWeight="bold" color="text.primary">
        $8.00
      </Typography>
    </Box>
    <Button variant="contained" color="primary" fullWidth sx={{ py: 2 }}>
      View Carrier Details
    </Button>
  </Card>
);

export default ShippingDetails;