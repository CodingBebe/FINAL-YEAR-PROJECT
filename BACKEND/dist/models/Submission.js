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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const SubmissionSchema = new mongoose_1.Schema({
    riskId: { type: String, required: true },
    riskTitle: { type: String, required: true },
    timePeriod: { type: String, required: true },
    year: { type: String, required: true },
    principalOwner: { type: String, required: true },
    unit_id: { type: String, required: true },
    supportingOwner: { type: String, required: true },
    strategicObjective: { type: String, required: true },
    targets: [
        {
            target: String,
            achievement: String,
            status: String,
        },
    ],
    severity: { type: String, required: true },
    likelihood: { type: Number, required: true },
    impact: { type: Number, required: true },
    rating: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    quarterDate: { type: Date, default: Date.now },
    dimensions: {
        unit_id: String,
        principalOwner: String,
        severity: String,
    },
}, {
    timeseries: {
        timeField: 'quarterDate',
        metaField: 'dimensions',
        granularity: 'hours',
    },
    strict: false,
});
exports.default = mongoose_1.default.model('Submission', SubmissionSchema);
