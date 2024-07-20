import process, { config } from "process";
import App from "./app/App";
import { ProductsController } from "./app/controllers/ProductsController";
import { AuthenticationController } from "./app/controllers/AuthenticationController";
import { OrdersController } from "./app/controllers/OrdersController";
import { PaymentsController } from "./app/controllers/PaymentController";
import { WebhooksController } from "./app/controllers/WebhooksController";

const env = process.env.NODE_ENV || 'development';

const port = (process.env.PORT || 5000) as number;

const app = new App(
    new WebhooksController(),
    [
      new ProductsController(),
      new AuthenticationController(),
      new OrdersController(),
      new PaymentsController()
    ],
    port,
    env
  );
   
  app.listen();