const User = require('../models/user')

const bcrypt = require('bcrypt');
const validator = require('validator')
const jwt = require('jsonwebtoken')
const Post = require('../models/post')


module.exports = {
    getData() {
        return {
            title: "My todoApp",
            description: "Hello this is the description of my todo"
        };
    },
    createUser: async function ({ userInput }, req) {
        // const userEmail = args.userInput.email;
        let errors = [];
        const userEmail = userInput.email;
        if (!validator.isEmail(userEmail)) {
            errors.push({
                message: 'Invalid email'
            });
        }

        if (validator.isEmpty(userInput.password) || !validator.isLength(userInput.password, { min: 5 })) {
            errors.push({
                message: "Password too short"
            });
        }
        if (errors.length > 0) {
            const error = Error('Invalid input')
            error.code = 422;
            error.data = errors;
            throw error;
        }
        const existingUser = await User.findOne({
            email: userEmail
        });
        if (existingUser) {
            const error = Error('User with this email already exists')
            throw error;
        }

        const hashedPassword = await bcrypt.hash(userInput.password, 12);
        const user = User({
            name: userInput.name,
            email: userInput.email,
            password: hashedPassword
        });
        const createdUser = await user.save();
        return {
            ...createdUser._doc,
            _id: createdUser._id.toString()
        }
    },

    login: async ({ email, password }) => {
        // if `args` in login parameter then, 
        // const email = args.email;
        // const password = args.password;
        const existingUser = await User.findOne({
            email: email
        });
        if (!existingUser) {
            const error = Error("User not found");
            error.code = 401;
            throw error;
        }

        const passwordMatched = await bcrypt.compare(password, existingUser.password);
        if (!passwordMatched) {
            const error = Error("Password does not match");
            error.code = 401;
            throw error;
        }

        const token = await jwt.sign({
            userId: existingUser._id.toString(),
            email: existingUser.email,
        }, 'secretTokenKey', {
            expiresIn: '1d'
        })
        return {
            token: token,
            userId: existingUser._id.toString()
        }
    },
    createPost: async ({ createPostInput }, req) => {

        if (!req.isAuth) {
            const error = new Error('Not authenticated');
            error.code = 401;
            throw error;
        }

        let errors = [];
        if (validator.isEmpty(createPostInput.title) || !(validator.isLength(createPostInput.title), { min: 5 })) {
            errors.push({ message: 'Please provide valid title.' });
        }

        if (validator.isEmpty(createPostInput.content) || !validator.isLength(createPostInput.content, { min: 5 })) {
            errors.push({ message: 'Please provide valid content.' });
        }

        if (errors.length > 0) {
            const error = Error('Invalid input')
            error.code = 422;
            error.data = errors;
            throw error;
        }

        const user = await User.findById(req.userId);
        if (!user) {
            const error = Error('Invalid user');
            error.code = 422;
            throw error;
        }


        const post = Post({
            title: createPostInput.title,
            content: createPostInput.content,
            imageUrl: createPostInput.imageUrl,
            creator: user._id
        });

        const createdPost = await post.save();
        user.posts.push(createdPost);
        await user.save();
        return {
            ...createdPost._doc,
            creator: user,
            _id: createdPost._id.toString(),
            createdAt: createdPost.createdAt.toISOString(),
            updatedAt: createdPost.updatedAt.toISOString(),
        }

    },
    hello() {
        return "hello world";
    }

}