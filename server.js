const express = require('express')
const graphqlHTTP = require('express-graphql').graphqlHTTP
const buildSchema = require('graphql')
const graphql = require('graphql')


// Define the schema
const Demo = new graphql.GraphQLObjectType({
    name: 'Player',
    fields: () => ({
        id: { type: graphql.GraphQLString },
        first_name: { type: graphql.GraphQLString },
        last_name: { type: graphql.GraphQLString },
    })
});

const schema = new graphql.GraphQLSchema({ query: Demo });

var root = {
    id: () => 1,
    first_name: () => 'Hello world!',
    last_name: () => 'Ini Description'
};


var app = express();
app.use('/api', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

app.listen(4000, () => console.log('Now browse to localhost:4000/api'));
