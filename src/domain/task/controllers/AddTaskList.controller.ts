import { Body, Controller, Post } from '@nestjs/common'
import { AddTaskListInputDto } from '../dtos/AddTaskListInput.dto'
import { type AddTaskListOutputDto } from '../dtos/AddTaskListOutput.dto'
import { AddTaskListService } from '../services'

@Controller({
  path: 'lists'
})
export class AddTaskListController {
  constructor (private readonly addTaskListService: AddTaskListService) {}

  @Post()
  async post (@Body() body: AddTaskListInputDto): Promise<AddTaskListOutputDto> {
    return await this.addTaskListService.add(body)
  }
}
