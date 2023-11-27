import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseModel } from './Base.model'
import { TaskListModel } from './TaskList.model'

@Entity({ name: 'tasks' })
export class TaskModel extends BaseModel {
  @Column()
    title: string

  @Column()
    description?: string

  @Column({ name: 'task_list_id' })
    taskListId: string

  @ManyToOne(() => TaskListModel, (list) => list.tasks)
  @JoinColumn({ name: 'task_list_id' })
    list: TaskListModel
}
