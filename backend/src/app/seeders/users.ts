import { Op } from "sequelize";
import { User } from "../models/User";
import { AuthenticationService } from "../services/AuthenticationService";
import { Roles } from "common-types";

const seed_users = [
    {
      "email": "test_harry.potter@example.com",
      "password": "Qw3rtyP@ssword",
      "role": "Customer",
      "firstName": "Harry",
      "lastName": "Potter",
      "address": "4 Privet Drive, Little Whinging"
    },
    {
      "email": "test_hermione.granger@example.com",
      "password": "P@ssword123!",
      "role": "Admin",
      "firstName": "Hermione",
      "lastName": "Granger",
      "address": "Hampstead, London"
    },
    {
      "email": "test_ron.weasley@example.com",
      "password": "R0nPa$$w0rd",
      "role": "Customer",
      "firstName": "Ron",
      "lastName": "Weasley",
      "address": "The Burrow, Ottery St Catchpole"
    },
    {
      "email": "test_albus.dumbledore@example.com",
      "password": "H0gwartsMagic!",
      "role": "Admin",
      "firstName": "Albus",
      "lastName": "Dumbledore",
      "address": "Hogwarts Castle"
    },
    {
      "email": "test_ginny.weasley@example.com",
      "password": "G1nnyPa$$123",
      "role": "Customer",
      "firstName": "Ginny",
      "lastName": "Weasley",
      "address": "The Burrow, Ottery St Catchpole"
    },
    {
      "email": "test_luna.lovegood@example.com",
      "password": "LunaL0veG00d!",
      "role": "Customer",
      "firstName": "Luna",
      "lastName": "Lovegood",
      "address": "near Ottery St Catchpole, Devon"
    },
    {
      "email": "test_draco.malfoy@example.com",
      "password": "DracoMalfoy@Slyth",
      "role": "Admin",
      "firstName": "Draco",
      "lastName": "Malfoy",
      "address": "Malfoy Manor, Wiltshire"
    },
    {
      "email": "test_neville.longbottom@example.com",
      "password": "NevillePa$$word",
      "role": "Customer",
      "firstName": "Neville",
      "lastName": "Longbottom",
      "address": "House of his grandmother, Augusta Longbottom"
    },
    {
      "email": "test_minerva.mcgonagall@example.com",
      "password": "M1n3rva@Hogwarts",
      "role": "Admin",
      "firstName": "Minerva",
      "lastName": "McGonagall",
      "address": "Hogwarts Castle"
    },
    {
      "email": "test_sirius.black@example.com",
      "password": "S1r1usBl@ck",
      "role": "Customer",
      "firstName": "Sirius",
      "lastName": "Black",
      "address": "12 Grimmauld Place, London"
    }
];

export const up = async() => {
    let findedUsers = (await User.findAll({
        attributes: ["email"],
        where: {
            email: {
                [Op.startsWith]: "test_%"
            }
        }
    })).map(a => a.email);

    for(let i = 0; i < seed_users.length; i++) {
        if(!findedUsers.includes(seed_users[i].email))
            await new AuthenticationService().register(
              seed_users[i].email, 
              seed_users[i].password, 
              seed_users[i].firstName,
              seed_users[i].lastName,
              seed_users[i].address,
              seed_users[i].role.toLocaleLowerCase() as Roles, 
              Roles.Admin,
            );
    }
}

export const down = async() => {
    await User.destroy({
        where: {
            email: {
                [Op.startsWith]: "test_%"
            }
        }
    })
}