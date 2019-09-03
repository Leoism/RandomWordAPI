const words = require('./words');
const allWords = words.allWords;

/** Returns random word from words above. */
function getRandomWord() {
    return allWords[Math.floor(Math.random() * allWords.length)];
}

/** Shuffles an array. */
function shuffleArr(arr) {
    // make temp
    const temp = [];
    // pick random from arr add to temp remove from arr
    while(arr.length > 0) {
        const idx = Math.floor(Math.random() * arr.length);
        temp.push(arr[idx]);
        arr.splice(idx, 1);
    }

    return temp;
}

/**
 * Returns a random word that has been shuffled, intializes the game session
 * adds original word to current game, and initializes amount of passers.
 * @param  {int}    groupID        unique identifier for the current game
 *                                 session.
 * @param  {object} gamesInSession an object of all games in session. Giving an
 *                                 empty object will work.
 * @return {string}                random word that has been shuffled.
 */
function getRandomShuffledWord(groupID, gamesInSession) {
    if(gamesInSession[groupID] && gamesInSession[groupID]['word']) {
        return 'Game already in progress for word: '
        + gamesInSession[groupID]['shuffledWord'];
    }

    const randomWord = getRandomWord()
    let word = shuffleArr(randomWord.split("")).join("");

    // ensure random word will never be actual word.
    while(word === randomWord) {
        word = shuffleArr(randomWord.split("")).join("");
    }
    /** A game session object may look like:
     * {
     *    123: {
     *        'word': 'randomWord',
     *        'passers': [],
     *        'shuffledWord': Wordradnom,
     *    }
     * }
     */
    gamesInSession[groupID] = {
        word: randomWord,
        passers: [],
        shuffledWord: word,
    };
    return word;
}

/**
 * Checks wheter a guesses is the correct word. If correct, deletes the game
 * session.
 * @param  {string}  word           word that a user has given as a guess.
 * @param  {int}     groupID        unique identifier for the current game
 *                                  session.
 * @param  {object}  gamesInSession an object of all games in session.
 * @return {Boolean}                returns true if guessed word matches correct
 *                                  word.
 */
function isCorrectWord(word, groupID, gamesInSession) {
    if(gamesInSession[groupID]['word'] == word) {
        passGame(gamesInSession[groupID]);
        return true;
    }
    return false;
}

/**
 * Adds a user to the passers list. If more than or equal to limit unique users
 * choose to pass, game session will be deleted, and allow for a new session to
 * be created.
 * @param  {int}      userID         unique user identifier.
 * @param  {int}      groupID        unique identifier for the current game
 *                                   session.
 * @param  {object}   gamesInSession an object of all games in session.
 * @param  {Number}   [limit=3]      total number of unique passes required to
 *                                   skip current game session.
 * @return {string}                  returns 'COUNT_INCREASE' when unique user
 *                                   is detected. 'PASSING_GAME' when limit is
 *                                   reached. 'SAME_USER' if the user has
 *                                   already voted to pass.
 */
function next(userID, groupID, gamesInSession, limit=3) {
    const currGame = gamesInSession[groupID];
    if(groupID === userID || currGame['passers'].length >= limit) {
        return passGame(currGame);
    }
    if(currGame['passers'].indexOf(userID) < 0) {
        currGame['passers'].push(userID);
        const totalPasses = currGame['passers'].length;
        return totalPasses >= limit ? passGame(currGame) : 'COUNT_INCREASE';
    } else {
        return 'SAME_USER';
    }
}

/**
 * Deltes game session and returns 'PASSING_GAME'.
 * @param  {object} currGame an object of the current game session.
 * @return {string}          returns 'PASSING_GAME'.
 */
function passGame(currGame) {
    delete currGame['word'];
    delete currGame['passers'];
    delete currGame['shuffledWord'];
    return 'PASSING_GAME';
}

module.exports.getRandomShuffledWord = getRandomShuffledWord;
module.exports.isCorrectWord = isCorrectWord;
module.exports.next = next;
