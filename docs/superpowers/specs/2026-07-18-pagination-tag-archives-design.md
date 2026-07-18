# Pagination And Tag Archives Design

## Goal

Make older published articles accessible through a Load more interaction and let readers browse the blog by its existing article tags. Private Forem analytics are explicitly out of scope.

## Scope

- Paginate only the blog owner's published DEV articles.
- Show a Load more button on the homepage and tag archive pages.
- Make every article-card tag link to a tag archive route.
- Add a public `/tags/[tag]` route.
- Keep existing homepage, search, and article-detail behavior intact.

## API Boundary

The existing server-side DEV client remains the only component that calls `https://dev.to/api`. It will request `/articles/me/published` with `page` and a fixed `per_page` value, retaining the private API key exclusively on the server.

The public app endpoint accepts a positive integer `page` query parameter and an optional tag value. It validates both values before calling DEV, returns one page of `DevtoArticleSummary` values, and preserves the current sanitized upstream error behavior. The API returns article arrays rather than exposing the DEV key or analytics data.

## Homepage Pagination

The homepage fetches page 1 using its existing article endpoint. Selecting Load more fetches the next page and appends results in received order.

The button is shown when the most recent response contains a full page. It is disabled and labelled as loading while the next request is active. It disappears when a response contains fewer than the fixed page size. Repeated loads must not add an article whose ID is already displayed.

The initial error and initial loading states remain unchanged. A failure while loading another page keeps the displayed cards and shows a retryable inline error near the button.

## Tag Archives

`ArticleCard` renders each normalized tag as a link to `/tags/<URL-encoded-tag>`. Links do not alter the card's article route; they stop their click event from activating the card link.

`/tags/[tag]` decodes and displays the tag name, fetches page 1 for that exact tag, and uses the same card grid and Load more behavior as the homepage. Its empty state states that no articles use the selected tag. An invalid or blank tag responds as a 404 rather than calling the upstream API.

## Error Handling

- A missing, non-integer, zero, or negative `page` returns a 400 error.
- A blank or malformed tag path returns a 404 error.
- DEV request failures retain their existing sanitized 502 response unless the upstream status is a suitable client error.
- Initial and subsequent-load failures preserve already rendered article cards.

## Testing

- Server tests verify pagination and tag parameters are encoded into the DEV request, and invalid values are rejected before a request.
- Component tests verify tag link generation, encoded tag routes, and click isolation from the article card navigation.
- Homepage and tag-page tests verify initial data loading, append behavior without duplicates, Load more visibility, and no-more-results states.

## Non-Goals

- No analytics dashboard or analytics endpoints.
- No browser access to `DEV_TO_API_KEY`.
- No numbered pages, filters beyond a single exact tag, or changes to global search.
