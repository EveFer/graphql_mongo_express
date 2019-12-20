const graphql = require('graphql')
const Course = require('../models/course')
const Professor = require('../models/professor')

const {GraphQLObjectType, GraphQLID, GraphQLInt, GraphQLBoolean, GraphQLString, GraphQLList, GraphQLSchema} = graphql

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
                return Professor.findById(parent.professorId)
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
                return Course.find({professorId: parent.id})
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
                return Course.findById(args.id)
            }
        },
        courses: { // get all courses
            type: new GraphQLList(CourseType),
            resolve(parent, args){
                return Course.find()
            }
        },
        professor: {
            type: ProfessorType,
            args:{
                name: {type: GraphQLString}
            },
            resolve(parent, args){
                return Professor.findOne({name: args.name})
            }
        },
        professors: {
            type: new GraphQLList(ProfessorType),
            resolve(parent, args){
                return Professor.find()
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

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addCourse: {
            type: CourseType,
            args: {
                name: {type: GraphQLString},
                language: {type: GraphQLString},
                date: {type: GraphQLString},
                professorId: {type: GraphQLID}
            },
            resolve(parent, args){
                let course = new Course({
                    name: args.name,
                    language: args.language,
                    date: args.date,
                    professorId: args.professorId
                })
                return course.save()
            }
        },

        updateCourse: {
            type: CourseType,
            args: {
                id: {type: GraphQLID},
                name: {type: GraphQLString},
                language: {type: GraphQLString},
                date: {type: GraphQLString},
                professorId: {type: GraphQLID}
            },
            resolve(parent, args){
                return Course.findByIdAndUpdate(
                    args.id, {
                        name: args.name,
                        language: args.language,
                        date: args.date,
                        professorId: args.professorId
                    },
                    {new: true}
                )
            }
        },

        deleteCourse: {
            type: CourseType,
            args: {
                id: {type: GraphQLID}
            },
            resolve(parent, args){
                return Course.findByIdAndDelete(args.id)
            }
        },

        deleteAllCourses: {
            type: CourseType,
            resolve(parent, args){
                return Course.deleteMany({})
            }
        },

        addProfessor: {
            type: ProfessorType,
            args: {
                name: {type: GraphQLString},
                age: {type: GraphQLInt},
                active: {type: GraphQLBoolean},
                date: {type: GraphQLString}
            },
            resolve(parent, args){
                return Professor(args).save()
            }
        },

        updateProfessor: {
            type: ProfessorType,
            args: {
                id: {type: GraphQLID},
                name: {type: GraphQLString},
                age: {type: GraphQLInt},
                active: {type: GraphQLBoolean},
                date: {type: GraphQLString}
            },
            resolve(parent, args){
                return Professor.findByIdAndUpdate(
                    args.id,
                    {
                        name: args.name,
                        age: args.age,
                        active: args.active,
                        date: args.date
                    },
                    {new: true}
                )
            }
        },

        deleteProfessor: {
            type: ProfessorType,
            args: {
                id: {type: GraphQLID}
            },
            resolve(parent, args){
                return Professor.findByIdAndDelete(args.id)
            }
        },

        deleteAllProfessors: {
            type: ProfessorType,
            resolve(parent, args){
                return Professor.deleteMany({})
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
})