const axios = require("axios");

function main() {
  axios
    .post("https://api2.watttime.org/v2/register", {
      username: "iamminci",
      password: "3mgn3wbaWL%i^R0",
      email: "0xminci@gmail.com",
    })
    .then((res) => {
      console.log(`statusCode: ${res.status}`);
      console.log(`response: ${res}`);
    })
    .catch((error) => {
      console.error(error);
    });
}

if (require.main === module) {
  main();
}
