const yargs = require("yargs"); // Import yargs for building the CLI
const { hideBin } = require("yargs/helpers"); // Helper to parse command-line arguments
const { searchFunctionality, historyFunctionality } = require("./app.js"); // Import functions from app.js

// Define the CLI commands using yargs
// Parse the command-line arguments
yargs(hideBin(process.argv))
  // Search Command
  .command(
    "search <keyword>", // Command name and required argument
    "Search for items by keyword", // Description of the command
    (yargs) => {
      yargs.positional("keyword", {
        describe: "The keyword to search for", // Explain what the keyword is
        type: "string", // Specify that the keyword must be a string
      });
    },
    async (argv) => {
      // Function to execute when the command is called
      try {
        await searchFunctionality(argv.keyword); // Call the search functionality from app.js
      } catch (error) {
        console.error("Error during search:", error.message); // Print an error message if something goes wrong
      }
    }
  )
  // History Command
  .command(
    "history <type>", // Command name and required argument
    "View search or selection history", // Description of the command
    (yargs) => {
      yargs.positional("type", {
        describe: "The type of history to view (keywords or selections)", // Explain the argument
        type: "string", // Specify that the argument must be a string
        choices: ["keywords", "selections"], // Restrict the argument to specific values
      });
    },
    async (argv) => {
      // Function to execute when the command is called
      try {
        await historyFunctionality(argv.type); // Call the history functionality from app.js
      } catch (error) {
        console.error("Error during history retrieval:", error.message); // Print an error message if something goes wrong
      }
    }
  )
  // Ensure at least one command is provided
  .demandCommand(1, "You need to specify at least one command")
  // Add a help option to display usage information
  .help().argv;
