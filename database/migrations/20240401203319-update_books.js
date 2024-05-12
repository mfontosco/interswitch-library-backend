'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.renameColumn('books', 'createdAt', 'created_at');
     await queryInterface.renameColumn('books', 'updatedAt', 'updated_at');
    
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('books', 'created_at', 'createdAt');
    await queryInterface.renameColumn('books', 'updated_at', 'updatedAt');
   
  }
};
