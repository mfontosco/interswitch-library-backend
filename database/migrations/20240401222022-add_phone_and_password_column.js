'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'phone', {
      type: Sequelize.STRING,
      allowNull: false
    });
    await queryInterface.addColumn('users', 'confirm_password', {
      type: Sequelize.STRING,
      allowNull: false
    });
  },

  down: async (queryInterface, Sequelize) => {
  
    await queryInterface.removeColumn('users', 'phone');
    await queryInterface.removeColumn('users', 'confirm_password');
  }
};
