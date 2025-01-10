require("dotenv").config();

module.exports = {
  "development": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASS,
    "database": `${process.env.DB_NAME}_${process.env.NODE_ENV}`,
    "host": "127.0.0.1",
    "dialect": "mysql",
    "define": {
      "timestamps": false
    },
  },
  "test": {
    "username": "root",
    "password": null,
    "database": `${process.env.DB_NAME}_${process.env.NODE_ENV}`,
    "host": "127.0.0.1",
    "dialect": "mysql",
    "define": {
      "timestamps": false
    },
  },
  "production": {
    "username": "root",
    "password": null,
    "database": process.env.DB_NAME,
    "host": "127.0.0.1",
    "dialect": "mysql",
    "define": {
      "timestamps": false
    },
  }
}
