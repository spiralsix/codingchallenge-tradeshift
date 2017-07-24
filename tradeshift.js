/**
 *  Words Finder
 * 
 *  Given an input of a list of strings representing a matrix of characters 
 *  find all the valid words in that matrix.
 *  
 *  A valid words is a vertical or horizontal sequence of characters that 
 *  are present in a dictionary  
 *  
 *  The dictionary is defined by the following interface:
 *  public interface Dictionary {
 * 	   boolean isValidWord(String word);
 *  }
 *  
 *  
 *  Sample Input
 *  private static final String[] DEFAULT_PUZZLE = new String[] {
 *   	"akjbvaijdsbv_d_dbv",
 *   	"fjslkdfadsna_T_lfa",
 *      "asdfasdfsdfa_r_ads",
 *      "ckvsadfgfgjava_ajd",
 *      "akjbvaijdsbv_d_dbv",
 *      "cbvqiejdbfqi_e_qib",
 *      "asdjnaquekjdwdfabd",
 *      "asdk_word_kgrtuabd",
 *      "asdjnaquekjfghbdbd",
 *      "asewdfldfjdsfewrkf",
 *      "as_Shift_ejdccgabd",
 *   };
 *  
 *  Expectations:
 *   * Can parse a list of strings into a proper data structure: matrix? tree?
 *   * Realizes this is a DFS problem
 *   * Implements a DFS algorithm
 *   * Does not output repeated words
 *   * Has/Proposes a way to test it
 *   * Clear division of work between methods/classes/etc
 *   * 
 *   
 *  Bonus points:
 *   * Actually creates a dictionary implementation
 *   * Actually creates a dictionary implementation backed by a data store
 *   * Changes algorithm to search words diagonally 
 *   
 */

 var DEFAULT_PUZZLE = [
    "akjbvaijdsbv_d_dbv",
    "fjslkdfadsna_T_lfa",
    "asdfasdfsdfa_r_ads",
    "ckvsadfgfgjava_ajd",
    "akjbvaijdsbv_d_dbv",
    "cbvqiejdbfqi_e_qib",
    "asdjnaquekjdwdfabd",
    "asdk_word_kgrtuabd",
    "asdjnaquekjfghbdbd",
    "asewdfldfjdsfewrkf",
    "as_Shift_ejdccgabd"
];
var SAMPLE_DICTIONARY = [
    "Shift","Trade","java","Peter","word"
]

// I am not sure what this data structure is really 
// called.  Since all JS objects are like hashtables,
// this Dictionary is like a hashtable of hashtables. 
// Like a tree where the nodes can have many children.
// This makes it very inexpensive to check for the 
// presence of words in the dictionary.  Checking is 
// based on the number of letters in the word, not the
// number of entries in the dictionary.  One problem 
// with this data structure is that words which share 
// a root will hide eachother.  "Out" will hide the 
// word "outlaw".  It wouldn't be hard to overcome 
// this problem.
class Dictionary  {

    constructor(starterWords) {
        this.lexicon = new Node(null,"ROOT");
        this.addWords(starterWords);
    }
     
    // Creates the initial list of words 
    addWords(wordsToAdd) {

        for (var wordsIndex = 0; wordsIndex < wordsToAdd.length; wordsIndex++) {
            // set path to root
            var parent = this.lexicon;
            for (var lettersIndex = 0; lettersIndex < wordsToAdd[wordsIndex].length; lettersIndex++) {
                var node = new Node(parent, wordsToAdd[wordsIndex][lettersIndex])
                if(lettersIndex === wordsToAdd[wordsIndex].length-1)
                    node.wordBoundary = true
                parent.addChild(node);
                parent = node;
            }
        }
    }

    // This method checks a set of letters to see if
    // if is a complete word, part of a word, or neither.
    // @returns a WordCheckResult object
    checkLetters(word) {
        if(!word)
            // return "Not Found" result
            return new WordCheckResult(false,false,word);
        
        // represents where we are in the dictionary
        // start it out, pointing to the root
        var currentPlace = this.lexicon;
        
        // Check the dictionary, letter but letter 
        // to see if the word passed in is there.
        for (var index = 0; index < word.length; index++) {
            var element = word[index];
            var next = currentPlace.getChild(element);
            if(next != null){
                currentPlace = next;
            }
            else {
                // return "Not Found" result
                return new WordCheckResult(false,false,word);
            }
        }    

        if(currentPlace.isBoundary()) {
            // return "Word Complete" result
            return new WordCheckResult(true,true,word);
        }
        else {
            // return "Valid So Far" result
            return new WordCheckResult(false,true,word);
       }
     }

    isValidWord(word) {
        return this.checkLetters().complete
    }
}

class WordCheckResult {
    constructor(complete = false, valid = false, word) {
        this.complete = complete;
        this.valid = valid;        
        this.word = word;
    }
}

// An item in the dictionary.  Each node is a letter,
// it's children are the next letters of words in the
// dictionary.
class Node {
    constructor(parent,letter,boundary = false) {
        this.parent = parent;
        this.letter = letter;
        this.children = {}
        this.wordBoundary = boundary;
    }

    isBoundary() {
        return this.wordBoundary;
    }

    addChild(node) {
        this.children[node.letter] = node;
    }

    getChild(letter) {
        if(this.children[letter])
            return this.children[letter];
        else 
            return null;
    }
}

//  This class represents the Application.  It 
// has the dictionary, the list of words which have
// been found, and the matrix of words. 
class WordFinder {
    constructor() {
        this.dictionary = new Dictionary(SAMPLE_DICTIONARY);
        this.wordsFound = [];
        this.matrix = DEFAULT_PUZZLE;
    }

    // Call when you find a word in the matrix.
    foundWord(word){
        if(this.wordsFound.indexOf(word) === -1) {
            this.wordsFound.push(word)
        }
    }

    // Looks for words in the matrix.
    findWords() {


        for(var i = 0;i<this.matrix.length;i++) {
            for(var j = 0;j<this.matrix[i].length;j++) {
                 // Horizontal
                var word = "";
                for(var k = 0;j+k < this.matrix[i].length;k++) {
                    word += this.matrix[i][j+k]
                    if(this.dictionary.checkLetters(word).complete) {
                        console.log("found: ",word);
                        this.foundWord(word);
                    } 
                }
                // Vertical
                word = "";
                for(var voffset = 0;i+voffset<this.matrix.length;voffset++) {
                    word += this.matrix[i+voffset][j];
                    if(this.dictionary.checkLetters(word).complete) {
                        console.log("found: ",word);
                        this.foundWord(word);
                    }    
                }

                //diagonal
                var rdword = "";
                var ruword = "";
                var ldword = "";
                var luword = "";

                for(var doffset = 0;doffset<this.matrix.length;doffset++) {
                    // checking right and down
                    if(this.matrix[i+doffset] && this.matrix[i+doffset][j+doffset]) {
                        rdword += this.matrix[i+doffset][j+doffset];
                        if(this.dictionary.checkLetters(rdword).complete) {
                            console.log("found: ",rdword);
                            this.foundWord(rdword);
                        } 
                    }
                    // checking right and up
                    if(this.matrix[i+doffset] && this.matrix[i+doffset][j-doffset]) {
                        ruword += this.matrix[i+doffset][j-doffset];
                        if(this.dictionary.checkLetters(ruword).complete) {
                            console.log("found: ",ruword);
                            this.foundWord(ruword);
                        } 
                    }
                    // checking left and down
                   if(this.matrix[i-doffset] && this.matrix[i-doffset][j+doffset]) {
                        ldword += this.matrix[i-doffset][j+doffset];
                        if(this.dictionary.checkLetters(ldword).complete) {
                            console.log("found: ",ldword);
                            this.foundWord(ldword);
                        } 
                    }
                    // checking left and up
                   if(this.matrix[i-doffset] && this.matrix[i-doffset][j-doffset]) {
                        luword += this.matrix[i-doffset][j-doffset];
                        if(this.dictionary.checkLetters(luword).complete) {
                            console.log("found: ",luword);
                            this.foundWord(luword);
                        } 
                    }                                        
                }
            }  
        }
    }
}

wordFinder = new WordFinder();
wordFinder.findWords();

console.log("words found",wordFinder.wordsFound);
