/// <reference types="cypress" />

/**
 * Thin wrapper around `cy.request` that:
 *  - prefixes the path with the exposed `apiUrl` (unless an absolute URL is given)
 *  - attaches a bearer token from the secret store when one is present
 *  - never auto-fails on non-2xx, so tests can assert on error responses
 *
 * @param {object} options same shape as `cy.request` options, plus:
 * @param {string} options.path relative path, e.g. '/posts/1' (or pass `url` for absolute)
 * @returns Cypress.Chainable<Cypress.Response>
 * @example
 *   cy.api({ method: 'GET', path: '/posts/1' })
 *     .its('status').should('eq', 200)
 */
Cypress.Commands.add('api', (options = {}) => {
  const { path, url, headers = {}, ...rest } = options;
  const base = Cypress.expose('apiUrl') || '';

  return cy.getSecret(['authToken']).then(({ authToken }) =>
    cy.request({
      url: url ?? `${base}${path}`,
      failOnStatusCode: false,
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...headers,
      },
      ...rest,
    }),
  );
});

/**
 * Authenticate once via API and stash the token in the secret store so
 * subsequent `cy.api(...)` calls are authorised. Adjust the endpoint and the
 * response shape to match your backend.
 */
Cypress.Commands.add('apiLogin', (credentials = {}) => {
  return cy
    .getSecret(['userEmail', 'userPassword'])
    .then(({ userEmail, userPassword }) => {
      const body = {
        email: credentials.email ?? userEmail,
        password: credentials.password ?? userPassword,
      };

      return cy.api({ method: 'POST', path: '/auth/login', body }).then((response) => {
        expect(response.status, 'login response status').to.be.oneOf([200, 201]);
        const token = response.body.token ?? response.body.accessToken;
        return cy.setSecret({ authToken: token }).then(() => token);
      });
    });
});
