const expect = require('expect');
const Lab = require('lab');

const lab = exports.lab = Lab.script();

lab.test('returns true when 1 + 1 equals 2', () => {
    expect(1 + 1).toEqual(2);
});