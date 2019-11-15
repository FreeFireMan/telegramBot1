module.exports = (sequelize, DataTypes) => {
    return sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        data_id: {
            type: DataTypes.INTEGER,
            unique: true,
            allowNull: false
        },
        first_name: {
            type: DataTypes.STRING
        },
        last_name: {
            type: DataTypes.STRING
        },
        phone_number: {
            type: DataTypes.STRING,
            unique: true
        },
        is_admin: {
            type: DataTypes.BOOLEAN
        }
    }, {
        tableName: 'user',
        timestamps: false
    });
};
