import { AppModule } from '@app/App.module'
import { faker } from '@faker-js/faker'
import { ValidationPipe, type INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import * as request from 'supertest'

describe('AddTaskListController (e2e)', () => {
  let app: INestApplication

  beforeEach(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

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
})
