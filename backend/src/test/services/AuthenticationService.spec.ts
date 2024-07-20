import { User } from '../../app/models/User';
import Authentication from '../../app/utils/Authentication';
import { Roles, UNAUTHORIZED_RESSOURCE_ERROR, UnauthorizedError } from 'common-types';
import { AuthenticationService } from '../../app/services/AuthenticationService';
import { Op } from 'sequelize';
import sequelize, { init } from '../../app/db';

describe('AuthenticationService', () => {
  let authenticationService: AuthenticationService;

  beforeAll(async() => {
    await init();
    await sequelize().sync({ force : true });
});

  beforeEach(() => {
    authenticationService = new AuthenticationService();
  });

  describe('login', () => {
    it('should return a token and user data if the email and password are valid', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'password';
      const user = new User();
      user.email = email;
      user.role = Roles.Customer;
      user.password = await Authentication.passwordHash(password);
      spyOn(authenticationService, 'findByMail').and.returnValue(Promise.resolve(user));
      spyOn(Authentication, 'passwordCompare').and.returnValue(Promise.resolve(true));
      spyOn(Authentication, 'generateToken').and.returnValue('token');
      spyOn(Authentication, 'getTokenExpiration').and.returnValue(Promise.resolve(new Date()));

      // Act
      const result = await authenticationService.login(email, password);

      // Assert
      expect(result.tokenType.type).toEqual('Bearer');

      expect(result.tokenType.expiresDate).toEqual(jasmine.any(Date));
      expect(result.userData.email).toEqual(email);
      expect(result.userData.role).toEqual(Roles.Customer);

      expect(authenticationService.findByMail).toHaveBeenCalledWith(email);
      expect(Authentication.passwordCompare).toHaveBeenCalledWith(password, user.password);
      expect(Authentication.generateToken).toHaveBeenCalledWith(user.uuid, user.email, user.role);
      expect(Authentication.getTokenExpiration).toHaveBeenCalledWith('token');
    });

    it('should throw an UnauthorizedError if the email is invalid', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'password';
      spyOn(authenticationService, 'findByMail').and.returnValue(Promise.resolve(null));

      // Act & Assert
      await expectAsync(authenticationService.login(email, password)).toBeRejectedWith(
        new UnauthorizedError(UNAUTHORIZED_RESSOURCE_ERROR, {})
      );
      expect(authenticationService.findByMail).toHaveBeenCalledWith(email);
    });

    it('should throw an UnauthorizedError if the password is invalid', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'password';
      const user = new User();
      user.password = await Authentication.passwordHash('wrong-password');
      spyOn(authenticationService, 'findByMail').and.returnValue(Promise.resolve(user));
      spyOn(Authentication, 'passwordCompare').and.returnValue(Promise.resolve(false));

      // Act & Assert
      await expectAsync(authenticationService.login(email, password)).toBeRejectedWith(
        new UnauthorizedError(UNAUTHORIZED_RESSOURCE_ERROR, {})
      );
      expect(authenticationService.findByMail).toHaveBeenCalledWith(email);
      expect(Authentication.passwordCompare).toHaveBeenCalledWith(password, user.password);
    });
  });

  describe('register', () => {
    it('should create a new user and return the user data if all the parameters are valid', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'password';
      const creatingRole = Roles.Customer;
      const sessionRole = Roles.Admin;
      spyOn(authenticationService, 'emailAlreadyRegister').and.returnValue(Promise.resolve(false));
      spyOn(Authentication, 'passwordHash').and.returnValue(Promise.resolve('hashed-password'));
      spyOn(User, 'create').and.returnValue(
        Promise.resolve({
          uuid: 'user-uuid',
          email: email,
          role: creatingRole,
        } as User)
      );

      // Act
      const result = await authenticationService.register(email, password, creatingRole, sessionRole);

      // Assert
      expect(result).toEqual({
        uuid: 'user-uuid',
        email: email,
        role: creatingRole,
      });
      expect(authenticationService.emailAlreadyRegister).toHaveBeenCalledWith(email);
      expect(Authentication.passwordHash).toHaveBeenCalledWith(password);
      expect(User.create).toHaveBeenCalledWith({
        email: email,
        password: 'hashed-password',
        role: creatingRole,
      });
    });

    // Add more test cases for different scenarios
  });

  describe('findByMail', () => {
    it('should return the user with the given email if it exists', async () => {
      // Arrange
      const email = 'test@example.com';
      const user = new User();
      spyOn(User, 'findOne').and.returnValue(Promise.resolve(user));

      // Act
      const result = await authenticationService.findByMail(email);

      // Assert
      expect(result).toBe(user);
      expect(User.findOne).toHaveBeenCalledWith({
        where: {
          email: {
            [Op.eq]: email,
          },
        },
      });
    });

    // Add more test cases for different scenarios
  });

  describe('emailAlreadyRegister', () => {
    it('should return true if the email is already registered', async () => {
      // Arrange
      const email = 'test@example.com';
      spyOn(User, 'count').and.returnValue(Promise.resolve(1));

      // Act
      const result = await authenticationService.emailAlreadyRegister(email);

      // Assert
      expect(result).toBeTrue();
      expect(User.count).toHaveBeenCalledWith({
        where: {
          email: {
            [Op.eq]: email,
          },
        },
      });
    });

    // Add more test cases for different scenarios
  });

  describe('countUserWithRole', () => {
    it('should return the number of users with the given role', async () => {
      // Arrange
      const role = Roles.Admin;
      spyOn(User, 'count').and.returnValue(Promise.resolve(2));

      // Act
      const result = await authenticationService.countUserWithRole(role);

      // Assert
      expect(result).toBe(2);
      expect(User.count).toHaveBeenCalledWith({
        where: {
          role: {
            [Op.eq]: role,
          },
        },
      });
    });

    // Add more test cases for different scenarios
  });

  describe('verifyToken', () => {
    it('should return the decoded token as a SessionUser if the token is valid', async () => {
      // Arrange
      const token = 'valid-token';
      const decodedToken = {
        userUID: 'user-uuid',
        email: 'test@example.com',
        role: Roles.Customer,
      };
      spyOn(Authentication, 'validateToken').and.returnValue(Promise.resolve(decodedToken));

      // Act
      const result = await authenticationService.verifyToken(token);

      // Assert
      expect(result).toEqual(decodedToken);
      expect(Authentication.validateToken).toHaveBeenCalledWith(token);
    });

    // Add more test cases for different scenarios
  });
});