'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('role', {
      id:{
        type: Sequelize.INTEGER, 
        primaryKey: true, 
        autoIncrement:true
      },
      userRole:{
        type: Sequelize.STRING
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('role');
  }
};