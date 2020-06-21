'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    userId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    description: DataTypes.STRING
  }, {});
  Post.associate = function(models) {
    // associations can be defined here
  };
  return Post;
};