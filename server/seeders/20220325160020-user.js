'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles', [
      {userRole:"USER",createdAt:new Date(Date.now()),updatedAt:new Date(Date.now()) },
      {userRole:"MANAGER",createdAt:new Date(Date.now()),updatedAt:new Date(Date.now()) },
      {userRole:"ADMIN",createdAt:new Date(Date.now()),updatedAt:new Date(Date.now()) },
  ]);
    await queryInterface.bulkInsert('users', [
      { email: 'admin@gmail.com', password: await bcrypt.hash('123456789', 5),login:'Admin',roleId:3,createdAt:new Date(Date.now()),updatedAt:new Date(Date.now())},
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  }
};
