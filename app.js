const helmet = require('helmet');
const morgan = require('morgan');
const express = require('express');

const { morganTokenFormatter } = require('./utils/logger/morganFormatter');

require('dotenv').config();

module.exports = {
  startApp: async () => {
    const app = express();

    // @ts-ignore
    app.use(helmet());

    app.use(express.json({ strict: false, limit: '50mb' }));

    app.use(express.urlencoded({ extended: false, limit: '50mb' }));

    app.use(morgan(morganTokenFormatter));

    return app;
  },
};
