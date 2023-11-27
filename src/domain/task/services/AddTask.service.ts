import { type Repository } from 'typeorm'
import { type AddTaskOutputDto, type AddTaskInputDto } from '../dtos'
import { TaskModel, TaskListModel } from '@domain/models'
import { HttpException, HttpStatus } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { randomUUID } from 'crypto'

export class AddTaskService {
  constructor (
    @InjectRepository(TaskModel)
    private readonly taskRepository: Repository<TaskModel>,
    @InjectRepository(TaskListModel)
    private readonly taskListRepository: Repository<TaskListModel>
  ) {}

  private async hasTaskListWithId (id: string): Promise<void> {
    await this.taskListRepository.findOneByOrFail({
      id
    }).catch((error) => {
      throw new HttpException(`List with id: ${id} not found`, HttpStatus.NOT_FOUND, {
        cause: error,
        description: error.message
      })
    })
  }

  private async addNewtask (task: AddTaskInputDto): Promise<AddTaskOutputDto> {
    const newTaskModel: TaskModel = await this.taskRepository.save({
      id: randomUUID(),
      title: task.title,
      description: task.description,
      taskListId: task.taskListId
    }).catch((error) => {
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR, {
        cause: error,
        description: error.message
      })
    })

    return {
      id: newTaskModel.id,
      title: newTaskModel.title,
      description: newTaskModel.description,
      taskListId: newTaskModel.taskListId,
      createdAt: newTaskModel.createdAt
    }
  }

  async add (task: AddTaskInputDto): Promise<AddTaskOutputDto> {
    await this.hasTaskListWithId(task.taskListId)

    return await this.addNewtask(task)
  }
}
