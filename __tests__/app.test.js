const seed = require('../db/seeds/seed')
const db = require('../db/connection.js')
const testData = ('../db/data/test-data')

const request =require("supertest")
const app =require('../app')
const { response } = require('express')

afterAll(()=> {
    return db.end()
})

describe('GET', () => {
    describe('/api', () => {
        describe('/topics', () => {
            test('Responds with status 200 and an array of topic objects', () => {
                return request(app)
                .get('/api/topics')
                .expect(200)
                .then((response => {
                    const {
                        body: {topics}
                    } = response;

                    expect(topics).toHaveLength(3);
                    topics.forEach((topic => {
                        expect(topic).toEqual(
                            expect.objectContaining({
                                description: expect.any(String),
                                slug: expect.any(String)
                            })
                        )
                    }))
                }))
            })
        })
    })
})