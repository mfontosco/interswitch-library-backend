'use strict';

module.exports = (sequelize, DataTypes) => {
    const Borrowing = sequelize.define('Borrowing', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        user_id: {
          type: DataTypes.INTEGER,
          references: { model: 'User', key: 'id' }
        },
        book_id: {
          type: DataTypes.INTEGER,
          references: { model: 'Book', key: 'id' }
        }, 
        returned: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
         borrowing_date: {
          type: DataTypes.DATE,
          allowNull: false
        },
  },
        {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        tableName: 'Borrowings',
        timestamps: true,
        paranoid: true,
        underscored: true,
    });

    Borrowing.associate = (models) => {
      Borrowing.belongsTo(models.User, { foreignKey: 'userId' });
      Borrowing.belongsTo(models.Book, { foreignKey: 'bookId' });
    };

    return Borrowing;
};
//isBorrowed
//isFeatured