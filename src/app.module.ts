import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';

import { AppResolver } from './app.resolver';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AuthModule } from './modules/auth/auth.module';
import mikroOrmConfig from './config/mikro-orm.config';
import { TodoModule } from './modules/todo/todo.module';
import { UserModule } from './modules/user/user.module';
@Module({
  imports: [
    MikroOrmModule.forRoot(mikroOrmConfig),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
    }),

    TodoModule,
    AuthModule,
    UserModule,
  ],
  providers: [AppService, AppResolver],
})
export class AppModule {}
