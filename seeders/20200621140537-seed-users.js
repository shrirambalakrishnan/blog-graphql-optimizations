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
    }]);

    return queryInterface.bulkInsert('Posts', [{
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
    }]);
  },
};
