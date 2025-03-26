const fs = require("fs"); // Import file system module for reading/writing files
const path = require("path"); // Import path module for handling file paths
const inquirer = require("inquirer"); // Import inquirer for user-friendly prompts
const { searchByKeyword, getDetailsById } = require("./api.js"); // Import API functions

// File paths for storing history
const keywordHistoryPath = path.join(__dirname, "search_history_keyword.json");
const selectionHistoryPath = path.join(
  __dirname,
  "search_history_selection.json"
);

// Helper function to read JSON files
function readHistory(filePath) {
  if (fs.existsSync(filePath)) {
    return JSON.parse(fs.readFileSync(filePath, "utf-8")); // Read and parse JSON file
  }
  return []; // Return an empty array if the file doesn't exist
}

// Helper function to write to JSON files
function writeHistory(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2)); // Write data to JSON file
}

// Search Functionality
async function searchFunctionality(keyword) {
  try {
    if (!keyword || keyword.trim() === "") {
      console.log("Please enter a valid keyword."); // Inform the user
      return;
    }

    // Save keyword to history if it's not already there
    const keywordHistory = readHistory(keywordHistoryPath);
    if (!keywordHistory.includes(keyword)) {
      keywordHistory.push(keyword); // Add keyword to history
      writeHistory(keywordHistoryPath, keywordHistory); // Save updated history
    }

    // Search the API using the keyword
    const results = await searchByKeyword(keyword);
    if (results.length === 0) {
      console.log("No results found."); // Inform the user if no results are found
      return;
    }

    // Add "Back" as the first option in the list
    const { selectedItem } = await inquirer.prompt([
      {
        type: "list",
        name: "selectedItem",
        message: "Select an item:",
        choices: [
          { name: "Back", value: "back" }, // Add a "Back" option
          ...results.map((item) => ({
            name: `${item.name} (${item.rarity})`, // Display item name and rarity
            value: item.id, // Use item ID as the value
          })),
        ],
      },
    ]);

    if (selectedItem === "back") {
      return; // Return to the previous menu
    }

    // Save the selected item to history if it's not already there
    const selectionHistory = readHistory(selectionHistoryPath);
    if (!selectionHistory.includes(selectedItem)) {
      selectionHistory.push(selectedItem); // Add selected item to history
      writeHistory(selectionHistoryPath, selectionHistory); // Save updated history
    }

    // Get and display details of the selected item
    const details = await getDetailsById(selectedItem);
    console.log("Item Details:", {
      Name: details.name,
      Description: details.description,
      Rarity: details.rarity,
      Type: details.type,
    });
  } catch (error) {
    console.error("Error during search functionality:", error.message); // Handle errors
  }
}

// History functionality
async function historyFunctionality(type) {
  try {
    // Read the appropriate history file (keywords or selections)
    const history =
      type === "keywords"
        ? readHistory(keywordHistoryPath)
        : readHistory(selectionHistoryPath);

    if (history.length === 0) {
      console.log("No history found."); // Inform the user if history is empty
      return;
    }

    // Add "Back" and "Exit" as the first options in the list
    const choices = ["Back", "Exit", ...history];

    // Display a list of history items for the user to select
    const { selectedHistory } = await inquirer.prompt([
      {
        type: "list",
        name: "selectedHistory",
        message: `Select a ${type === "keywords" ? "keyword" : "selection"}:`,
        choices,
      },
    ]);

    if (selectedHistory === "Back") {
      return; // Return to the previous menu
    }

    if (selectedHistory === "Exit") {
      console.log("Exiting..."); // Exit if the user selects "Exit"
      return;
    }

    // If a keyword is selected, perform search functionality
    if (type === "keywords") {
      await searchFunctionality(selectedHistory);
    }

    // If a selection is selected, fetch and display its details
    if (type === "selections") {
      const details = await getDetailsById(selectedHistory);
      console.log("Item Details:", {
        Name: details.name,
        Description: details.description,
        Rarity: details.rarity,
        Type: details.type,
      });
    }
  } catch (error) {
    console.error("Error during history functionality:", error.message); // Handle errors
  }
}

// Main function to handle user input
async function main() {
  const { action } = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "What would you like to do?", // Ask the user what they want to do
      choices: [
        { name: "Search for items", value: "search" },
        { name: "View keyword history", value: "keywords" },
        { name: "View selection history", value: "selections" },
        { name: "Exit", value: "exit" },
      ],
    },
  ]);

  // Handle the user's choice
  if (action === "search") {
    const { keyword } = await inquirer.prompt([
      {
        type: "input",
        name: "keyword",
        message: "Enter a keyword to search:", // Ask the user for a keyword
      },
    ]);
    await searchFunctionality(keyword); // Perform search functionality
  } else if (action === "keywords") {
    await historyFunctionality("keywords"); // View keyword history
  } else if (action === "selections") {
    await historyFunctionality("selections"); // View selection history
  } else if (action === "exit") {
    console.log("Goodbye!"); // Exit the app
  }
}

// Run the app
main();

module.exports = { searchFunctionality, historyFunctionality };
