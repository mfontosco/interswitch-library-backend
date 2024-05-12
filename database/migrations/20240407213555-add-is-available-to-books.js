'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('books', 'is_available', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true 
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('books', 'is_available');
  }
};
