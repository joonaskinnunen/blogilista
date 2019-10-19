const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const mongoose = require('mongoose')
const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
    },
    {
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2
    }
]

beforeEach(async () => {
    await Blog.deleteMany({})

    let blogObject = new Blog(initialBlogs[0])
    await blogObject.save()

    blogObject = new Blog(initialBlogs[1])
    await blogObject.save()
})
describe('database GET', () => {
    test('return right amount of blogs', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body.length).toBe(2)
    })
    test('return right amount of blogs when added one blog', async () => {
        blogObject = new Blog(initialBlogs[1])
        await blogObject.save()
        const response = await api.get('/api/blogs')
        expect(response.body.length).toBe(3)
    })
    test('notes are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
    test('blog has id', async () => {
        const response = await api.get('/api/blogs')
        response.body.map(blog => expect(blog.id).toBeDefined())
    })
})

describe('database POST', () => {
    test('adding new blog works', async () => {
        await api
            .post('/api/blogs')
            .send(initialBlogs[0])
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')
        expect(response.body.length).toBe(initialBlogs.length + 1)
    })
})
afterAll(() => {
    mongoose.connection.close()
})