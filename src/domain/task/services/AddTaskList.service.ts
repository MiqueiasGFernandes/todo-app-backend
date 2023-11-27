import { TaskListModel } from '@domain/models'
import { HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { randomUUID } from 'crypto'
import { type Repository } from 'typeorm'
import { type AddTaskListInputDto } from '../dtos/AddTaskListInput.dto'
import { type AddTaskListOutputDto } from '../dtos/AddTaskListOutput.dto'

export class AddTaskListService {
  constructor (
    @InjectRepository(TaskListModel)
    private readonly taskListRepository: Repository<TaskListModel>
  ) {}

  private async addNewtask (task: AddTaskListInputDto): Promise<AddTaskListOutputDto> {
    const newTaskList: TaskListModel = await this.taskListRepository.save({
      id: randomUUID(),
      title: task.title,
      description: task.description
    }).catch((error) => {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: error,
        description: error.message
      })
    })

    return {
      id: newTaskList.id,
      title: newTaskList.title,
      description: newTaskList.description,
      createdAt: newTaskList.createdAt
    }
  }

  async add (task: AddTaskListInputDto): Promise<AddTaskListOutputDto> {
    return await this.addNewtask(task)
  }
}
