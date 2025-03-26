const axios = require("axios");

// Base URL for the Fortnite API
const BASE_URL = "https://fortniteapi.io/v1";
const API_KEY = "44df1cb4-a411baef-679ef264-85520953"; // API key

/**
 * Search API by Keyword
 * @param {string} keyword - The keyword to search for.
 * @returns {Promise<Array>} - An array of search results.
 */
async function searchByKeyword(keyword) {
  try {
    // Make a GET request to the /items/list endpoint with the keyword
    const response = await axios.get(`${BASE_URL}/items/list`, {
      headers: {
        Authorization: API_KEY, // Add the API key in the headers
      },
      params: {
        search: keyword, // Pass the keyword as a query parameter
      },
    });
    // Return the list of items from the response
    return response.data.items || []; // Adjust based on the API's response structure
  } catch (error) {
    // Handle 404 errors specifically
    if (error.response && error.response.status === 404) {
      console.error("No items found for the given keyword.");
      return [];
    }
    // Log other errors
    console.error("Error searching by keyword:", error.message);
    throw error; // Re-throw the error to handle it elsewhere
  }
}

/**
 * Get Detailed Data by Unique Identifier
 * @param {string} id - The unique identifier of the item.
 * @returns {Promise<Object>} - The detailed data of the item.
 */
async function getDetailsById(id) {
  try {
    // Make a GET request to the /items/get endpoint with the item ID
    const response = await axios.get(`${BASE_URL}/items/get`, {
      headers: {
        Authorization: API_KEY, // Add the API key in the headers
      },
      params: {
        id: id, // Pass the item ID as a query parameter
      },
    });
    // Return the detailed data of the item
    return response.data; // Adjust based on the API's response structure
  } catch (error) {
    // Log an error message if the request fails
    console.error("Error fetching details by ID:", error.message);
    throw error; // Re-throw the error to handle it elsewhere
  }
}

// Example usage
(async () => {
  try {
    const results = await searchByKeyword("skin");
    console.log("Search Results:", results);
  } catch (error) {
    console.error("Error in API call:", error.message);
  }
})();

// Export the functions so they can be used in other files
module.exports = { searchByKeyword, getDetailsById };
