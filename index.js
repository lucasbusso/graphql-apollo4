import { gql, UserInputError } from "apollo-server"
import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from '@apollo/server/standalone';
import "./db.js";
import Person from './models/person.js'


const typeDefs = gql`
  enum YesNo {
    YES
    NO
  }

  type Address {
    street: String!
    city: String!
  }

  type Person {
    name: String!
    phone: String
    address: Address!
    id: ID!
  }

  type Query {
    personCount: Int!
    allPersons(phone: YesNo): [Person]!
    findPerson(name: String!): Person
  }

  type Mutation {
    addPerson(
      name: String!
      phone: String
      street: String!
      city: String!
    ): Person
    editNumber(
        name: String!
        phone: String!
    ): Person
  }
`

const resolvers = {
  Query: {
    personCount: () => Person.collection.countDocuments(),
    allPersons: async (root, args) => {
      if(!args.phone) return Person.find({})
      return Person.find({ phone: { $exists: args.phone === 'YES' } })
    },
    findPerson: (root, args) => {
      const { name } = args
      return Person.findOne({ name })
    }
  },
  Mutation: {
    addPerson: async (root, args) => {
      const person = new Person({ ...args })
      try {
        await person.save()
      } catch (error) {
        throw new UserInputError(error.message)
      }
      return person
    },
    editNumber: async (root, args) => {
      const person = await Person.findOne({ name: args.name })
      if(!person) return
      person.phone = args.phone

      try {
        await person.save()
      } catch (error) {
        throw new UserInputError(error.message)
      }
      return person
    }
  },
  Person: {
    address: (root) => {
      return {
        street: root.street,
        city: root.city
      }
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);