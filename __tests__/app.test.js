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
                test('Responds Error 404 not found if given a valid id that doesnt exist', () => {
                    return request(app)
                    .get('/api/articles/100')
                    .expect(404)
                    .then(({ body }) => {

                        const { message } = body;
                        expect(message).toBe('Not Found');
                    })
                })
                test.only('Responds Error 400 for a request with invalid id', () => {
                    return request(app)
                    .get('/api/articles/articleTen')
                    .expect(400)
                    .then(({ body }) => {

                        const { message } = body;
                        expect(message).toBe('Invalid ID');
                    })
                })
            })
        })
        describe('/users', () => {
            test('Responds with status 200 and an array of user objects', () => {
                return request(app)
                .get('/api/users')
                .expect(200)
                .then(({ body }) => {

                    const { users } = body;

                    expect(users).toHaveLength(4);
                    users.forEach((user) => {
                        expect(user).toEqual(
                            expect.objectContaining({
                                username: expect.any(String),
                                name: expect.any(String),
                                avatar_url: expect.any(String)
                            })
                        )
                    })
                })
            })
        })
    })
})