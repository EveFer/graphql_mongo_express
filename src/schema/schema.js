const graphql = require('graphql')

const {GraphQLObjectType, GraphQLID, GraphQLInt, GraphQLBoolean, GraphQLString, GraphQLList, GraphQLSchema} = graphql

var courses = [
    {id: '1', name: 'Patrones diseño Java', language: 'Java', date: '2022', professorId: '2'},
    {id: '2', name: 'Patrones diseño Kotlin', language: 'Kotlin', date: '2022', professorId: '3'},
    {id: '3', name: 'Patrones diseño C', language: 'C', date: '2022', professorId: '3'},
    {id: '4', name: 'Patrones diseño C++', language: 'C++', date: '2022', professorId: '1'},   
]

var professors = [
    {id: '1', name: 'Alberto', age: 30, active: true, date: '2022'},
    {id: '2', name: 'Maria', age: 23, active: false, date: '2022'},
    {id: '3', name: 'Pepe', age: 30, active: true, date: '2022'},
    {id: '4', name: 'Laura', age: 30, active: true, date: '2022'},
]

var users = [
    {id: '1', name: 'Fernanda', email:'fer@gmail.com', password: '123', date: '2020'},
    {id: '2', name: 'Victor', email:'vic@gmail.com', password: '123', date: '2021'},
    {id: '3', name: 'Abril', email:'abril@gmail.com', password: '123', date: '2020'},
    {id: '4', name: 'Abraham', email:'abraham@gmail.com', password: '123', date: '2020'},
]

const CourseType = new GraphQLObjectType({
    name: 'Course',
    fields: ()=>({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        language: {type: GraphQLString},
        date: {type: GraphQLString},
        professor: {  // para señalar una relacion 1 : 1
            type: ProfessorType,
            resolve(parent, args){
                return professors.find(professor => professor.id === parent.professorId)
            }
        }
    })
})

const ProfessorType = new GraphQLObjectType({
    name: 'Professor',
    fields: ()=>({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        active: {type: GraphQLBoolean},
        date: {type: GraphQLString},
        courses: {
            type: new GraphQLList(CourseType),
            resolve(parent, args){ // para una relacion de 1:M
                return courses.filter(course=> course.professorId === parent.id)
            }
        }
    })
})

const UserType =  new GraphQLObjectType({
    name: 'User',
    fields: ()=>({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        email: {type: GraphQLString},
        password: {type: GraphQLString},
        date: {type: GraphQLString}
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields:{
        course: { // get a course for id
            type: CourseType,
            args:{
                id: {type: GraphQLID}
            },
            resolve(parent, args){
                // Aqui se realiza el proceso, logica para obtener los datos de la BD
                return courses.find(curso=>curso.id === args.id)
            }
        },
        courses: { // get all courses
            type: new GraphQLList(CourseType),
            resolve(parent, args){
                return courses
            }
        },
        professor: {
            type: ProfessorType,
            args:{
                name: {type: GraphQLString}
            },
            resolve(parent, args){
                return professors.find(professor=>professor.name === args.name)
            }
        },
        professors: {
            type: new GraphQLList(ProfessorType),
            resolve(parent, args){
                return professors
            }
        },
        user: {
            type: UserType,
            args: {
                email: {type: GraphQLString}
            },
            resolve(parent, args){
                return users.find(user=>user.email === args.email)
            }
        },
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})