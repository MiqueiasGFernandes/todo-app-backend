import { NestFactory } from '@nestjs/core'
import { AppModule } from './app'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap (): Promise<void> {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(new ValidationPipe())

  await app.listen(3000)
}
bootstrap()
  .then((result) => { console.log(result) })
  .catch((error) => { console.log(error) })
