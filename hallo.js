var { graphql, buildSchema } = require('graphql');

var schema = buildSchema(`
  type Query {
    hello: String
    name: String
    age: Int
  }
`);

var rootValue = {
    hello: () => 'Hello world!',
    name: () => "rizkha",
    age: () => 20
};

var source = '{ hello, age }';

graphql({ schema, source, rootValue }).then((response) => {
    console.log(response);
});