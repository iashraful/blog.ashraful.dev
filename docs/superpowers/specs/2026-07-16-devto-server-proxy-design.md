# DEV Server Proxy Design

## Problem

The blog currently calls DEV directly from `useDevtoApi`. A full page load succeeds because Nuxt executes `useAsyncData` on the server, where runtime configuration is available. Client-side navigation executes the same composable in the browser. Direct requests to the authenticated article list then omit the private API key and return 401 responses.

## Goals

- Make DEV requests work consistently during SSR and client-side navigation.
- Keep `DEV_TO_API_KEY` server-only.
- Preserve the current public user response and expose only authenticated published articles in the public article list.
- Keep page and component interfaces unchanged.

## Architecture

The browser and Nuxt SSR code will call same-origin Nuxt server endpoints instead of calling DEV directly:

- `GET /api/devto/user`
- `GET /api/devto/articles`
- `GET /api/devto/articles/:slug`

Each server handler will call the corresponding DEV endpoint:

- `/api/devto/user` calls `https://dev.to/api/users/by_username?url=:username` with the public configured username and no authentication.
- `/api/devto/articles` calls `https://dev.to/api/articles/me/published` with the private API key.
- `/api/devto/articles/:slug` calls `https://dev.to/api/articles/{username}/{slug}` without authentication because article details are public.

`useDevtoApi` remains the page-facing abstraction, but its methods call only the internal Nuxt endpoints. Both SSR and browser navigation therefore use the same request path.

## Security

`DEV_TO_API_KEY` remains in private Nuxt runtime configuration. It is read only inside server handlers and is never included in public runtime config, page payloads, or browser requests.

The public article-list proxy authenticates server-side but requests only the account's published articles. Drafts and other unpublished articles must never be returned by `/api/devto/articles`.

The user handler fails with a server configuration error when the username is absent, and authenticated handlers do the same when the key is absent. Upstream errors are converted to sanitized HTTP errors. Responses must not expose the API key, outbound headers, or raw upstream error objects.

## Components

### Server Handlers

Each handler has one responsibility: validate local inputs, call DEV, and return the response. A small server-side DEV request helper may be introduced only if it removes duplicated base URL, authentication, and error handling across the authenticated handlers.

The article slug handler validates that the route parameter is a non-empty slug before making its upstream request.

### Client Composable

`useDevtoApi` preserves these methods:

- `getUser()`
- `getArticles()`
- `getArticleBySlug(slug)`
- `normalizeTags(tags)`

Only the request targets change to internal routes. Callers in the existing pages require no behavioral changes.

## Error Handling

- Missing username or API key: return HTTP 500 with a generic server-configuration message.
- Invalid or missing article slug: return HTTP 400.
- DEV 404: preserve HTTP 404 with a generic article-not-found message.
- Other DEV failures: preserve an appropriate upstream status when available, otherwise return HTTP 502.
- Existing page-level `useAsyncData` error states continue to render retry controls.

## Testing

Automated tests will verify:

- The user handler calls the public username endpoint without authentication; the article-list handler uses the private `api-key` header and the published-only endpoint.
- The article detail handler does not send the API key.
- Missing key and invalid slug paths return sanitized errors.
- `useDevtoApi` calls only the three internal Nuxt routes.
- Existing tag normalization behavior remains intact.

End-to-end verification will cover:

- Dependency tests passing under Node 22.12.0.
- Production build succeeding.
- Home and About data loading after client-side navigation without direct browser calls to `dev.to/api`.
- Article detail navigation loading successfully.

## Non-Goals

- Exposing the DEV API key to the browser.
- Changing page layouts or article presentation.
- Adding caching, rate limiting, pagination, or private article controls.
- Exposing drafts or other unpublished articles through the public article-list proxy.
- Replacing the current `useAsyncData` page data flow.
