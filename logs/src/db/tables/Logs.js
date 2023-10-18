import { DataTypes } from 'sequelize';
import { db } from '../connect.js';

const Logs = db.define('Logs', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

export default Logs;
