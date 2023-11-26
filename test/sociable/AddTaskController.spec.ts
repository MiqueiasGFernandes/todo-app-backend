import { faker } from '@faker-js/faker'
import { ValidationPipe, type INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { Test } from '@nestjs/testing'
import { AddTaskController } from '@domain/task/controllers/AddTask.controller'
import { AddTaskService } from '@domain/task/services'
import { getRepositoryToken } from '@nestjs/typeorm'
import { TaskListModel, TaskModel } from '@domain/models'
import { type MockType } from '../fixtures/Mock.type'
import { type Repository } from 'typeorm'

describe('AddTaskController (sociable)', () => {
  let app: INestApplication
  let taskListRepository: MockType<Repository<TaskListModel>>
  let taskRepository: MockType<Repository<TaskModel>>

  beforeEach(async () => {
    const testingModule = await Test.createTestingModule({
      controllers: [AddTaskController],
      providers: [
        AddTaskService,
        {
          provide: getRepositoryToken(TaskListModel),
          useFactory: (): MockType<Repository<TaskListModel>> => ({
            findOneByOrFail: jest.fn((data) => data)
          })
        },
        {
          provide: getRepositoryToken(TaskModel),
          useFactory: (): MockType<Repository<TaskModel>> => ({
            save: jest.fn((data) => data)
          })
        }
      ]
    }).compile()

    taskListRepository = testingModule.get(
      getRepositoryToken(TaskListModel)
    )

    taskRepository = testingModule.get(
      getRepositoryToken(TaskModel)
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
  test('WHEN POST /tasks. SHOULD success', async () => {
    const generatedUuid = crypto.randomUUID()

    taskListRepository.findOneByOrFail?.mockResolvedValue({})
    taskRepository.save?.mockImplementation(async data => await Promise.resolve({
      id: generatedUuid,
      ...data
    }))

    const data = {
      title: faker.lorem.word(),
      description: faker.lorem.sentence(),
      taskListId: faker.string.uuid()
    }

    const sut = await request(app.getHttpServer())
      .post('/tasks')
      .set({ 'Content-Type': 'application/json' })
      .set({ Accept: 'application/json' })
      .send(JSON.stringify(data))

    expect(sut.status).toBe(201)
    expect(sut.body.id).toBe(generatedUuid)
    expect(sut.body.title).toBe(data.title)
    expect(sut.body.description).toBe(data.description)
    expect(sut.body.taskListId).toBe(data.taskListId)
  })
  test('WHEN POST WITH /tasks AND list does not exists. SHOULD 404', async () => {
    taskListRepository.findOneByOrFail?.mockRejectedValue({})

    const data = {
      title: faker.lorem.word(),
      description: faker.lorem.sentence(),
      taskListId: faker.string.uuid()
    }

    const sut = await request(app.getHttpServer())
      .post('/tasks')
      .send(JSON.stringify(data))
      .set({ 'Content-Type': 'application/json' })
      .set({ Accept: 'application/json' })

    expect(sut.status).toBe(404)
    expect(sut.body.message).toBe(`List with id: ${data.taskListId} not found`)
  })
  test('WHEN POST WITH /tasks WITHOUT "title". SHOULD 400 Http Code', async () => {
    const data = {
      description: faker.lorem.sentence(),
      taskListId: faker.string.uuid()
    }

    const sut = await request(app.getHttpServer())
      .post('/tasks')
      .send(JSON.stringify(data))
      .set({ 'Content-Type': 'application/json' })
      .set({ Accept: 'application/json' })

    expect(sut.status).toBe(400)
    expect(sut.body.message.sort()).toEqual(['title should not be empty', 'title must be a string'].sort())
  })
  test('WHEN POST WITH /tasks WITHOUT "taskListId". SHOULD 400 Http Code', async () => {
    const data = {
      title: faker.lorem.word(),
      description: faker.lorem.sentence()
    }

    const sut = await request(app.getHttpServer())
      .post('/tasks')
      .send(JSON.stringify(data))
      .set({ 'Content-Type': 'application/json' })
      .set({ Accept: 'application/json' })

    expect(sut.status).toBe(400)
    expect(sut.body.message.sort()).toEqual(['taskListId should not be empty', 'taskListId must be a UUID'].sort())
  })

  test('WHEN POST WITH /tasks has somenthing wrong saving into database. SHOULD 500 Http Code', async () => {
    taskListRepository.findOneByOrFail?.mockResolvedValue({})
    taskRepository.save?.mockRejectedValue({})

    const data = {
      title: faker.lorem.word(),
      description: faker.lorem.sentence(),
      taskListId: faker.string.uuid()
    }

    const sut = await request(app.getHttpServer())
      .post('/tasks')
      .send(JSON.stringify(data))
      .set({ 'Content-Type': 'application/json' })
      .set({ Accept: 'application/json' })

    expect(sut.status).toBe(500)
    expect(sut.body.message).toBe('Internal server error')
  })
})
