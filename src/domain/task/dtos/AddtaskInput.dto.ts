import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator'

export class AddTaskInputDto {
  @IsNotEmpty()
  @IsString()
    title: string

  @IsOptional()
  @IsString()
    description?: string

  @IsNotEmpty()
  @IsUUID()
    taskListId: string
}
