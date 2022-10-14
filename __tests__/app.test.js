const seed = require('../db/seeds/seed')
const db = require('../db/connection.js')
const testData = require('../db/data/test-data')

const request = require("supertest")
const app = require('../app')
const { response } = require('express')

const endpoints = require('../endpoints.json');

afterAll(() => {
    return db.end()
})

beforeEach(() => {
    return seed(testData);
})

describe('GET', () => {
    describe('/api', () => {

        test('Responds with status 200 and an object representing the available endpoints', () => {
            return request(app)
            .get('/api')
            .expect(200)
            .then(({ body }) => {
                expect(body).toEqual({endpoints});
            })
        })
        describe('/topics', () => {
            test('Responds with status 200 and an array of topic objects', () => {
                return request(app)
                    .get('/api/topics')
                    .expect(200)
                    .then(({ body }) => {

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
        describe('/comments', () => {
            describe('/:comment_id', () => {
                test('Responds with status 200 and a body containing the comment with the given id', () => {
                    return request(app)
                        .get('/api/comments/3')
                        .expect(200)
                        .then(({ body }) => {
                            const { comment } = body;

                            expect(comment).toEqual(
                                expect.objectContaining({
                                    body: expect.any(String),
                                    votes: expect.any(Number),
                                    author: expect.any(String),
                                    article_id: expect.any(Number),
                                    created_at: expect.any(String),
                                    comment_id: expect.any(Number)
                                })
                            )
                        })
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

                        expect(articles.articles).toHaveLength(10);
                        articles.articles.forEach(article => {
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
            test('Accepts a topic as a query and returns articles of only that topic', () => {
                return request(app)
                    .get('/api/articles?topic=cats')
                    .expect(200)
                    .then(({ body }) => {
                        const { articles } = body;

                        expect(articles.articles).toHaveLength(1);
                        expect(articles).toEqual(
                            expect.objectContaining({
                                    "total_count": '1',
                                    "articles":[{
                                article_id: 5,
                                title: 'UNCOVERED: catspiracy to bring down democracy',
                                author: 'rogersop',
                                created_at: "2020-08-03T13:14:00.000Z",
                                body: 'Bastet walks amongst us, and the cats are taking arms!',
                                votes: 0,
                                topic: 'cats',
                                comment_count: '2'
                            }]
                                
                            })
                        )
                    })
            })
            test('Response articles can be sorted by any valid column and defaults to date and ordered ASC/DESC', () => {
                return request(app)
                    .get('/api/articles?sort_by=votes&order=asc')
                    .expect(200)
                    .then(({ body }) => {

                        const { articles } = body;

                        expect(articles.articles).toBeSortedBy('votes', { decending: false })
                    })
            })
            test('Response articles are limited to ten by default and accepts the query p for the page to start at, and the limit of articles per page', () => {
                return request(app)
                    .get('/api/articles?p=2&limit=5')
                    .expect(200)
                    .then(({ body }) => {

                        const { articles } = body;
                        expect(articles.articles).toHaveLength(5);
                        articles.articles.forEach(article => {
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
            test('Responds with status 200 and a no content message for pages with no content', () => {
                return request(app)
                    .get('/api/articles?p=20&limit=5')
                    .expect(200)
                    .then(({ body }) => {

                        const { message } = body;
                        expect(message).toBe('No Content');
                    })
            })
            test('Responds with status 400 if given an invalid page or limit query', () => {
                return request(app)
                    .get('/api/articles?p=2nd&limit=nottoomany')
                    .expect(400)
                    .then(({ body }) => {

                        const { message } = body;
                        expect(message).toBe('Invalid Page')
                    })
            })
            test('Responds with status 400 if given an invalid topic', () => {
                return request(app)
                    .get('/api/articles?topic=boats')
                    .expect(400)
                    .then(({ body }) => {

                        const { message } = body;
                        expect(message).toBe('Invalid Topic');
                    })
            })
            test('Responds with status 200 if given a valid topic with no associated articles', () => {
                return request(app)
                    .get('/api/articles?topic=paper')
                    .expect(200)
                    .then(({ body }) => {
                        const { articles } = body;
                        expect(articles.articles).toHaveLength(0);
                    })
            })
            test('Responds with status 400 if given an invalid sort category', () => {
                return request(app)
                    .get('/api/articles?sort_by=size')
                    .expect(400)
                    .then(({ body }) => {

                        const { message } = body;
                        expect(message).toBe('Invalid Sort Category')
                    })
            })
            describe('/:article_id', () => {

                test('Responds with 200 status and an article object', () => {
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
                describe('/comments', () => {
                    test('Responds with status 200 and an array of the associated comments, sorted by date with most recent first', () => {
                        return request(app)
                            .get('/api/articles/5/comments')
                            .expect(200)
                            .then(({ body }) => {
                                const { comments } = body;

                                expect(comments).toHaveLength(2);

                                comments.forEach(comment => {
                                    expect(comment).toEqual(
                                        expect.objectContaining({
                                            comment_id: expect.any(Number),
                                            votes: expect.any(Number),
                                            created_at: expect.any(String),
                                            author: expect.any(String),
                                            body: expect.any(String)
                                        })
                                    )
                                })

                            })
                    })

                    test('Responds with status 400 if given an invalid article Id', () => {
                        return request(app)
                            .get('/api/articles/news/comments')
                            .expect(400)
                            .then(({ body }) => {

                                const { message } = body;
                                expect(message).toBe('Invalid Article Id');
                            })
                    })
                    test('Responds with status 404 if given a valid article Id that doesn\'t exist', () => {
                        return request(app)
                            .get('/api/articles/100/comments')
                            .expect(404)
                            .then(({ body }) => {

                                const { message } = body;
                                expect(message).toBe('Article Not Found');
                            })
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

                        expect(users).toHaveLength(5);
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
            describe('/:username', () => {
                test('Responds with status 200 and a user object with the given username', () => {
                    return request(app)
                    .get('/api/users/halfcat,halfcat')
                    .expect(200)
                    .then(({ body }) => {
                        const { user } = body;

                        expect(user).toEqual(
                            expect.objectContaining({
                                username: 'halfcat,halfcat',
                                name: 'harry_test',
                                avatar_url: 'https://poohadventures.fandom.com/wiki/CatDog?file=CatDog_without_Dog_so_just_Cat.jpg'
                            })
                        )
                    })
                })
                test('Responds 404 when username not found', () => {
                    return request(app)
                    .get('/api/users/halfcat,halftest')
                    .expect(404)
                    .then(({ body }) => {
                        const { message } = body;

                        expect(message).toBe('Username Not Found')
                    })
                })
            })
        })
    })
})
describe('PATCH', () => {
    describe('/api', () => {
        describe('/comments', () => {
            describe('/:comment_id', () => {

                test('Responds with status 202 and accepts an object body, incrementing the given comment\'s votes by the inc_votes property', () => {
                    return request(app)
                    .patch('/api/comments/5')
                    .send({ inc_votes : 1 })
                    .expect(202)
                    .then(({ body }) => {
                        const { comment } = body;

                        expect(comment).toEqual(
                            expect.objectContaining({
                                author: "icellusedkars",
                                comment_id: 5,
                                body: "I hate streaming noses",
                                article_id: 1,
                                votes: 1,
                                created_at: expect.any(String)
                            })
                        )
                    })
                })
            })
        })
        describe('/articles', () => {
            describe('/:article_id', () => {

                test('Responds with status 202 and an updated article object - Takes a body with an inc_votes property that increments the article\'s votes property by the given amount', () => {
                    return request(app)
                        .patch('/api/articles/5')
                        .send({ inc_votes: 1 })
                        .expect(202)
                        .then(({ body }) => {

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
                        .send({ inc_votes: 1 })
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
                        .send({ inc_votes: 'one' })
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
describe('POST', () => {
    describe('/api', () => {
        describe('/articles', () => {

            test('Responds with status 200 accepts a request body of an article object and responds with the posted article', () => {
                return request(app)
                .post('/api/articles')
                .send({
                    author: 'halfcat,halfcat',
                    title: 'testing testing 123',
                    body: 'This is my test',
                    topic: 'cats'
                })
                .expect(202)
                .then(({ body }) => {
                    const { article } = body;

                    expect(article).toEqual(
                        expect.objectContaining({
                            author: 'halfcat,halfcat',
                            title: 'testing testing 123',
                            body: 'This is my test',
                            topic: 'cats',
                            article_id: 13,
                            created_at: expect.any(String),
                            votes: 0,
                            comment_count: '0'
                        })
                    )
                })
            })
            test('Responds with status 400 if given an invalid article', () => {
                return request(app)
                .post('/api/articles/')
                .send({
                    my_name: 'halfcat,halfcat',
                    name_of_my_article: 'testing testing 123',
                    n: 'cats'
                })
                .expect(400)
                .then(({ body }) => {
                    const { message } = body;
                    expect(message).toBe('Invalid Article Author');
                })
            })

            describe('/:article_id', () => {
                describe('/comments', () => {

                    test('Responds with status 201 accepts a request body and responds with the \'posted\' comment', () => {
                        return request(app)
                            .post('/api/articles/5/comments')
                            .send({
                                username: 'halfcat,halfcat',
                                body: 'me-ow'
                            })
                            .expect(201)
                            .then(({ body }) => {
                                const { comment } = body;

                                expect(comment).toEqual(
                                    expect.objectContaining({
                                        comment_id: expect.any(Number),
                                        votes: expect.any(Number),
                                        created_at: expect.any(String),
                                        author: expect.any(String),
                                        body: expect.any(String)
                                    })
                                )
                            })
                    })
                    test('Responds with status 404 if given a valid article id that doesn\'t exist', () => {
                        return request(app)
                            .post('/api/articles/100/comments')
                            .send({
                                username: 'halfcat,halfcat',
                                body: 'me-ow'
                            })
                            .expect(404)
                            .then(({ body }) => {

                                const { message } = body;
                                expect(message).toBe('Article Not Found');
                            })
                    })
                    test('Responds with 400 when given an invalid article id', () => {
                        return request(app)
                            .post('/api/articles/artikel/comments')
                            .send({
                                username: 'halfcat,halfcat',
                                body: 'me-ow'
                            })
                            .expect(400)
                            .then(({ body }) => {

                                const { message } = body;
                                expect(message).toBe('Invalid Article Id');
                            })
                    })
                    test('Responds with 400 if given a invalid comment data in the body', () => {
                        return request(app)
                            .post('/api/articles/5/comments')
                            .send({
                                username: 'user',
                                body: 'hello world'
                            })
                            .expect(400)
                            .then(({ body }) => {

                                const { message } = body;
                                expect(message).toBe('Invalid User');
                            })
                    })
                })
            })
            describe('/topics', () => {
                test('Responds with status 202 and the inserted topic', () => {
                    return request(app)
                        .post('/api/topics')
                        .send({
                            "slug": "tests",
                            "description": "description here"
                        })
                        .expect(202)
                        .then(({ body }) => {
                            const { topic } = body;

                            expect(topic).toEqual({
                                "slug": "tests",
                                "description": "description here"
                            })
                        })
                })
                test('Responds with status 400 if given an invalid topic', () => {
                    return request(app)
                        .post('/api/topics')
                        .send({
                            "slug": "tests",
                            "description": "description here",
                            "snail": "slimy"
                        })
                        .expect(400)
                        .then(({ body }) => {
                            const { topic } = body;

                            expect(topic).toEqual({
                                "slug": "tests",
                                "description": "description here"
                            })
                        })
                })
            })
        })
    })
})
describe('DELETE', () => {
    describe('/api', () => {
        describe('/comments', () => {
            describe('/:comment_id', () => {

                test('Responds with status 204 and an empty response body', () => {
                    return request(app)
                    .delete('/api/comments/1')
                    .expect(204)
                    .then(({ body }) => {
                        expect(body).toEqual({});
                    })
                })
                test('Responds with 404 if given a valid comment id that doesn\'t exist', () => {
                    return request(app)
                    .delete('/api/comments/1000')
                    .expect(404)
                    .then(({ body }) => {
                        const { message } = body;
                        expect(message).toEqual('Comment Not Found');
                    })
                })
                test('Responds with 400 if given an invalid comment id', () => {
                    return request(app)
                    .delete('/api/comments/thelastone')
                    .expect(400)
                    .then(({ body }) => {
                        const { message } = body;
                        expect(message).toEqual('Invalid Comment Id');
                    })
                })
            })
        })
    })
})