module.exports = (sequelize, DataTypes) => {
  const User_email = sequelize.define(
    "user_email",
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "users_info",
          key: "id",
        },
      },
    },
    {
      timestamps: false,
    }
  );

  return User_email;
};
