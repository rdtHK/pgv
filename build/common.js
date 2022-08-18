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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChangeFile = exports.runChanges = exports.initDb = exports.compareFileTimestamp = exports.nameWithTimestamp = exports.SEED_DIR = exports.MIGRATION_DIR = exports.DB_DIR = void 0;
var ora_1 = __importDefault(require("ora"));
var fs_1 = require("fs");
var path = __importStar(require("path"));
var pg_1 = require("pg");
exports.DB_DIR = path.join(process.cwd(), 'database');
exports.MIGRATION_DIR = path.join(exports.DB_DIR, 'migration');
exports.SEED_DIR = path.join(exports.DB_DIR, 'seed');
function nameWithTimestamp(name) {
    var date = new Date();
    var year = date.getUTCFullYear();
    var month = date.getUTCMonth();
    var day = date.getUTCDate();
    var hour = date.getUTCHours();
    var minute = date.getUTCMinutes();
    var second = date.getUTCSeconds();
    return "".concat(year).concat(month).concat(day).concat(hour).concat(minute).concat(second, "_").concat(name, ".sql");
}
exports.nameWithTimestamp = nameWithTimestamp;
function compareFileTimestamp(f1, f2) {
    var ts1 = f1.split('_', 2)[0];
    var ts2 = f2.split('_', 2)[0];
    return parseInt(ts1) - parseInt(ts2);
}
exports.compareFileTimestamp = compareFileTimestamp;
function initDb(client, table) {
    return __awaiter(this, void 0, void 0, function () {
        var ddl, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 6]);
                    return [4 /*yield*/, client.query('BEGIN')];
                case 1:
                    _a.sent();
                    ddl = "\n      CREATE TABLE IF NOT EXISTS ".concat(table, " (\n        id SERIAL NOT NULL PRIMARY KEY,\n        file TEXT NOT NULL,\n        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP\n      );\n    ");
                    return [4 /*yield*/, client.query(ddl)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, client.query('END')];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4:
                    error_1 = _a.sent();
                    return [4 /*yield*/, client.query('ROLLBACK')];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.initDb = initDb;
function runChanges(dir, table, label) {
    return __awaiter(this, void 0, void 0, function () {
        var client, spinner, dirFilenames, sql, result, dbFilenames, _i, dirFilenames_1, filename, fileFullPath, fileSql, sql_1, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    client = new pg_1.Client();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 12, 13, 15]);
                    console.log("Running ".concat(label, "..."));
                    // Open the connection
                    return [4 /*yield*/, client.connect()];
                case 2:
                    // Open the connection
                    _a.sent();
                    // Initialize the database (if needed)
                    return [4 /*yield*/, initDb(client, table)];
                case 3:
                    // Initialize the database (if needed)
                    _a.sent();
                    return [4 /*yield*/, fs_1.promises.readdir(dir)];
                case 4:
                    dirFilenames = _a.sent();
                    // Sort them by timestamp
                    dirFilenames.sort(compareFileTimestamp);
                    sql = "\n      SELECT file\n      FROM ".concat(table, "\n      WHERE\n        file = ANY ($1)\n    ");
                    return [4 /*yield*/, client.query(sql, [dirFilenames])];
                case 5:
                    result = _a.sent();
                    dbFilenames = new Set(result.rows.map(function (row) { return row.file; }));
                    _i = 0, dirFilenames_1 = dirFilenames;
                    _a.label = 6;
                case 6:
                    if (!(_i < dirFilenames_1.length)) return [3 /*break*/, 11];
                    filename = dirFilenames_1[_i];
                    if (!!dbFilenames.has(filename)) return [3 /*break*/, 10];
                    spinner = (0, ora_1.default)(filename).start();
                    fileFullPath = path.join(dir, filename);
                    return [4 /*yield*/, fs_1.promises.readFile(fileFullPath)];
                case 7:
                    fileSql = (_a.sent()).toString();
                    return [4 /*yield*/, client.query(fileSql)];
                case 8:
                    _a.sent();
                    sql_1 = "INSERT INTO ".concat(table, "(file) VALUES($1)");
                    return [4 /*yield*/, client.query(sql_1, [filename])];
                case 9:
                    _a.sent();
                    spinner.stopAndPersist({
                        symbol: '✔️',
                    });
                    _a.label = 10;
                case 10:
                    _i++;
                    return [3 /*break*/, 6];
                case 11: return [3 /*break*/, 15];
                case 12:
                    error_2 = _a.sent();
                    // If the changes directory does not exist, just returns.
                    if (error_2.code === 'ENOENT') {
                        return [2 /*return*/];
                    }
                    if (spinner) {
                        spinner.stopAndPersist({
                            symbol: '❌',
                        });
                    }
                    console.error("Error running ".concat(label, ": "));
                    console.error(error_2);
                    return [3 /*break*/, 15];
                case 13: 
                // Close the connection
                return [4 /*yield*/, client.end()];
                case 14:
                    // Close the connection
                    _a.sent();
                    return [7 /*endfinally*/];
                case 15: return [2 /*return*/];
            }
        });
    });
}
exports.runChanges = runChanges;
function createChangeFile(dir, name, label) {
    return __awaiter(this, void 0, void 0, function () {
        var fullName, fullPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs_1.promises.mkdir(dir, { recursive: true })];
                case 1:
                    _a.sent();
                    fullName = nameWithTimestamp(name);
                    fullPath = path.join(dir, fullName);
                    return [4 /*yield*/, fs_1.promises.writeFile(fullPath, '', {
                            flag: 'wx',
                        })];
                case 2:
                    _a.sent();
                    console.log("New ".concat(label, " file created at '").concat(fullPath, "'"));
                    return [2 /*return*/];
            }
        });
    });
}
exports.createChangeFile = createChangeFile;
//# sourceMappingURL=common.js.map