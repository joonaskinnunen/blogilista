const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    try {
        const blogs = await Blog.find({})
        response.json(blogs.map(note => note.toJSON()))
    } catch (exception) {
        next(expection)
    }
})

blogsRouter.post('/', async (request, response, next) => {
    const body = request.body
    let blog = new Blog({
        "title": body.title,
        "author": body.author,
        "url": body.url,
        "likes": body.likes === undefined || !body.likes ? 0 : body.likes
    })
    try {
        if (!blog.title || !blog.url) {
            response.status(400)
        }
        const savedBlog = await blog.save()
        response.json(savedBlog.toJSON())
    } catch (exception) {
        next(exception)
    }
})

module.exports = blogsRouter