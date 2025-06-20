"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const sequelize_1 = require("sequelize");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = require("../config/database");
class UserModel extends sequelize_1.Model {
    get _id() {
        return this.id;
    }
    async checkPassword(candidatePassword) {
        return bcryptjs_1.default.compare(candidatePassword, this.password);
    }
    static async hashPassword(user) {
        if (user.changed('password')) {
            const salt = await bcryptjs_1.default.genSalt(12);
            user.password = await bcryptjs_1.default.hash(user.password, salt);
        }
    }
    static async comparePassword(candidatePassword, hash) {
        return bcryptjs_1.default.compare(candidatePassword, hash);
    }
}
exports.UserModel = UserModel;
UserModel.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
    },
    firstName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        field: 'first_name',
    },
    lastName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        field: 'last_name',
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        field: 'password_hash',
    },
    role: {
        type: sequelize_1.DataTypes.STRING, // <-- Use STRING, not ENUM
        allowNull: false,
        defaultValue: 'risk_champion',
        field: 'role',
    },
    unit_id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: true,
    },
    is_active: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
    },
    created_at: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
    updated_at: {
        type: sequelize_1.DataTypes.DATE,
        defaultValue: sequelize_1.DataTypes.NOW,
    },
}, {
    sequelize: database_1.sequelize,
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
});
