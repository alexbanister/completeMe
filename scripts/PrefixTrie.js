const PrefixTrieNode = require('./PrefixTrieNode');

class PrefixTrie {
  constructor () {
    this.wordCount = 0;
    this.searchedWords = [];
    this.root = {};
  }

  count() {
    return this.wordCount;
  }

  addWord (word) {
    let letters = [ ...word.toLowerCase() ];

    let currentNode = this.root;

    for (let i = 0; i < letters.length; i++) {
      if (!currentNode[letters[i]]) {
        currentNode[letters[i]] = new PrefixTrieNode(letters[i]);
      }
      currentNode = currentNode[letters[i]];
    }
    if (currentNode.endOfWord === false) {
      currentNode.endOfWord = true;
      this.wordCount++;
    }
  }

  getWords (word) {
    this.searchedWords = [];
    let prefix = [ ...word.toLowerCase() ];
    let currentNode = this.root;

    while (prefix.length > 0) {
      let letter = prefix.shift();

      if (!currentNode[letter]) {
        return [];
      }
      currentNode = currentNode[letter];
    }
    let newWord = word.slice(0, -1);

    this.crawlWords(currentNode, newWord);


    return this.cleanSuggestions(this.searchedWords);
  }

  crawlWords (node, word) {
    let letters = Object.keys(node);

    letters.splice(0, 3);

    if (node.endOfWord === true) {
      let newWord = word + node.letter;

      this.searchedWords.push( { word: newWord, selected: node.selected } );
    }
    for (let i = 0; i < letters.length; i++) {
      let growingWord = word + node.letter;

      this.crawlWords(node[letters[i]], growingWord);
    }
  }

  cleanSuggestions (suggestions) {
    let sorted = suggestions.sort( (a, b) => {
      return b.selected - a.selected;
    });

    return sorted.reduce( (accum, nodeThing) => {
      accum.push(nodeThing.word);
      return accum;
    }, []);
  }

  selectWord (word, value) {
    let letters = [ ...word.toLowerCase() ];
    let currentNode = this.root;

    for (var i = 0; i < letters.length; i++) {
      currentNode = currentNode[letters[i]];
    }
    currentNode.selected += value;
  }

  populate (dictionary) {
    dictionary.sort();

    dictionary.forEach( (word) => {
      this.addWord(word);
    });
    return this.wordCount;
  }
}

module.exports = PrefixTrie;
