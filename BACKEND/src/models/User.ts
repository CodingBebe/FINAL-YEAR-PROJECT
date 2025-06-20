import { DataTypes, Model, Optional } from 'sequelize';
import bcrypt from 'bcryptjs';
import { sequelize } from '../config/database';

export type UserRole =
  | "admin"
  | "risk_coordinator"
  | "steering committe"
  | "risk_champion"
  | "deputy_vice_chancellor"
  | "vice_chancellor";

interface UserAttributes {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  unit_id: string | null;
  avatar?: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

interface UserCreationAttributes
  extends Optional<UserAttributes, 'id' | 'avatar' | 'is_active' | 'created_at' | 'updated_at'> {}

export class UserModel extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public password!: string;
  public role!: UserRole;
  public unit_id!: string | null;
  public avatar!: string | null;
  public is_active!: boolean;
  public created_at!: Date;
  public updated_at!: Date;

  public get _id(): string {
    return this.id;
  }

  public async checkPassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }

  public static async hashPassword(user: UserModel): Promise<void> {
    if (user.changed('password')) {
      const salt = await bcrypt.genSalt(12);
      user.password = await bcrypt.hash(user.password, salt);
    }
  }

  public static async comparePassword(candidatePassword: string, hash: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, hash);
  }
}

UserModel.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'first_name',
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'last_name',
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'password_hash',
    },
    role: {
      type: DataTypes.STRING, // <-- Use STRING, not ENUM
      allowNull: false,
      defaultValue: 'risk_champion',
      field: 'role',
    },
    unit_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    hooks: {
      beforeCreate: UserModel.hashPassword,
      beforeUpdate: UserModel.hashPassword,
    },
    defaultScope: {
      where: {
        is_active: true,
      },
      attributes: {
        exclude: ['password'],
      },
    },
    scopes: {
      withPassword: {
        attributes: {
          include: ['password'],
        },
      },
    },
  }
);