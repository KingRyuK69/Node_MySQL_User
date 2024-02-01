module.exports = (sequelize, DataTypes) => {
  const User_info = sequelize.define(
    "user_info",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          is: {
            args: ["^[0-9]{10}$"], // regular expression for exactly 10 digits
            msg: "Incorrect Phone Number synatx",
          },
        },
      },
    },
    {
      timestamps: false,
    }
  );
  return User_info;
};
