(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

describe('InvertedIndex class', () => {
  beforeAll(() => {
    indexInstance = new InvertedIndex();
    validBook = [{ title: 'Welcome to Test Environment',
      text: 'Enjoy this file' }];
    books = [
      {
        title: 'Alice in Wonderland',
        text:
        'Alice falls into a rabbit hole and enters a world full of imagination.'
      },

      {
        title: 'The Lord of the Rings: The Fellowship of the Ring.',
        text: `An unusual alliance of man, elf, dwarf, 
          wizard and hobbit seek to destroy a powerful ring.`
      },
      {
        title: 'The Lord of the Rings: The Fellowship of the Ring.',
        text: `An unusual alliance of man, elf, dwarf, 
          wizard and hobbit seek to destroy a powerful ring.`
      }
    ];
  });
  describe('InvertedIndex class', () => {
    it('should check that the class has a createIndex method', () => {
      expect(typeof indexInstance.createIndex).toBe('function');
    });

    it('should check that the class has a readFile method', () => {
      expect(typeof InvertedIndex.readFile).toBe('function');
    });

    it('should check that the class has a validateFile method', () => {
      expect(typeof InvertedIndex.validateFile).toBe('function');
    });

    it('should check that the class has a tokenize method', () => {
      expect(typeof InvertedIndex.tokenize).toBe('function');
    });

    it('should check that the class has a getDocumentTokens method', () => {
      expect(typeof InvertedIndex.getDocumentTokens).toBe('function');
    });

    it('should check that the class has a getIndex method', () => {
      expect(typeof indexInstance.getIndex).toBe('function');
    });

    it('should check that the class has a searchIndex method', () => {
      expect(typeof indexInstance.searchIndex).toBe('function');
    });

    it('should check that the class has a getSearchResults method', () => {
      expect(typeof indexInstance.getSearchResults).toBe('function');
    });

    it('should check that the class has a getDocuments method', () => {
      expect(typeof indexInstance.getDocuments).toBe('function');
    });
  });

  describe('Create Index', () => {
    it('should return mapped indices to words in a JSON file', () => {
      const expectedResult =
        { alice: [0],
          falls: [0],
          into: [0],
          a: [0, 1, 2],
          rabbit: [0],
          hole: [0],
          and: [0, 1, 2],
          enters: [0],
          world: [0],
          full: [0],
          of: [0, 1, 2],
          imagination: [0],
          in: [0],
          wonderland: [0],
          an: [1, 2],
          unusual: [1, 2],
          alliance: [1, 2],
          man: [1, 2],
          elf: [1, 2],
          dwarf: [1, 2],
          wizard: [1, 2],
          hobbit: [1, 2],
          seek: [1, 2],
          to: [1, 2],
          destroy: [1, 2],
          powerful: [1, 2],
          ring: [1, 2],
          the: [1, 2],
          lord: [1, 2],
          rings: [1, 2],
          fellowship: [1, 2] };
      indexInstance.createIndex(books, 'books');
      expect(indexInstance.filesIndexed.books.index)
        .toEqual(expectedResult);
    });
    it('should return false for incorrect document structure', () => {
      const term = { t1: 'Welcome home', text: 'This is really home' };
      expect(indexInstance.createIndex(term, 'term')).toBeFalsy();
    });
    it('should return false for file with no content', () => {
      const term = {};
      expect(indexInstance.createIndex(term, 'term')).toBeFalsy();
    });
  });
  describe('Search Index', () => {
    it('should search through single files that are indexed', () => {
      const requiredOutput = { alice: [0],
        and: [0, 1, 2],
        unusual: [1, 2],
        imagination: [0] };
      const searchTerm = indexInstance
        .searchIndex('Alice, and her unusual imagination', 'books');
      expect(Object.keys(searchTerm[0].indexes))
        .toEqual(Object.keys(requiredOutput));
      expect(searchTerm[0].indexes).toEqual(requiredOutput);
    });
    it('should return false for an empty String', () => {
      const term = '';
      expect(indexInstance.searchIndex(term, 'books'))
      .toBeFalsy();
    });
    it('should return an empty object for an words not found', () => {
      const term = 'Aeroplane';
      const expectedOutput = indexInstance.searchIndex(term, 'books');
      expect(expectedOutput[0].indexes).toEqual({ });
    });
    it('should return an array of objects if filename is all', () => {
      const books1 = [{ title: 'Alice in Wonderland too',
        text: `Alice adventure in the wonderland 
          was full of drama and action` }];
      indexInstance.createIndex(books, 'books');
      indexInstance.createIndex(books1, 'books1');
      const expectedOutput = [{ indexes: { alice: [0], wonderland: [0] },
        searchedFile: 'books',
        documents: [0, 1, 2] },
      { indexes: { alice: [0], wonderland: [0] },
        searchedFile: 'books1',
        documents: [0] }];
      expect(indexInstance
        .searchIndex('Alice Wonderland', 'all')).toEqual(expectedOutput);
    });
  });

  describe('Tokenize words', () => {
    it('should strip out special characters from excerpt in documents', () => {
      let excerpt = 'Alice l##$oves her ima&&gination?';
      const expectedTokens = ['alice', 'loves', 'her', 'imagination'];
      excerpt = InvertedIndex.tokenize(excerpt);
      expect(excerpt).toEqual(expectedTokens);
    });
  });

  describe('Get index', () => {
    it('should return false for an empty filename', () => {
      const filename = 'books';
      const expectedOutput = { alice: [0],
        falls: [0],
        into: [0],
        a: [0, 1, 2],
        rabbit: [0],
        hole: [0],
        and: [0, 1, 2],
        enters: [0],
        world: [0],
        full: [0],
        of: [0, 1, 2],
        imagination: [0],
        in: [0],
        wonderland: [0],
        an: [1, 2],
        unusual: [1, 2],
        alliance: [1, 2],
        man: [1, 2],
        elf: [1, 2],
        dwarf: [1, 2],
        wizard: [1, 2],
        hobbit: [1, 2],
        seek: [1, 2],
        to: [1, 2],
        destroy: [1, 2],
        powerful: [1, 2],
        ring: [1, 2],
        the: [1, 2],
        lord: [1, 2],
        rings: [1, 2],
        fellowship: [1, 2] };
      indexInstance.createIndex(books, 'books');
      expect(indexInstance.getIndex(filename))
        .toEqual(expectedOutput);
    });
    it('should return the appropriate output for the given filename', () => {
      const filename = '';
      indexInstance.createIndex(books, 'books');
      expect(indexInstance.getIndex(filename))
        .toBeFalsy();
    });
  });

  describe('Validate File', () => {
    it('should return false for incorrect document structure', () => {
      const term = { t1: 'Welcome home', text: 'This is really home' };
      expect(InvertedIndex.validateFile(term)).toBeFalsy();
    });
    it('should return true for correct document structure', () => {
      const term = { title: 'Welcome home', text: 'This is really home' };
      expect(InvertedIndex.validateFile(term)).toBeTruthy();
    });
  });

  describe('Get Document Data', () => {
    it('should return the approriate object for a given document',
    () => {
      const expectedOutput = { documentCount: 0,
        textTokens: ['welcome', 'this', 'is', 'a', 'test', 'document'] };
      const documentCount = 0;
      const term = [{ text: 'Welcome', title: 'This is a test document' }];
      expect(InvertedIndex
        .getDocumentTokens(term, documentCount)).toEqual(expectedOutput);
    });
  });
});

},{}]},{},[1])