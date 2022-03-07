'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('requestComand', {
      id:{
        type: Sequelize.INTEGER, 
        primaryKey: true, 
        autoIncrement: true
      },
      userId:{
        type:Sequelize.INTEGER
      },
      comandId:{
        type:Sequelize.INTEGER
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('requestComand');
  }
};