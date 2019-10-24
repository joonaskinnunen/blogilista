const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const mongoose = require('mongoose')
const User = require('../models/user')

const newUser = {
    username: "joonaski",
    name: "Joonas Kinnunen",
    password: "secret"
}

beforeEach(async () => {
    await User.deleteMany({})
})

describe('add new users', () => {
    test('return 400 when username is too short', async () => {
        const userObject = (new User({
            username: "jo",
            name: "Joonas Kinnunen",
            password: "secret"
        }))
        await userObject.save()
        expect(400)
    })
    test('return 400 when password is too short', async () => {
        const userObject = (new User({
            username: "joonas",
            name: "Joonas Kinnunen",
            password: "se"
        }))
        await userObject.save()
        expect(400)
    })
    test('return 500 when adding user with existing username', async () => {
        const userObject = (new User({
            username: "joonas",
            name: "Joonas Kinnunen",
            password: "se"
        }))
        await userObject.save()
        await userObject.save()
        expect(500)
    })
})
afterAll(() => {
    mongoose.connection.close()
})