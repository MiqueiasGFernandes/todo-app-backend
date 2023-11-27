import { TaskListModel } from '@domain/models'
import { AddTaskListController } from '@domain/task/controllers'
import { AddTaskListService } from '@domain/task/services'
import { faker } from '@faker-js/faker'
import { ValidationPipe, type INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import * as request from 'supertest'
import { type Repository } from 'typeorm'
import { type MockType } from '../fixtures/Mock.type'

describe('AddTaskListController (sociable)', () => {
  let app: INestApplication
  let taskListRepository: MockType<Repository<TaskListModel>>

  beforeEach(async () => {
    const testingModule = await Test.createTestingModule({
      controllers: [AddTaskListController],
      providers: [
        AddTaskListService,
        {
          provide: getRepositoryToken(TaskListModel),
          useFactory: (): MockType<Repository<TaskListModel>> => ({
            save: jest.fn((data) => data)
          })
        }
      ]
    }).compile()

    taskListRepository = testingModule.get(
      getRepositoryToken(TaskListModel)
    )

    app = testingModule.createNestApplication()
    app.useGlobalPipes(new ValidationPipe())
    await app.init()
  })
  afterEach(async () => {
    jest.clearAllMocks()
    jest.clearAllTimers()

    await app.close()
  })
  test('WHEN POST /lists. SHOULD success', async () => {
    taskListRepository.save?.mockImplementation(async data => await Promise.resolve({
      ...data
    }))

    const data = {
      title: faker.lorem.word(),
      description: faker.lorem.sentence()
    }

    const sut = await request(app.getHttpServer())
      .post('/lists')
      .set({ 'Content-Type': 'application/json' })
      .set({ Accept: 'application/json' })
      .send(JSON.stringify(data))

    expect(sut.status).toBe(201)
    expect(typeof sut.body.id).toBe('string')
    expect(sut.body.title).toBe(data.title)
    expect(sut.body.description).toBe(data.description)
  })
  test('WHEN POST WITH /lists WITHOUT "title". SHOULD 400 Http Code', async () => {
    const data = {
      description: faker.lorem.sentence()
    }

    const sut = await request(app.getHttpServer())
      .post('/lists')
      .send(JSON.stringify(data))
      .set({ 'Content-Type': 'application/json' })
      .set({ Accept: 'application/json' })

    expect(sut.status).toBe(400)
    expect(sut.body.message.sort()).toEqual(['title should not be empty', 'title must be a string'].sort())
  })

  test('WHEN POST WITH /lists has somenthing wrong saving into database. SHOULD 500 Http Code', async () => {
    taskListRepository.save?.mockRejectedValue({})

    const data = {
      title: faker.lorem.word(),
      description: faker.lorem.sentence()
    }

    const sut = await request(app.getHttpServer())
      .post('/lists')
      .send(JSON.stringify(data))
      .set({ 'Content-Type': 'application/json' })
      .set({ Accept: 'application/json' })

    expect(sut.status).toBe(500)
    expect(sut.body.message).toBe('Internal server error')
  })
})
