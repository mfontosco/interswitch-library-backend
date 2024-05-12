'use strict';

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        },
        is_admin: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          unique: false,
          defaultValue:false
        },
        otp: {
          type: DataTypes.INTEGER,
          allowNull: true,
          unique: false,
      },
        phone: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        confirm_password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        // phone: {
        //     type: DataTypes.STRING,
        //     allowNull: false,
        //     validate: {
        //         len: {
        //             args: [11, 20],
        //             msg: 'Phone number must be between 11 to 20 characters',
        //         },
        //     },
        // },
        // active: {
        //     type: DataTypes.BOOLEAN,
        //     defaultValue: true,
        // },
    }, {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at',
        tableName: 'users',
        timestamps: true,
        paranoid: true,
        underscored: true,
    });

    User.associate = (models) => {
    };

    return User;
};
