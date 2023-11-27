import { AppModule } from '@app/App.module'
import { faker } from '@faker-js/faker'
import { ValidationPipe, type INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import * as request from 'supertest'

describe('AddTaskController (e2e)', () => {
  let app: INestApplication

  const taskListId = '40f05b67-e886-40bb-be6d-e0a413be6faa'

  beforeEach(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = testingModule.createNestApplication()
    app.useGlobalPipes(new ValidationPipe())
    await app.init().catch((error) => {
      console.log('An error has ocurrs initializing app', error)
      console.log('Run: docker compose up -d')
    })
  })
  afterEach(async () => {
    jest.clearAllMocks()
    jest.clearAllTimers()

    await app.close()
  })
  test('WHEN POST /tasks. SHOULD success', async () => {
    const data = {
      title: faker.lorem.word(),
      description: faker.lorem.sentence(),
      taskListId
    }

    const sut = await request(app.getHttpServer())
      .post('/tasks')
      .set({ 'Content-Type': 'application/json' })
      .set({ Accept: 'application/json' })
      .send(JSON.stringify(data))

    expect(sut.status).toBe(201)
    expect(typeof sut.body.id).toBe('string')
    expect(sut.body.title).toBe(data.title)
    expect(sut.body.description).toBe(data.description)
    expect(sut.body.taskListId).toBe(data.taskListId)
  })
  test('WHEN POST WITH /tasks AND list does not exists. SHOULD 404', async () => {
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
      taskListId
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
})
