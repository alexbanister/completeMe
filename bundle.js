/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const PrefixTrie = __webpack_require__(1);

let autoComplete = new PrefixTrie();
let searchButton = document.getElementById('search-button');
let searchField = document.getElementById('search-field');
let main = document.getElementById('main');
let count = document.getElementById('count');

autoComplete.populate(dictionary);
count.innerText = "Searching " + autoComplete.count() + " words!";

searchButton.addEventListener('click', (e) => {
  e.preventDefault();

  let searchFor = searchField.value;

  searchField.value = '';
  searchField.focus();
  document.getElementById('header').className = 'header-search';
  document.getElementById('main').className = 'main-search';
  searchResults(searchFor);
});

main.addEventListener('click', (e) => {
  if (e.target.closest('span').className === 'word'
     && e.target.closest('span').dataset) {
    e.target.closest('span').className = 'selected';
    autoComplete.selectWord(e.target.closest('span').dataset.word, 1);
  } else if (e.target.closest('span').dataset) {
    e.target.closest('span').className = 'word';
    autoComplete.selectWord(e.target.closest('span').dataset.word, -1);
  }
});

function searchResults (search) {
  let results = autoComplete.getWords(search);

  main.innerHTML = '';
  let p = document.createElement("p");

  p.innerText = `${results.length} possible words found for "${search}"`;
  main.prepend(p);

  results.forEach( (result) => {
    let span = document.createElement("span");

    span.className = 'word';
    span.dataset.word = result;
    span.innerText = result;
    main.append(span);
  });
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const PrefixTrieNode = __webpack_require__(2);

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
    currentNode.endOfWord = true;
    this.wordCount++;
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
    let justWords = [];

    sorted.forEach( (word) => {
      justWords.push(word.word);
    });
    return justWords;
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
    dictionary.forEach( (word) => {
      this.addWord(word);
    });
    return this.wordCount;
  }
}

module.exports = PrefixTrie;


/***/ }),
/* 2 */
/***/ (function(module, exports) {


class PrefixTrieNode {
  constructor (letter) {
    this.letter = letter
    this.endOfWord = false;
    this.selected = 0;
  }
}

module.exports = PrefixTrieNode;


/***/ })
/******/ ]);