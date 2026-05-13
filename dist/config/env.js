"use strict";
const required = (key) => {
    const value = process.env[key];
    if (!value)
        throw new Error(`Variável de ambiente ausente: ${key}`);
    return value;
};
const optional = (key, fallback = undefined) => {
    const value = process.env[key];
    return value ?? fallback;
};
module.exports = {
    required,
    optional,
};
