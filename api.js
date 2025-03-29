import axios from "axios"; // Import axios for making HTTP requests

// Base URL for the Fortnite API
const BASE_URL = "https://fortniteapi.io/v2";
const API_KEY = "44df1cb4-a411baef-679ef264-85520953"; // Replace with your actual API key

// Function to search by keyword
export async function searchByKeyword(keyword) {
  try {
    const response = await axios.get(`${BASE_URL}/items/list`, {
      headers: { Authorization: API_KEY }, // Add the API key in the headers
      params: { search: keyword }, // Pass the keyword as a query parameter
    });

    // Check if the response contains the expected 'items' property
    if (response.data && typeof response.data.items === "object") {
      // Flatten the items object into a single array
      const items = Object.values(response.data.items).flat();
      // Filter items to include only those with names matching the keyword
      const filteredItems = items.filter((item) =>
        item.name.toLowerCase().includes(keyword.toLowerCase())
      );
      return filteredItems; // Return the flattened array of items
    } else {
      console.error("Unexpected response format:", response.data);
      return []; // Return an empty array if the response format is unexpected
    }
  } catch (error) {
    console.error("Error searching by keyword:", error.message);
    throw error; // Re-throw the error to handle it elsewhere
  }
}

// Function to get details by ID
export async function getDetailsById(id) {
  try {
    const response = await axios.get(`${BASE_URL}/items/get`, {
      headers: { Authorization: API_KEY }, // Add the API key in the headers
      params: { id }, // Pass the item ID as a query parameter
    });
    return response.data.item || {}; // Return the detailed data of the item
  } catch (error) {
    console.error("Error fetching details by ID:", error.message); // Log an error message
    throw error; // Re-throw the error to handle it elsewhere
  }
}
