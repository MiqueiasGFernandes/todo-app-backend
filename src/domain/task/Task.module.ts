import { Global, Module } from '@nestjs/common'
import { AddTaskController } from './controllers/AddTask.controller'
import { AddTaskService } from './services'

@Global()
@Module({
  controllers: [AddTaskController],
  providers: [AddTaskService]
})
export class TaskModule {}
