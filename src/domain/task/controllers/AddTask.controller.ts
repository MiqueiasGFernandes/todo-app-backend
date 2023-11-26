import { Body, Controller, Post } from '@nestjs/common'
import { AddTaskInputDto, type AddTaskOutputDto } from '../dtos'
import { AddTaskService } from '../services'

@Controller({
  path: 'tasks'
})
export class AddTaskController {
  constructor (private readonly addTaskService: AddTaskService) {}

  @Post()
  async post (@Body() body: AddTaskInputDto): Promise<AddTaskOutputDto> {
    return await this.addTaskService.add(body)
  }
}
