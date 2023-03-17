const { buildSchema } = require('graphql');

module.exports = buildSchema(`
    type TestData{
        title: String!
        description: String!
    }

    type Post{
        _id: ID!
        title: String!
        content: String!
        imageUrl: String!
        creator: User!
        createdAt: String!
        updatedAt: String!
    }

    type User{
        _id: ID!
        name: String!
        email: String!
        password: String
        status: String!
        posts: [Post]
    } 

    type AuthData{
        token: String!
        userId: String!
    }

    input CreatePostInputData{
        title: String!
        content: String!
        imageUrl: String!
    }

    input CreateUserInputData{
        name: String!
        email: String!
        password: String!
    }
     
    type MainMutation{
        createUser(userInput:CreateUserInputData): User!
        createPost(createPostInput: CreatePostInputData):Post!
    }


    type MainQuery{
        getData: TestData!
        hello: String!
        login(email:String!, password: String!): AuthData
    }

    schema {
        query: MainQuery
        mutation: MainMutation
    }
`);