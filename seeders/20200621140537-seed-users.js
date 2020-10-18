'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.bulkInsert('Users', [{
      id: 1,
      name: 'User1',
      email: 'user1@example.com',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 2,
      name: 'User2',
      email: 'user2@example.com',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 3,
      name: 'User3',
      email: 'user3@example.com',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 4,
      name: 'User4',
      email: 'user4@example.com',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 5,
      name: 'User5',
      email: 'user5@example.com',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    queryInterface.bulkInsert('Posts', [{
      id: 1,
      title: 'NodeJS',
      description: 'Cool!',
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 2,
      title: 'Rails',
      description: 'Super Cool',
      userId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 3,
      title: 'React',
      description: 'Very nice framework',
      userId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    return queryInterface.bulkInsert('Comments', [{
      id: 1,
      postId: 1,
      userId: 2,
      comment: "Great work!",
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 2,
      postId: 1,
      userId: 3,
      comment: "Great great work!!",
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 3,
      postId: 1,
      userId: 4,
      comment: "Great great great work!!!",
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 4,
      postId: 2,
      userId: 5,
      comment: "pow(Great, 5) work!",
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },
};
