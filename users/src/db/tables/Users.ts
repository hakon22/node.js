import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';
import { db } from '../connect.js';

interface UserModel extends Model<InferAttributes<UserModel>, InferCreationAttributes<UserModel>> {
  id: CreationOptional<number>;
  username: string;
  password: string;
  email: string;
}

const Users = db.define<UserModel>(
  'Users',
  {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
);

export default Users;