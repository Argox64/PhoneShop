process.env.NODE_ENV = 'test';

import { AuthenticationService } from "../../app/services/AuthenticationService";
import sequelize, { init } from "../../app/db";
import { up as usersUp, down as usersDown } from "../../app/seeders/users";
import { ValidationError } from "sequelize";
import { BadRequestError, ConflictError, ForbiddenError, Roles, UnauthorizedError, USER_ALREADY_EXISTS_ERROR } from "common-types";


describe("---Authentification services [login]---", () => {
    beforeAll(async() => {
        await init();
        await sequelize().dropAllSchemas({});
        await sequelize().sync({ force : true });
        await usersUp();
    });

    it("[login]: login with existing account", async () => {
        const data = await new AuthenticationService().login("test_minerva.mcgonagall@example.com", "M1n3rva@Hogwarts");
        expect(data.tokenType.token.length).toBeGreaterThan(50);
    }, 3000);

    it("[login]: login with unknown account", async () => {
        try {
            const token = await new AuthenticationService().login("test@example.com", "pass");
        } catch(err) {
            if(err instanceof UnauthorizedError) {
                expect(err.status).toBe(401);
                return;
            }
        }

        throw new Error("Test failed.");
    }, 3000);

    it("[login]: login with invalid password", async () => {
        try {
            const token = await new AuthenticationService().login("test_minerva.mcgonagall@example.com", "pass");
        } catch(err) {
            if(err instanceof UnauthorizedError) {
                expect(err.status).toBe(401);
                return;
            }
        }

        throw new Error("Test failed.");
    }, 3000);


    // Close Connection after tests
    afterAll(async () => {
        await usersDown();
        await sequelize().close();
    });
});

describe("---Authentification services [register]---", () => {
    beforeAll(async() => {
        await init();
        await sequelize().dropAllSchemas({});
        await sequelize().sync({ force : true });
        await usersUp();
    });

    
    it("[register]: register an customer account with anonymous rights", async () => {
        const user = await new AuthenticationService().register("test1_mail@example.com", "M1n3rva@Hogwarts", Roles.Customer, undefined);
        expect(user.email).toBe("test1_mail@example.com");
        expect(user.role).toBe(Roles.Customer);
    }, 3000);

    it("[register]: register an customer account with customer rights", async () => {
        const user = await new AuthenticationService().register("test2_mail@example.com", "M1n3rva@Hogwarts", Roles.Customer, Roles.Customer);
        expect(user.email).toBe("test2_mail@example.com");
        expect(user.role).toBe(Roles.Customer);
    }, 3000);

    it("[register]: register an customer account with admin rights", async () => {
        const user = await new AuthenticationService().register("test3_mail@example.com", "M1n3rva@Hogwarts", Roles.Customer, Roles.Admin);
        expect(user.email).toBe("test3_mail@example.com");
        expect(user.role).toBe(Roles.Customer);
    }, 3000);

    it("[register]: register an admin account with admin rights", async () => {
        const user = await new AuthenticationService().register("test4_mail@example.com", "M1n3rva@Hogwarts", Roles.Admin, Roles.Admin);
        expect(user.email).toBe("test4_mail@example.com");
        expect(user.role).toBe(Roles.Admin);
    }, 3000);

    it("[register]: register an admin account with customer rights (throw error)", async () => {
        try {
        const user = await new AuthenticationService().register("test5_mail@example.com", "M1n3rva@Hogwarts", Roles.Admin, Roles.Customer);
        } catch(err) {
            if(err instanceof ForbiddenError) {
                expect(err.status).toBe(403);
                return;
            }
        }

        throw new Error("Test failed.")
    }, 3000);

    it("[register]: register an admin account with anonymous rights (throw error)", async () => {
        try {
        const user = await new AuthenticationService().register("test6_mail@example.com", "M1n3rva@Hogwarts", Roles.Admin, undefined);
        } catch(err) {
            if(err instanceof ForbiddenError) {
                expect(err.status).toBe(403);
                return;
            }
        }

        throw new Error("Test failed.")
    }, 3000);

    it("[register]: register an customer account that already exists", async () => {
        try {
            const user = await new AuthenticationService().register("test_minerva.mcgonagall@example.com", "M1n3rva@Hogwarts", Roles.Customer, undefined);
        } catch(err) {
            console.log(err)
            if(err instanceof ConflictError) {
                expect(err.errorId).toBe(USER_ALREADY_EXISTS_ERROR.code);
                return;
            }
        }

        throw new Error("Test failed.")
    }, 3000);

    it("[register]: register an customer account with invalid email", async () => {
        try {
            const user = await new AuthenticationService().register("test", "M1n3rva@Hogwarts", Roles.Customer, undefined);
        } catch(err) {
            if(err instanceof ValidationError) {
                expect(err.errors[0].validatorKey).toBe("isEmail");
                return;
            }
        }

        throw new Error("Test failed.")
    }, 3000);

    it("[register]: register an customer account with bad length password < 8", async () => {
        try {
            const user = await new AuthenticationService().register("test7_mail@example.com", "test", Roles.Customer, undefined);
        } catch(err) {
            if(err instanceof BadRequestError) {
                expect(err.status).toBe(400);
                return;
            }
        }

        throw new Error("Test failed.")
    }, 3000);

    it("[register]: register an customer account with bad length password > 64", async () => {
        try {
            const user = await new AuthenticationService().register(
                "test8_mail@example.com", 
                "testtesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttesttest", 
                Roles.Customer,
                 undefined);
        } catch(err) {
            if(err instanceof BadRequestError) {
                expect(err.status).toBe(400);
                return;
            }
        }

        throw new Error("Test failed.")
    }, 3000);

    // Close Connection after tests
    afterAll(async () => {
        await usersDown();
        await sequelize().close();
    });
});