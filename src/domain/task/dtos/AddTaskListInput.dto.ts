import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class AddTaskListInputDto {
  @IsNotEmpty()
  @IsString()
    title: string

  @IsOptional()
  @IsString()
    description?: string
}
