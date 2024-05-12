'use strict';

module.exports = (sequelize, DataTypes) => {
    const Book = sequelize.define('Book', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        isbn: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
        },
        author: {
            type: DataTypes.STRING,
            allowNull: false,

        },
        genre: {
            type: DataTypes.STRING,
            allowNull: false,

        },
        image_url: {
            type: DataTypes.STRING,
            allowNull: false,

        },
        is_available: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        // deletedAt: 'deleted_at',
        tableName: 'books',
        timestamps: true,
        paranoid: true,
        underscored: true,
    });

    Book.associate = (models) => {
    };

    return Book;
};
//isBorrowed
//isFeatured