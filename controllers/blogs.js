const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response, next) => {
    try {
        const blogs = await Blog.find({})
        response.json(blogs.map(note => note.toJSON()))
    } catch (exception) {
        next(expection)
    }
})

blogsRouter.delete('/:id', async (req, res, next) => {
    try {
        await Blog.findByIdAndRemove(req.params.id)
        res.status(204).end()
    } catch (exception) {
        next(exception)
    }
})

blogsRouter.put('/:id', async (req, res, next) => {
    const body = req.body

    const blog = {
        "title": body.title,
        "author": body.author,
        "url": body.url,
        "likes": body.likes || 0
    }
    try {
        if (!blog.title || !blog.url) {
            res.status(400).end()
        } else {
            const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, blog, { new: true })
            res.json(updatedBlog.toJSON())
        }
    } catch (exception) {
        next(exception)
    }
})

blogsRouter.post('/', async (request, response, next) => {
    const body = request.body

    let blog = new Blog({
        "title": body.title,
        "author": body.author,
        "url": body.url,
        "likes": body.likes
    })
    try {
        if (!blog.title || !blog.url) {
            response.status(400).end()
        } else {
            const savedBlog = await blog.save()
            response.json(savedBlog.toJSON())
        }

    } catch (exception) {
        next(exception)
    }
})

module.exports = blogsRouter