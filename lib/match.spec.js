import x from '@developwithpassion/matchers_js';
import sut from './match';
import { expect } from 'chai';

describe('creating matchers from a criteria', function() {
  let result;

  describe('and the attribute criteria are specific values as opposed to match functions', function() {
    beforeEach(function() {
      result = sut.create_or_criteria({
        age: 3,
        rating: 12
      });
    });

    it('wraps each of the specific values in an equal to function', function() {
      expect(result({ age: 3, rating: 12 })).to.be.true;
      expect(result({ age: 9, rating: 11 })).to.be.false;
    });
  });

  describe('creating a compound or matcher', function() {
    beforeEach(function() {
      result = sut.create_or_criteria({
        age: x.between(2, 5),
        rating: x.between(4).or(x.greater_than(9))
      });
    });

    it('returns a match builder instance that can be used to create matchers', function() {
      expect(result({ age: 2, rating: 12 })).to.be.true;
      expect(result({ age: 9, rating: 20 })).to.be.true;
    });
  });

  describe('creating a compound and matcher', function() {
    describe('using an criteria object with no nesting', function() {
      beforeEach(function() {
        result = sut.create_and_criteria({
          age: x.between(2, 5),
          rating: x.between(4).or(x.greater_than(9))
        });
      });

      it('returns a match builder instance that can be used to create matchers', function() {
        expect(result({ age: 2, rating: 12 })).to.be.true;
        expect(result({ age: 9, rating: 20 })).to.be.false;
      });

      describe('and a matched attribute does not exist on the target being checked', function() {
        beforeEach(function() {
          result = sut.create_and_criteria({
            age: x.is_defined.and(x.between(2, 5)),
            rating: x.between(3, 4).or(x.greater_than(9))
          });
        });

        it('returns a match builder instance that can be used to create matchers', function() {
          expect(result({ rating: 5 })).to.be.false;
          expect(result({ age: 9, rating: 20 })).to.be.false;
        });
      });
    });

    describe('using nested mapping', function() {
      beforeEach(function() {
        result = sut.create_and_criteria({
          age: x.between(2, 5),
          person: {
            name: x.not(x.is_null)
          }
        });
      });

      it('returns a match builder instance that can be used to create matchers', function() {
        var matching = {
          age: 4,
          person: {
            name: 'Not Null'
          }
        };

        var non_matching = {
          age: 4,
          person: {
            name: null
          }
        };

        expect(result(matching)).to.be.true;
        expect(result(non_matching)).to.be.false;
      });
    });
  });
});
