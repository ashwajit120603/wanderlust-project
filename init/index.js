const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");


const MONGO_URL = process.env.ATLASDB_URL;

main()
.then(()=>{
   console.log("connected to db");

})
.catch((err)=>{
   console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});

  const listings = initData.data.map((obj) => ({
    ...obj,
    owner: "67b58c4c504c963ef5b62175",
  }));

  await Listing.insertMany(listings);

  console.log("data was initialized");
};
initDB();
