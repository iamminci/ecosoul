const { uploadImages } = require("./uploadImages");
const { generateMetadata } = require("./generateMetadata");
const { uploadMetadata } = require("./uploadMetadata");

async function main() {
  await uploadImages();
  await generateMetadata();
  await uploadMetadata();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
