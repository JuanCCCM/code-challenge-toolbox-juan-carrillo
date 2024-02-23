const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;
chai.use(chaiHttp);

const serverUrl = 'http://localhost:5000';

describe('Files Data API', () => {
  it('should return an array of files with their content on GET /files/data', (done) => {
    chai.request(serverUrl)
      .get('/files/data')
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.be.greaterThan(0);
        if (res.body.length > 0) {
          expect(res.body[0]).to.have.all.keys('file', 'lines');
          expect(res.body[0].lines).to.be.an('array');
        }
        done();
      });
  });
});