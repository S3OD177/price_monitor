const { Client, Databases } = require("node-appwrite");
const fs = require('fs');

const client = new Client()
    .setEndpoint("https://fra.cloud.appwrite.io/v1")
    .setProject("691cea5d0001ae1c3ee1")
    .setKey("standard_1c7e07619f86c93c4006a54115092e827824723d6366e63530bcc485c6f06292f5a0e76905617c872f5e457db7d3b68409f4392943b015282349d901e676c12c42a961fcf0eedf4bc93dbd19b24220ac2e17377f4085737aa9cbe4e62526900110d4b673f888237664b40203fe7dd1c7492b8709e7ec855443f77a4d0643e3b9");

const databases = new Databases(client);
const DATABASE_ID = "691cf9b7003980f9976f";

async function getIds() {
    try {
        const collections = await databases.listCollections(DATABASE_ID);

        let output = `NEXT_PUBLIC_APPWRITE_DATABASE_ID=${DATABASE_ID}\n`;

        collections.collections.forEach(col => {
            if (col.name === "Products") {
                output += `NEXT_PUBLIC_APPWRITE_COLLECTION_PRODUCTS=${col.$id}\n`;
            } else if (col.name === "Competitors") {
                output += `NEXT_PUBLIC_APPWRITE_COLLECTION_COMPETITORS=${col.$id}\n`;
            } else if (col.name === "PriceHistory") {
                output += `NEXT_PUBLIC_APPWRITE_COLLECTION_PRICES=${col.$id}\n`;
            }
        });

        fs.writeFileSync('ids.txt', output);
        console.log("IDs written to ids.txt");

    } catch (error) {
        console.error("Error fetching IDs:", error);
    }
}

getIds();
