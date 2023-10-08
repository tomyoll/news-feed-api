const { startApp } = require("./app");
const { logger } = require("./utils/logger");

const { PORT } = require("./config");

(async () => {
  const app = await startApp();

  app.listen(PORT, () => {
    logger.system(`Server started: ${PORT} `);
  });
})();
