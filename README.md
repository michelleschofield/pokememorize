# Pokememorize

### A web application for pokemon fans who want to memorize pokemon facts

### Why I built this

I wished to gain familiarity with the pokemon franchise

### Technologies used in this project

- Postgresql
- Express
- React
- Node
- Tailwind CSS
- PokeApi https://pokeapi.co/docs/v2#google_vignette

### Live demo

Try the application live at http://ec2-3-134-57-218.us-east-2.compute.amazonaws.com/

### Features

- Users can create study sets of pokemon they'd like to memorize
- Users can study their pokemon as flashcards
- Users can study their pokemon with a matching game
- Users can study their pokemon with a memory game
- Users can share their study sets with other users
- Users can view a scoreboard with the best scores for each study set

### Stretch Features I Might Like to Implement

- Allow users to share their scores on social media
- Add an asteroid game

### Getting Started

1. Clone the repository.

   ```shell
   git clone https://github.com/Learning-Fuze/sgt-react
   cd sgt-react
   ```

1. Install all dependencies with NPM.

   ```shell
   npm install
   ```

1. Import the starting database to PostgreSQL.

   ```shell
   createdb sgtDb
   npm run db:import
   ```

1. Start the project. Once started you can view the application by opening http://localhost:5173 in your browser.

   ```shell
   npm run dev
   ```
