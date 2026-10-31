const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'mysql' 
});

// 1. Define Student Model
const Student = sequelize.define('Student', {
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  }
});

// 2. Define Course Model
const Course = sequelize.define('Course', {
  title: { 
    type: DataTypes.STRING, 
    allowNull: false 
  }
});

// 3. Define Many-to-Many Association
// This automatically creates a junction table named 'StudentCourses'
Student.belongsToMany(Course, { through: 'StudentCourses' });
Course.belongsToMany(Student, { through: 'StudentCourses' });

module.exports = { sequelize, Student, Course };