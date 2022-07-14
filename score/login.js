const axios = require("axios");

function main() {
  const config = {
    headers: {
      Authorization: "Basic aWFtbWluY2k6M21nbjN3YmFXTCVpXlIw",
    },
  };

  axios
    .get("https://api2.watttime.org/v2/")
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
