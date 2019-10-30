const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response, next) => {
    try {
        const blogs = await Blog
            .find({}).populate("user", { username: 1, name: 1 })
        response.json(blogs.map(note => note.toJSON()))
    } catch (exception) {
        next(exception)
    }
})

blogsRouter.delete('/:id', async (req, res, next) => {
    const id = req.params.id
    try {
        const blogToDelete = await Blog.findById(id)
        const token = req.token
        if (!blogToDelete) {
            return res.status(400).json({ error: "no blog found with the id " + id })
        }
        const decodedToken = jwt.verify(token, process.env.SECRET)
        if (!decodedToken.id) {
            return res.status(401).json({ error: "missing or invalid token" })
        } else if (blogToDelete.user.toString() !== decodedToken.id) {
            return res.status(401).json({ error: "not authorized" })
        } else {
            const deletedBlog = await Blog.findByIdAndRemove(id)
            res.json(deletedBlog.toJSON())
        }

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
    const token = request.token
    try {
        const decodedToken = jwt.verify(token, process.env.SECRET)
        const user = await User.findById(decodedToken.id)
        let blog = new Blog({
            "title": body.title,
            "author": body.author,
            "url": body.url,
            "likes": body.likes,
            "user": user._id
        })
        if (!blog.title || !blog.url) {
            response.status(400).end()
        }
        if (!token || !decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }
        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()
        response.json(savedBlog.toJSON())


    } catch (exception) {
        next(exception)
    }
})

module.exports = blogsRouter