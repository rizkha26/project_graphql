const { ApolloServer, gql } = require("apollo-server");
const knex = require("knex")({
    client: "pg",
    connection: {
        host: process.env.PGSQL_HOST,
        database: 'xsismart',
        user: process.env.PGSQL_USER,
        password: process.env.PGSQL_PASSWORD
    }
});


// Define the schema
const typeDefs = gql`
    type category{
        id: Int!
        name: String! 
        description: String!
        active: Boolean! 
        create_by: Int!
        modify_by: Int!
        variant: [variant!]
    }
    type variant{
        id: Int!
        category_id: Int!
        name: String! 
        description: String!
        active: Boolean! 
        create_by: Int!
        modify_by: Int!
        category:category!
    }
    type province{
        id: Int!
        code_province: String!
        name_province: String!
        cities: [city!]!
    }
    type city {
        id: Int!
        code_city: String!
        code_province: String!
        name_city: String!
        province: province
    }
    type Query {
        cities: [city]
        provinces: [province]
        categories: [category]
        variants: [variant]
    }
  `;
const resolvers = {
    Query: {
        cities: () => knex("city").select("*"),
        provinces: () => knex("province").select("*"),
        categories: () => knex("category").select("*"),
        variants: () => knex("variant").select("*")
    },
    province: {
        cities: root => {
            return province.findOne({ code_province: root.code_province });
        }
    },
    city: {
        province: root => {
            return knex("city")
                .whereIn("code_province", root.code_province)
                .select("*");
        }
    }
}

const server = new ApolloServer({ typeDefs, resolvers });

server
    .listen({ port: 4020 })
    .then(({ url }) => console.log(`🚀 app running at ${url}`));