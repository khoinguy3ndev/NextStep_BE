import { Test, TestingModule } from '@nestjs/testing';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';

describe('AppResolver', () => {
  let appResolver: AppResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppResolver, AppService],
    }).compile();

    appResolver = module.get<AppResolver>(AppResolver);
  });

  describe('healthCheck', () => {
    it('should return "OK"', () => {
      expect(appResolver.healthCheck()).toBe('OK');
    });
  });
});
