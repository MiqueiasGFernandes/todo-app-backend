import { Module } from '@nestjs/common'
import { TaskModule } from 'src/domain/task/Task.module'

@Module({
  imports: [TaskModule],
  controllers: [],
  providers: []
})
export class AppModule {}
