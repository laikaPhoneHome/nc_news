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
            test('Responds with status 200 and a body containing an array of article objects sorted by default: date in decending order', () => {
                return request(app)
                .get('/api/articles')
                .expect(200)
                .then(({ body }) => {
                    const { articles } = body;

                    expect(articles).toHaveLength(12);
                    articles.forEach(article => {
                        expect(article).toEqual(
                            expect.objectContaining({
                                author: expect.any(String),
                                title: expect.any(String),
                                article_id: expect.any(Number),
                                topic: expect.any(String),
                                created_at: expect.any(String),
                                votes: expect.any(Number),
                                comment_count: expect.any(String),
                            })
                        )
                    })
                })
            
            })
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
                        expect(message).toBe('Article Not Found');
                    })
                })
                test('Responds Error 400 for a request with invalid id', () => {
                    return request(app)
                    .get('/api/articles/articleTen')
                    .expect(400)
                    .then(({ body }) => {

                        const { message } = body;
                        expect(message).toBe('Invalid Article Id');
                    })
                })
            })
            test('Responds with a comment count property', () => {
                return request(app)
                .get('/api/articles/5')
                .expect(200)
                .then(({ body }) => {
                    const { article } = body;

                    expect(article).toEqual(
                        expect.objectContaining({
                            article_id: 5,
                                title: 'UNCOVERED: catspiracy to bring down democracy',
                                author: 'rogersop',
                                created_at: "2020-08-03T13:14:00.000Z",
                                body: 'Bastet walks amongst us, and the cats are taking arms!',
                                votes: 0,
                                topic: 'cats',
                                comment_count: '2'
                        })
                    )
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
describe('PATCH', () => {
    describe('/api', () => {
        describe('/articles', () => {
            describe('/:article_id', () => {
                
                test('Responds with status 202 and an updated article object - Takes a body with an inc_votes property that increments the article\'s votes property by the given amount', () => {
                    return request(app)
                    .patch('/api/articles/5')
                    .send({ inc_votes : 1 })
                    .expect(202)
                    .then(({body}) => {

                        const { article } = body;

                        expect(article).toEqual(
                            expect.objectContaining({
                                article_id: 5,
                                title: 'UNCOVERED: catspiracy to bring down democracy',
                                author: 'rogersop',
                                created_at: "2020-08-03T13:14:00.000Z",
                                body: 'Bastet walks amongst us, and the cats are taking arms!',
                                votes: 1,
                                topic: 'cats'
                            })
                        )
                    })
                })
                test('Responds Error 404 not found if given a valid id that doesnt exist', () => {
                    return request(app)
                    .patch('/api/articles/100')
                    .send({ inc_votes : 1 })
                    .expect(404)
                    .then(({ body }) => {
                        const { message } = body;
                        expect(message).toBe('Not Found');
                    })
                })
                test('Responds with Error 400 if given an invalid id', () => {
                    return request(app)
                    .patch('/api/articles/my-article')
                    .send({ inc_votes: 1 })
                    .expect(400)
                    .then(({ body }) => {
                        const { message } = body;
                        expect(message).toBe('Invalid ID');
                    })
                })
                test('Responds with Error 400 if given an invalid votes count', () => {
                    return request(app)
                    .patch('/api/articles/5')
                    .send({ inc_votes: 'one'})
                    .expect(400)
                    .then(({ body }) => {
                        const { message } = body;
                        expect(message).toBe('Invalid Vote Count')
                    })
                })
            })
        })
    })
})