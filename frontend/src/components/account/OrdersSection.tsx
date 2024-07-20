import OrdersService from "@/services/OrdersService";
import { Typography, Grid, Card, CardContent, Box, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Container } from "@mui/material";
import { OrderType } from "common-types";
import { useEffect, useState } from "react";
import { useSession } from "../contexts/AuthProvider";
import { useLoader } from "../contexts/LoaderProvider";

// Composant pour afficher les commandes
export const OrdersSection: React.FC = () => {
    const [orders, setOrders] = useState<OrderType[]>([]);
    const { user, token, isAuthenticated } = useSession();
    const { setLoading } = useLoader();
  
    useEffect(() => {
      setLoading(true);
      const fetchOrders = async () => {
        if (!isAuthenticated) return;
    
        const userUUID = user?.userUID ?? "";
        const _token = token ?? "";
    
        try {
          const ordersResponse = await OrdersService.getOrdersByUser(_token.token, userUUID);
          if(orders !== ordersResponse.data)
            setOrders(ordersResponse.data);
        } catch (error) {
          console.error("Failed to fetch orders");
        }
        setLoading(false);
      };
      fetchOrders();
    }, []);
  
  
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" color="text.primary" mb={4}>
          User Orders
        </Typography>
        <Grid container spacing={4}>
          {orders && orders.map((order, index) => (
            <Grid item xs={12} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" color="text.primary">
                    Order #{order.id}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Status: {order.status}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Order Date: {order.createdAt.toLocaleString()}
                  </Typography>
                  <Box mt={2}>
                    <TableContainer component={Paper}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell>Product</TableCell>
                            <TableCell align="right">Quantity</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {order.orderDetails && order.orderDetails.map((oe, index) => 
                           {if(!oe || !oe.product) return;
                            return (
                            <TableRow key={index}>
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, height: "100px"}}>
                                  {/*<Avatar variant="square" src={oe.product.imageUrl} alt={oe.product.name} sx={{ height: "100%" }} />*/}
                                  <img src={oe.product.imageUrl} alt={oe.product.name} style={{height:"100%", maxWidth:"100px", objectFit: "contain"}}/>
                                  {oe.product.name}
                                </Box>
                              </TableCell>
                              <TableCell align="right">{oe.quantity}</TableCell>
                            </TableRow>
                          )})}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  };

  export default OrdersSection;