"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiskModel = void 0;
exports.countRisksByPrefix = countRisksByPrefix;
const mongoose_1 = __importStar(require("mongoose"));
const RiskSchema = new mongoose_1.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    riskId: { type: String },
    strategicObjective: { type: String, required: true },
    description: { type: String },
    principalOwner: { type: String },
    supportingOwners: [{ type: String }],
    category: { type: String },
    likelihood: { type: String },
    impact: { type: String },
    causes: { type: String },
    consequences: { type: String },
    existingControls: { type: String },
    proposedMitigation: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
RiskSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});
exports.RiskModel = mongoose_1.default.models.Risk || mongoose_1.default.model('Risk', RiskSchema);
async function countRisksByPrefix(db, prefix) {
    return await exports.RiskModel.countDocuments({ id: { $regex: `^${prefix}` } });
}
