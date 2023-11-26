import { Column, Entity, OneToMany } from 'typeorm'
import { BaseModel } from './Base.model'
import { TaskModel } from './Task.model'

@Entity()
export class TaskListModel extends BaseModel {
  @Column()
    title: string

  @Column()
    description?: string

  @OneToMany(() => TaskModel, (task) => task.list)
    tasks: TaskModel[]
}
