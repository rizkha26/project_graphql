const express = require('express')
const graphqlHTTP = require('express-graphql').graphqlHTTP
const buildSchema = require('graphql')
const graphql = require('graphql')
// Connect to database
const { Client } = require('pg')
const pgPromise = require('pg-promise');

const pgp = pgPromise({});

const config = {
    host: process.env.PGSQL_HOST,
    port: process.env.PGSQL_PORT,
    database: process.env.PGSQL_DATABASE,
    user: process.env.PGSQL_USER,
    password: process.env.PGSQL_PASSWORD
};

const db = pgp(config);

// Define the schema
const Category = new graphql.GraphQLObjectType({
    name: 'category',
    fields: () => ({
        id: { type: graphql.GraphQLString },
        name: { type: graphql.GraphQLString },
        description: { type: graphql.GraphQLString },

    })
});

Category._typeConfig = {
    sqlTable: 'category',
    uniqueKey: 'id',
}

var Varinat = new graphql.GraphQLObjectType({
    name: 'variant',
    fields: () => ({
        id: { type: graphql.GraphQLInt },
        name: { type: graphql.GraphQLString },
        description: { type: graphql.GraphQLString },
        category_id: { type: graphql.GraphQLInt }

    })
})

Varinat._typeConfig = {
    sqlTable: 'varinat',
    uniqueKey: 'id'
}


const Demo = new graphql.GraphQLObjectType({
    name: 'Player',
    fields: () => ({
        id: { type: graphql.GraphQLString },
        first_name: { type: graphql.GraphQLString },
        last_name: { type: graphql.GraphQLString },
    })
});



var root = {
    id: () => 1,
    first_name: () => 'Hello world!',
    last_name: () => 'Ini Description'
};

// const schemaDemo = new graphql.GraphQLSchema({ query: Demo });

const QueryRoot = new graphql.GraphQLObjectType({
    name: 'Query',
    fields: () => ({
        hello: {
            type: graphql.GraphQLString,
            resolve: () => "Hello world!"
        },

        category: {
            type: new graphql.GraphQLList(Category),
            resolve: () => {
                "Category"
            }
        },

        variant: {
            type: new graphql.GraphQLList(Varinat),
            resolve(parentValue, args) {
                const query = `SELECT * FROM "variant"`;
                return db
                    .query(query)   // I use db.query() because I use Pool pg instead of pg-promise
                    .then(res => res.rows)
                    .catch(err => err);
            }
        },
    })
})

const schema = new graphql.GraphQLSchema({
    query: QueryRoot
});


var app = express();
app.use('/api', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));

app.listen(4000, () => console.log('Now browse to localhost:4000/api'));
