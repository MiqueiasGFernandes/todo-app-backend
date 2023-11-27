import { Global, Module } from '@nestjs/common'
import { AddTaskController } from './controllers/AddTask.controller'
import { AddTaskListService, AddTaskService } from './services'
import { TypeOrmModule } from '@nestjs/typeorm'
import { TaskListModel, TaskModel } from '@domain/models'
import { AddTaskListController } from './controllers'

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      TaskListModel,
      TaskModel
    ])
  ],
  controllers: [AddTaskController, AddTaskListController],
  providers: [AddTaskService, AddTaskListService]
})
export class TaskModule {}
