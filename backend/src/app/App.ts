import express from 'express';
import i18nextMiddleware from "i18next-http-middleware"
import cors from 'cors';

import { IController } from './controllers/IController';
import i18n from './middlewares/i18n';
import { up as productUp } from './seeders/products';
import { up as usersUp } from './seeders/users';
import sequelize from './db';
import session from 'express-session';
import { AuthenticationService } from './services/AuthenticationService';
import { Roles } from 'common-types';

export class App {
  public app: express.Application;
  public port: number;
  public env: string;
 
  constructor(webHooksController: IController, controllers : IController[], port: number, env: string) {
    this.app = express();
    this.port = port;
    this.env = env;

    this.app.get("/", (req, res) => {
      res.send("Welcome to our Online Shop API...");
    });
    this.app.use('/', webHooksController.router);
    
    this.initializeDB();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
  }

  private initializeDB() {
    if(this.env == "development") {
      sequelize().sync(/*{force: true}*/).then(() => {
        this.createAdminUserIfNoAdmin();
        productUp();
        usersUp();
      });
    }
    else {
      sequelize().authenticate()
      .then(() => {
        console.log("Connection to database has been established successfully.")
      })
      .catch((err) => {
        console.log("Unable to connect to database : ", err)
      })
    }
  }

  private async createAdminUserIfNoAdmin() {
    const authService = new AuthenticationService();
    if(await authService.countUserWithRole(Roles.Admin) < 1) {
      if(process.env.DEFAULT_ADMIN_EMAIL && process.env.DEFAULT_ADMIN_PASSWORD)
      authService.register(process.env.DEFAULT_ADMIN_EMAIL, process.env.DEFAULT_ADMIN_PASSWORD, "Admin", "Admin", "Address", Roles.Admin, Roles.Admin);
    }
  }
 
  private initializeMiddlewares() {
    this.app
        .use(express.json())
        .use(express.urlencoded({ extended: true }))
        .use(cors())
        .use(i18nextMiddleware.handle(i18n))
        .use(session({
          secret: process.env.SESSION_SECRET || "VERY_STRONG_SESSION_SECRET",
          resave: false,
          saveUninitialized: true,
          cookie: {
            secure: process.env.NODE_ENV === "production",
            //httpOnly: true,
            maxAge: 1000 * 60 * 15
          } // true if in production
        }))
  }
 
  private initializeControllers(controllers : IController[]) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }
 
  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}
 
export default App;