import React from "react";
import { Card, Typography, Box, CardMedia, Button } from "@mui/material";

const CustomerDetails: React.FC = () => (
  <Card sx={{ bgcolor: 'background.paper', p: 4 }}>
    <Typography variant="h6" fontWeight="bold" color="text.primary" gutterBottom>
      Customer
    </Typography>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, py: 2, borderBottom: 1, borderColor: 'divider' }}>
        <CardMedia
          component="img"
          image="https://i.ibb.co/5TSg7f6/Rectangle-18.png"
          alt="avatar"
          sx={{ width: 48, height: 48 }}
        />
        <Box>
          <Typography variant="body1" fontWeight="bold" color="text.primary">
            David Kent
          </Typography>
          <Typography variant="body2" color="text.secondary">
            10 Previous Orders
          </Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', gap: 2, py: 2, borderBottom: 1, borderColor: 'divider' }}>
        <CardMedia
          component="img"
          image="https://tuk-cdn.s3.amazonaws.com/can-uploader/order-summary-3-svg1.svg"
          alt="email"
          sx={{ height: 24, width: 24, objectFit: "contain" }}
        />
        <Typography variant="body2" color="text.secondary" sx={{ cursor: 'pointer' }}>
          david89@gmail.com
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, mt: 2 }}>
        <Box>
          <Typography variant="body1" fontWeight="bold" color="text.primary">
            Shipping Address
          </Typography>
          <Typography variant="body2" color="text.secondary">
            180 North King Street, Northhampton MA 1060
          </Typography>
        </Box>
        <Box>
          <Typography variant="body1" fontWeight="bold" color="text.primary">
            Billing Address
          </Typography>
          <Typography variant="body2" color="text.secondary">
            180 North King Street, Northhampton MA 1060
          </Typography>
        </Box>
      </Box>
      <Button variant="outlined" color="primary" fullWidth sx={{ mt: 4 }}>
        Edit Details
      </Button>
    </Box>
  </Card>
);

export default CustomerDetails;
