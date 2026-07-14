# Public DEV Data Design

## Goal

Eliminate intermittent 401 responses when loading the profile and article list during client-side navigation and retries.

## Scope

The blog only displays published DEV articles for `ashraful`. It does not need drafts or other authenticated resources.

## Design

`useDevtoApi().getUser()` will request DEV's public profile endpoint:

```
GET https://dev.to/api/users/ashraful
```

`useDevtoApi().getArticles()` will request DEV's public article-list endpoint:

```
GET https://dev.to/api/articles?username=ashraful
```

Neither endpoint requires the private DEV API key and both work identically during SSR, browser navigation, and the retry action. Remove the unused private runtime configuration and example environment variable.

Individual article reads already use DEV's public `GET /api/articles/{id}` endpoint and remain unchanged.

## Error Handling

DEV request failures continue to surface through the existing `useAsyncData` error state and `ErrorBanner`. No authentication-specific retry behavior is needed.

## Testing

Add regression tests that verify profile and article-list requests target their public endpoints and do not send an API key. Verify the tests fail before changing the composable, then run the project build after the change.
