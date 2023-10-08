/* eslint-disable padding-line-between-statements */
const resetColor = `\u001b[0m`;

/**
 * @type {{
 *  black: String, yellow: String, cyan: String,
 *  red: String, blue: String, white: String,
 *  green: String, magenta: String
 * }}
 */
const colorMap = Object.freeze(
  (() => {
    const _map = Object.create(null);

    _map.black = `\u001b[30;1m`;
    _map.red = `\u001b[31;1m`;
    _map.green = `\u001b[32;1m`;
    _map.yellow = `\u001b[33;1m`;
    _map.blue = `\u001b[34;1m`;
    _map.magenta = `\u001b[35;1m`;
    _map.cyan = `\u001b[36;1m`;
    _map.white = `\u001b[37;1m`;

    _map.RESET = `\u001b[0m`;

    return _map;
  })()
);

/**
 * @type {{ bold: String, underline: String, reversed: String}}
 */
const styleMap = Object.freeze(
  (() => {
    const _map = Object.create(null);

    _map.bold = `\u001b[1m`;
    _map.underline = `\u001b[4m`;
    _map.reversed = `\u001b[7m`;

    return _map;
  })()
);

/**
 * @type {{
 *  bgBlack: String, bgYellow: String, bgCyan: String,
 *  bgRed: String, bgBlue: String, bgWhite: String,
 *  bgGreen: String, bgMagenta: String
 * }}
 */
const bgColorMap = Object.freeze(
  (() => {
    const _map = Object.create(null);
    _map.bgBlack = `\u001b[40;1m`;
    _map.bgRed = `\u001b[41;1m`;
    _map.bgGreen = `\u001b[42;1m`;
    _map.bgYellow = `\u001b[43;1m`;
    _map.bgBlue = `\u001b[44;1m`;
    _map.bgMagenta = `\u001b[45;1m`;
    _map.bgCyan = `\u001b[46;1m`;
    _map.bgWhite = `\u001b[47;1m`;

    return _map;
  })()
);

/**
 * @type {{
 *  POST: String, PUT: String, DELETE: String,
 *  OPTIONS: String, HEAD: String
 * }}
 */
const methodsMap = Object.freeze(
  (() => {
    const _map = Object.create(null);

    _map.GET = `${bgColorMap.bgGreen} ${styleMap.bold}${colorMap.white}GET ${resetColor}`;
    _map.POST = `${bgColorMap.bgMagenta} ${styleMap.bold}${colorMap.white}POST ${resetColor}`;
    _map.PUT = `${bgColorMap.bgYellow} ${styleMap.bold}${colorMap.black}PUT ${resetColor}`;
    _map.DELETE = `${bgColorMap.bgRed} ${styleMap.bold}${colorMap.white}DELETE ${resetColor}`;
    _map.OPTIONS = `${bgColorMap.bgCyan} ${styleMap.bold}${colorMap.black}OPTIONS ${resetColor}`;
    _map.HEAD = `${bgColorMap.bgBlue} ${styleMap.bold}${colorMap.black}HEAD ${resetColor}`;

    return _map;
  })()
);

/**
 * @type {{
 *   "~200": function(String): String,
 *   "~300": function(String): String,
 *   "~400": function(String): String,
 *   "~500": function(String): String,
 * }}
 */
const statusMap = Object.freeze(
  (() => {
    const _map = Object.create(null);

    _map["~100"] = (status) => `${colorMap.white}${status}${resetColor}`;
    _map["~200"] = (status) => `${colorMap.green}${status}${resetColor}`;
    _map["~300"] = (status) => `${colorMap.magenta}${status}${resetColor}`;
    _map["~400"] = (status) => `${colorMap.yellow}${status}${resetColor}`;
    _map["~500"] = (status) => `${colorMap.red}${status}${resetColor}`;

    return _map;
  })()
);

/**
 * Morgan custom formatter
 * @type {import('morgan').FormatFn}
 */
module.exports.morganTokenFormatter = (tokens, req, res) => {
  function status() {
    const statusCategory =
      (res.statusCode >= 500 && "~500") ||
      (res.statusCode >= 400 && `~400`) ||
      (res.statusCode >= 300 && `~300`) ||
      (res.statusCode >= 200 && `~200`) ||
      `~100`;

    // @ts-ignore
    return statusMap[statusCategory](tokens.status(req, res));
  }

  function url() {
    // @ts-ignore
    const [base, query] = tokens.url(req, res).split("?");

    return `${base}${
      query && query.length
        ? `${styleMap.bold}?${resetColor}${query
            .split("&")
            .map((keyValue) => {
              const [key, value] = keyValue.split("=");
              return `${colorMap.blue}${styleMap.bold}${key}${resetColor}=${
                value
                  ? `${styleMap.reversed}${colorMap.yellow} ${value} ${resetColor}`
                  : ""
              }`;
            })
            .join("&")}${resetColor}`
        : ""
    }`;
  }

  function method() {
    // @ts-ignore
    return methodsMap[tokens.method(req, res)];
  }

  function responseTime() {
    // @ts-ignore
    return `[${styleMap.bold}${tokens["response-time"](
      req,
      res
    )}${resetColor} ms]`;
  }

  function contentLength() {
    return `${styleMap.bold}${
      tokens.res(req, res, "content-length") || "??"
    }${resetColor} bytes`;
  }

  // @ts-ignore
  return [
    method(),
    status(),
    responseTime(),
    `\t❱ `,
    url(),
    ` ❱ `,
    contentLength(),
  ].join(" ");
};
