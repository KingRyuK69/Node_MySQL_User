module.exports = (sequelize, DataTypes) => {
  const User_desc = sequelize.define(
    "user_desc",
    {
      review: {
        type: DataTypes.INTEGER,
      },
      description: {
        type: DataTypes.TEXT,
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

  return User_desc;
};
