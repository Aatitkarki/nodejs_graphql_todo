const express = require('express');
const mongoose = require('mongoose');
const { graphqlHTTP } = require('express-graphql');


const graphqlSchema = require('./graphql/schema');
const graphqlResolver = require('./graphql/resolver');
const auth = require('./middleware/auth') 

const app = express();

app.use(auth)

app.use('/graphql', graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    customFormatErrorFn(error) {
        if (!error.originalError) {
            return error;
        }
        const statusCode = error.originalError.code;
        const message = error.originalError.message || "Something went wrong!";
        const data = error.originalError.data;

        return {
            message: message, statusCode: statusCode, data: data
        }
    }}));

mongoose.connect(
    'mongodb://localhost:27017/tododb?retryWrites=true'
);
app.listen(3000, () => {
    console.log("The server is running at PORT 3000")
});

