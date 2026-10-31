const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'mysql' // or your database dialect
});

// Define User Model
const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false }
});

// Define Post Model
const Post = sequelize.define('Post', {
  title: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false }
});

// Define One-to-Many Association
User.hasMany(Post, { foreignKey: 'userId' });
Post.belongsTo(User, { foreignKey: 'userId' });

module.exports = { sequelize, User, Post };