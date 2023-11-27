import { TaskModule } from '@domain/task/Task.module'
import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import * as path from 'path'

@Global()
@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: [
      path.join(__dirname, '/../../.env'),
      path.join(__dirname, '/../../.env.' + process.env.NODE_ENV)
    ]
  }), TypeOrmModule.forRoot({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    type: 'postgres',
    entities: [
      path.join(__dirname, '/../domain/models/*.js'),
      path.join(__dirname, '/../domain/models/*.ts')
    ],
    database: process.env.DB_NAME,
    poolSize: 1,
    logging: true,
    synchronize: false
  }), TaskModule]
})
export class AppModule {}
