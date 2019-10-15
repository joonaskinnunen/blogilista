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
    console.log(result)
    return result
}

module.exports = {
    dummy,
    totalLikes,
    mostLikes
}