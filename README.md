# spider-solitaire

### Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### App uses JSON Server for fake API so it needs to be installed
```
yarn add json-server
```

### In the root folder of the app you will find db.json file, so to run server type:
```
json-server db.json
```

### Technologies used
- Webpack
- Vue
- Vuex
- Vue Router
- Axios
- JSON Server

### Game Info & Rules
The game is played with two packs of playing cards. After thoroughly shuffling both decks together, 4 rows of 10 face down cards are dealt to form the tableau columns. 4 more cards are dealt face down to the 4 leftmost columns and then a face up card is dealt to the end of each column. The remaining cards are placed face down to form the stock.

Spider is usually played with two standard decks of playing cards, but the game is very difficult that way. Spider One Suit and Two Suit game variations exist that still use 104 cards, but only use the Spades in the one suit game and Spades and Hearts in the two suit game. Extra packs of cards are required to make up the numbers. This makes Spider considerably easier.

The object of the game is to build cards of descending suit sequence from King to Ace within the tableau columns. When such a sequence has been formed, it is automatically removed to one of the 8 foundations. When all 104 cards have been played to the foundations as eight separate King to Ace sequences then the game is won.

All building is carried out on the tableau columns with the foundations not really participating in the game much. You may move any exposed card from the end of a tableau column to another tableau column if it creates a descending sequence (regardless of suit). You may also move a packed descending sequence of cards as a group to another tableau column but only if they are of the same suit. Therefore, you should try to pack cards of the same suit if you have a choice, otherwise you will find the game blocks quickly. If you manage to create a complete descending sequence of cards from King to Ace of the same suit, then it will be transferred to one of the foundations automatically. Empty tableau columns may be filled by any card or a packed descending suit sequence of cards. When no more constructive moves can be made on the tableau, click on the stock to deal another card to each of the tableau columns. You must fill all empty spaces in the tableau before you can deal cards from the stock, even if it means breaking up a sequence you have already packed.

Game starts with 500 score points and with 0 move points. After each move, move points are increased by one and score points are decreased by one.
Whenever you complete a suit, instead of losing 1 point, you will gain 100.
If you use Undo button, it will undo your last move but it will not undo your move points.
