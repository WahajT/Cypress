/// <reference types="cypress" />

/**
 * API example against https://jsonplaceholder.typicode.com (a public fake REST
 * API). It uses the `cy.api` custom command, which prefixes the exposed `apiUrl`
 * and never auto-fails on non-2xx responses.
 *
 * JSONPlaceholder fakes writes: it echoes them back with an id but does not
 * persist, which is fine for demonstrating the request/response assertions.
 */
describe('API · Posts', { tags: ['@api', '@smoke'] }, () => {
  it('GET /posts returns a non-empty list', () => {
    cy.api({ method: 'GET', path: '/posts' }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.be.an('array').and.have.length.greaterThan(0);
      expect(res.body[0]).to.include.keys('id', 'title', 'body', 'userId');
    });
  });

  it('GET /posts/:id returns a single post', () => {
    cy.api({ method: 'GET', path: '/posts/1' })
      .its('body')
      .should((body) => {
        expect(body.id).to.eq(1);
        expect(body.title).to.be.a('string').and.not.be.empty;
      });
  });

  it('POST /posts creates a post from a fixture', () => {
    cy.fixture('posts').then(({ newPost }) => {
      cy.api({ method: 'POST', path: '/posts', body: newPost }).then((res) => {
        expect(res.status).to.eq(201);
        expect(res.body).to.deep.include(newPost);
        expect(res.body.id).to.be.a('number');
      });
    });
  });

  it('PUT /posts/:id updates a post', () => {
    cy.fixture('posts').then(({ updatedPost }) => {
      cy.api({ method: 'PUT', path: '/posts/1', body: updatedPost }).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.deep.include(updatedPost);
      });
    });
  });

  it('DELETE /posts/:id responds 200', () => {
    cy.api({ method: 'DELETE', path: '/posts/1' }).its('status').should('eq', 200);
  });

  it('GET a missing resource responds 404 without failing the test', () => {
    cy.api({ method: 'GET', path: '/posts/0' }).its('status').should('eq', 404);
  });
});
