const _ = require('lodash');

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, item) => {
        return sum + item.likes
    }
    return blogs.reduce(reducer, 0)
}

const mostLikes = (blogs) => {
    let blogWithMostLikes = blogs[0]
    blogs.map(x => x.likes > blogWithMostLikes.likes ? blogWithMostLikes = x : void 0)
    const result = {
        "title": blogWithMostLikes.title,
        "author": blogWithMostLikes.author,
        "likes": blogWithMostLikes.likes
    }
    return result
}

const mostBlogs = (blogs) => {
    let numberOfBlogs = []

    for (let i = 0; i < blogs.length; i++) {
        if (numberOfBlogs.some(e => e.author === blogs[i].author)) {
            numberOfBlogs.map((x, j) => x.author === blogs[i].author ? numberOfBlogs[j].blogs = numberOfBlogs[j].blogs + 1 : void 0)
        } else {
            numberOfBlogs.push({ "author": blogs[i].author, "blogs": 1 })
        }
    }

    let result = numberOfBlogs[0]
    numberOfBlogs.map(x => x.blogs > result.blogs ? result = x : void 0)
    return result
}

module.exports = {
    dummy,
    totalLikes,
    mostLikes,
    mostBlogs
}