const { Sequelize } = require("sequelize");

const options = {
  logging: false
};

let sequelize;
if (process.env.NODE_ENV === "test") {
  // 🔹 Base de datos en memoria solo para pruebas
  sequelize = new Sequelize("sqlite::memory:", options);
} else {
  sequelize = new Sequelize(process.env.DATABASE_URL, options);
}

module.exports = sequelize;
