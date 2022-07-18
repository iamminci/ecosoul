const fs = require("fs");

// fetch grid emissions from particular location
function fetchGridEmissions() {
  const file = fs.readFileSync("location.json");
  const data = JSON.parse(file);
  const locations = data.providerLocations;

  // {
  //   "provider": "f01000",
  //   "region": "NA-US-SOUTH-VA",
  //   "long": -77.2481,
  //   "lat": 38.6583,
  //   "numLocations": 2,
  //   "country": "US",
  //   "subdiv1": "VA",
  //   "delegate": "f0152337"
  // },

  const emissions = locations.map(({ long, lat }) => {});

  const latitude = locations[0].lat;
  const longitude = locations[0].long;

  const token =
    "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6ImJhc2ljIiwiaWF0IjoxNjU3NTk5MDIxLCJleHAiOjE2NTc2MDA4MjEsImlzcyI6IldhdHRUaW1lIiwic3ViIjoiaWFtbWluY2kifQ.RimBxxh846Zy48NvwDqAksqeZWRM0ixPtWz7OPJrszebgg9jdDnSOnHiGp9M-W-GQ7k0BA4buHYmmFCkbI_X1XCZwHNgwYfT3qa4iaWEL-dorkLIXYuy5SeXAdtXqg8SwRn3LXgnSkfadoQHBWpwfSEvDUFJzIP8Tfw2ZM6QzPGnV5zySh-m3cna8WWWrJ8cbN1K3S9KrC4MbCDtykczCQdP21mPy8dWaBBX8TBp8WAceHLaJv93SL0QCXiVpS0LkZH6UY7rbnVkAyrt2oaX7ZucM8XSd2Bs-rxJgDtj_exzH_uYDTb1rXC8MYVZyY_NtsORD2XM74f97nlKmFSPfA";

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  axios
    .get(
      `https://api2.watttime.org/v2/data?latitude=${latitude}&longitude=${longitude}`,
      config
    )
    .then((res) => {
      console.log(`statusCode: ${res.status}`);
      console.log(`response body: ${res.body}`);

      const data = res.body[0];
      const moer = data.value;
    })
    .catch((error) => {
      console.error(error);
    });

  // [
  //   {
  //     "point_time": "2022-07-12T04:10:00Z",
  //     "value": "927",
  //     "frequency": 300,
  //     "market": "RTM",
  //     "ba": "CAISO_NORTH",
  //     "datatype": "MOER",
  //     "version": "3.0"
  //   }
  // ]
}

if (require.main === module) {
  fetchGridEmissions();
}

module.exports = { fetchGridEmissions };
