'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('aprovelists', {
      id:{
        type: Sequelize.INTEGER, 
        primaryKey: true, 
        autoIncrement: true
      },
      userId:{
        type: Sequelize.INTEGER
      },
      reason:{
        type: Sequelize.STRING
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('aprovelists');
  }
};