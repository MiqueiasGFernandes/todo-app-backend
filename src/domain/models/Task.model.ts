import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseModel } from './Base.model'
import { TaskListModel } from './TaskList.model'

@Entity()
export class TaskModel extends BaseModel {
  @Column()
    title: string

  @Column()
    description?: string

  @Column()
    taskListId: string

  @ManyToOne(() => TaskListModel, (list) => list.tasks)
  @JoinColumn({ name: 'taskListId' })
    list: TaskListModel
}
