const scramble = require('../random_word.js');

describe("Scramble functionality", () => {
    let gamesInSession;
    let randomWord;
    let actualWord;
    beforeEach(() => {
        gamesInSession = {};
        randomWord = scramble.getRandomShuffledWord(123, gamesInSession);
        actualWord = gamesInSession['123']['word'] + "";
    });

    it('should pass when max count the word', () => {
        scramble.next(1, 123, gamesInSession);
        scramble.next(2, 123, gamesInSession);
        scramble.next(3, 123, gamesInSession);
        expect(gamesInSession[123]).toEqual({});
    });

    it('should return a random word', () => {
        expect(randomWord).not.toBe(actualWord);
    });

    it('should delete game session if correct word', () => {
        scramble.isCorrectWord(actualWord, 123, gamesInSession);
        expect(gamesInSession['123']).toEqual({});
    });

    it('should not create new game if one is in session', () => {
        const actual = scramble.getRandomShuffledWord(123, gamesInSession);
        expect(actual).toBe(`Game already in progress for word: ${randomWord}`);
        expect(gamesInSession['123']['word']).toBe(actualWord);
        expect(gamesInSession['123']).not.toEqual({});
    });
});
