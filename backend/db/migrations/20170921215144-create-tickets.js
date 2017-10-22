'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('tickets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      route: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.FLOAT
      },
      userName: {
        type: Sequelize.STRING
      },
      postDate: {
        type: Sequelize.DATEONLY
      },
      departureTime: {
        type: Sequelize.DATE
      },
      arrivalTime: {
        type: Sequelize.DATE
      },
      link: {
        type: Sequelize.STRING,
        unique: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('tickets');
  }
};
