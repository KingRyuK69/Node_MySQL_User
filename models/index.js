const dbConfig = require("../config/dbConfig");
// console.log("dbConfig", dbConfig);
const { Sequelize, DataTypes } = require("sequelize"); //create a new sequelize instance uding the db configuration

const sequelize = new Sequelize(dbConfig.db, dbConfig.user, dbConfig.password, {
  host: dbConfig.host,
  dialect: dbConfig.dialect, // specifies the db type you're connecting to
  logging: false,
});

sequelize
  .authenticate() //authenticate connection to the db
  .then(() => {
    console.log("Connected".bgWhite);
  })
  .catch((err) => {
    console.log("Error" + err);
  });

const db1 = {}; //creates an empty object db1 and assigns the sequelize instance and library to it

db1.Sequelize = Sequelize; // instance
db1.sequelize = sequelize; // library

db1.users_info = require("./User_infoModel")(sequelize, DataTypes); // imports the User_infoModel and initializes it with the Sequelize instance and DataTypes library
db1.users_desc = require("./User_descModel")(sequelize, DataTypes); // imports the User_descModel and initializes it with the Sequelize instance and DataTypes library
db1.users_email = require("./User_emailModel")(sequelize, DataTypes); // imports the User_emailModel and initializes it with the Sequelize instance and DataTypes library

db1.users_info.hasMany(db1.users_desc, {
  foreignKey: "user_id",
  as: "user_desc",
});

db1.users_desc.belongsTo(db1.users_info, {
  foreignKey: "user_id",
  as: "user_info",
});

db1.users_info.hasMany(db1.users_email, {
  foreignKey: "user_id",
  as: "user_email",
});

db1.users_email.belongsTo(db1.users_info, {
  foreignKey: "user_id",
  as: "user_info",
});

module.exports = db1;
