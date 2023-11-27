import { Global, Module } from '@nestjs/common'
import { AddTaskController } from './controllers/AddTask.controller'
import { AddTaskService } from './services'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TaskListModel, TaskModel } from '@domain/models'

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      TaskListModel,
      TaskModel
    ])
  ],
  controllers: [AddTaskController],
  providers: [AddTaskService]
})
export class TaskModule {}
