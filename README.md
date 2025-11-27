https://gmt-458-web-gis.github.io/geogame-cagincapraz/[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/BhShQpq1)
This project is a time-and-life limited guessing game based on the geographical knowledge of Turkish provinces. The user's goal is to identify and correctly name the hidden provinces located along pre-defined routes between major cities.
This application is designed to run without any backend server dependencies (Node.js/Python). It only requires a local HTTP server for proper data handling.

Prerequisites
Local Server: A local HTTP server (such as VS Code Live Server) must be used to bypass cross-origin restrictions when loading the GeoJSON data (tr.json).

Data File: The GeoJSON file containing the Turkish provincial boundaries (tr.json).

Style Files: Custom CSS (style.css) and the main logic (script.js).

Audio File: The background music file (sound/01. Age of War - Theme Song.mp3).

Execution Steps
Ensure all required files and folders (index.html, script.js, style.css, tr.json, sound/) are placed in the same main folder.

Open the folder in VS Code.

Right-click on index.html and select "Open with Live Server".
The game operates under a 60-second time limit and grants the player 3 lives (mistakes) per round.Game MechanicsRoute Selection: The game randomly selects one of the 9 routes defined in the internal FIXED_ROUTES list (e.g., Trabzon to Samsun).Visual Cues:Start/End Provinces: Highlighted in Blue. Their names are permanently visible on the map.Target Provinces: Highlighted in Red. Their names are hidden on the map (the core guessing element).Non-Target Provinces: Rendered as transparent (zero opacity) and are non-interactive (cannot be clicked).Gameplay: The user clicks on a highlighted province (Red) and must type the correct, exact name into the input box.Correct Guess: The province turns Green, the score increases (+10 points), and the province is removed from the target list.Incorrect Guess: The player loses one life (-1 Life).Game End ConditionsThe timer reaches zero (SÜRE: 00).The player runs out of lives (CAN: 0).The player finds all target provinces (WINS).Upon game over, the final score is displayed, along with a list of all missed target provinces for learning purposes.💻 Technical Structure and LibrariesLibraries UsedLibrary NamePurpose in ProjectScopeLeaflet.jsCore mapping functionality, drawing province borders (GeoJSON polygons), and handling map interaction events.CoreD3.js(Integrated into the project structure but currently unused for complex data visualization. Its link is maintained.)BaseCartoDB PositronUsed as a minimalist basemap (Tile Layer URL) to suppress road names and place names, forcing the player to rely only on the painted provincial boundaries.Visual EnhancementHTML <audio> ElementProvides the background music playback control, initiated by the user's first click to adhere to browser policies.ExperienceCode StructureThe game logic resides entirely within script.js. Key functionalities include:FIXED_ROUTES: A hardcoded list used to bypass complex, error-prone geographical pathfinding algorithms.getProvinceStyle(): Critically manages the opacity and color of all provinces based on the isGameActive state and whether the province is a start/end or target.updateMapVisualization(): Ensures the visual state (colors and tooltips for start/end points) is updated correctly after every action.
