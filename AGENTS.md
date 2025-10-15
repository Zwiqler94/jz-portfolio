# Developer Instructions

## Environment Setup

- Install the Angular CLI globally:
  ```bash
  npm install -g @angular/cli
  ```
- Install the Google authentication library:
  ```bash
  npm install google-auth-library
  ```

## Testing

Run unit tests with:

```bash
npm test -- --watch=false --browsers=ChromeHeadless
```

If the ChromeHeadless browser is not available, you can omit the `--browsers` flag.
