import { CreateDateColumn, DeleteDateColumn, PrimaryGeneratedColumn } from 'typeorm'

export abstract class BaseModel {
  @PrimaryGeneratedColumn('uuid')
    id: string

  @CreateDateColumn({ name: 'created_at' })
    createdAt: Date

  @DeleteDateColumn({ name: 'updated_at' })
    updatedAt?: Date
}
