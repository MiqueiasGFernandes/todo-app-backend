import { CreateDateColumn, DeleteDateColumn, PrimaryColumn } from 'typeorm'

export abstract class BaseModel {
  @PrimaryColumn('uuid')
    id: string

  @CreateDateColumn()
    createdAt: Date

  @DeleteDateColumn()
    updateDate?: Date
}
