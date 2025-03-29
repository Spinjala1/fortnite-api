import { searchByKeyword, getDetailsById } from "./api.js";

// Example usage for testing purposes
(async () => {
  try {
    const results = await searchByKeyword("skin");
    console.log("Search Results:", results);

    if (results.length > 0) {
      const details = await getDetailsById(results[0].id);
      console.log("Item Details:", details);
    }
  } catch (error) {
    console.error("Error in API call:", error.message);
  }
})();
