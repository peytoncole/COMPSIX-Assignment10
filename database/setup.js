const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, process.env.DB_NAME),
  logging: false
});

// ---------- MODELS ----------

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },

  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'employee',
    validate: {
      isIn: [['employee', 'manager', 'admin']]
    }
  }
});

const Task = sequelize.define('Task', {
  title: DataTypes.STRING,
  description: DataTypes.STRING,
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending'
  }
});

// -------- RELATIONSHIPS --------
User.hasMany(Task);
Task.belongsTo(User);

// -------- SYNC DATABASE --------
(async () => {
  await sequelize.sync({ force: true });
  console.log("Database setup complete.");
  process.exit();
})();

module.exports = { sequelize, User, Task };
