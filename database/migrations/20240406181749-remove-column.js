// <timestamp>-remove-columns.js

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'role');
    await queryInterface.removeColumn('users', 'department');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'role', {
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('users', 'department', {
      type: Sequelize.DataTypes.STRING,
      allowNull: true,
    });
  },
};
