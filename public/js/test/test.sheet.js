describe('Array', function() {
	describe('#indexOf()', function() {
		it('should return -1 when the value is not present', function() {
			let foo = [ 1, 2, 3 ];
			let should = chai.should();
			chai.expect(foo).to.have.lengthOf(3);
			foo.should.be.a('array');
		});
	});
});
