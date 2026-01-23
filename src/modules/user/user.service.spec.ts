import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { EntityManager } from '@mikro-orm/postgresql';
import { User } from 'src/entities/user.entity';

describe('UserService', () => {
  let service: UserService;
  let em: EntityManager;

  const mockUser = {
    userId: 1,
    email: 'test@example.com',
    password: 'hashedpassword',
    name: 'Test User',
    createdAt: new Date(),
  } as User;

  const mockEm = {
    findOne: jest.fn(),
    persistAndFlush: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: EntityManager,
          useValue: mockEm,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    em = module.get<EntityManager>(EntityManager);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findById', () => {
    it('should return a user if found', async () => {
      mockEm.findOne.mockResolvedValue(mockUser);
      const result = await service.findById(1);
      expect(mockEm.findOne).toHaveBeenCalledWith(User, { userId: 1 });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      mockEm.findOne.mockResolvedValue(null);
      const result = await service.findById(999);
      expect(mockEm.findOne).toHaveBeenCalledWith(User, { userId: 999 });
      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should return a user if found', async () => {
      mockEm.findOne.mockResolvedValue(mockUser);
      const result = await service.findByEmail('test@example.com');
      expect(mockEm.findOne).toHaveBeenCalledWith(User, { email: 'test@example.com' });
      expect(result).toEqual(mockUser);
    });

    it('should return null if not found', async () => {
      mockEm.findOne.mockResolvedValue(null);
      const result = await service.findByEmail('nonexistent@example.com');
      expect(mockEm.findOne).toHaveBeenCalledWith(User, { email: 'nonexistent@example.com' });
      expect(result).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create and return a new user', async () => {
      const email = 'new@example.com';
      const password = 'password123';
      const name = 'New User';

      mockEm.persistAndFlush.mockResolvedValue(undefined);

      const result = await service.createUser(email, password, name);

      expect(result).toBeInstanceOf(User);
      expect(result.email).toBe(email);
      expect(result.password).toBe(password);
      expect(result.name).toBe(name);
      expect(mockEm.persistAndFlush).toHaveBeenCalledWith(result);
    });
  });
});
