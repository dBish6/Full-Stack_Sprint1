const moment = require("moment");

const dateNow = moment().format("YYYY-MM-DD");
const expireDate = moment().add(4, "days").format("YYYY-MM-DD");
console.log(dateNow);
console.log(expireDate);
