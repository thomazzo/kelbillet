'use strict';
module.exports = (sequelize, DataTypes) => {
  var tickets = sequelize.define('tickets', {
    route: DataTypes.STRING,
    price: DataTypes.FLOAT,
    userName: DataTypes.STRING,
    postDate: DataTypes.DATEONLY,
    departureTime: DataTypes.DATE,
    arrivalTime: DataTypes.DATE,
    link: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return tickets;
};