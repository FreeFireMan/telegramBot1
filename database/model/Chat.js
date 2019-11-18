module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Chat', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        chat_id: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        chat_title: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        tableName: 'chat',
        timestamps: false
    });
};
