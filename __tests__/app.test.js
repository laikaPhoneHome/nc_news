const seed = require('../db/seeds/seed')
const db = require('../db/connection.js')
const testData = require('../db/data/test-data')

const request =require("supertest")
const app =require('../app')
const { response } = require('express')

afterAll(()=> {
    return db.end()
})

beforeEach(() => {
    return seed(testData);
})

describe('GET', () => {
    describe('/api', () => {
        describe('/topics', () => {
            test('Responds with status 200 and an array of topic objects', () => {
                return request(app)
                .get('/api/topics')
                .expect(200)
                .then(({body}) => {

                    const { topics } = body;

                    expect(topics).toHaveLength(3);
                    topics.forEach((topic => {
                        expect(topic).toEqual(
                            expect.objectContaining({
                                description: expect.any(String),
                                slug: expect.any(String)
                            })
                        )
                    }))
                })
            })
        })
        describe('/articles', () => {
            describe('/:article_id', () => {

                test('Responds with 200 status and an article object', () => {
                    return request(app)
                    .get('/api/articles/5')
                    .expect(200)
                    .then(({body}) => {
                        const { article } = body;

                        expect(article).toEqual(
                            expect.objectContaining({
                                article_id: 5,
                                title: 'UNCOVERED: catspiracy to bring down democracy',
                                author: 'rogersop',
                                created_at: "2020-08-03T13:14:00.000Z",
                                body: 'Bastet walks amongst us, and the cats are taking arms!',
                                votes: 0,
                                topic: 'cats'
                            })
                        )
                    })
                })
            })
        })
    })
})