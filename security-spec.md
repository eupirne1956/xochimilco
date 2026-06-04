# Security Specification: User Profiles & Whitelist Access Control

This document defines the strict invariants, security audit payloads, and verification directives for the `users` and `authorized_users` collections protected via Firebase Security Rules.

## 1. Data Invariants

### A. Collection `users`
1. **Identity Integrity**: A user can only read, write, update, or delete their profile if their authenticated Firebase Auth UID matches the document ID `{userId}`.
2. **Immutability check**: Core identity properties, such as `id`, `email`, and `createdAt` must remain immutable after insertion.
3. **Verified Email constraint**: A user can only write their own email address as obtained from their authenticated credentials token.

### B. Collection `authorized_users`
1. **Admin Exclusive Power**: Only authenticated and verified administrator accounts (`request.auth.token.email == "eupirne@gmail.com"`) can write, modify, list, or delete records in the authorized whitelist collection.
2. **User Restricted Visibility**: A standard user can only `get` (read) their own authorization record (`request.auth.token.email.lower() == userEmail`). Standard users are strictly forbidden from listing, creating, or editing any elements of the whitelist.
3. **Data Completeness**: Whitelist documents must have exactly four properties (`email`, `role`, `access_granted_at`, and `access_expires_at`), with strictly bounded data types (email matching, string format validations, and role values restricted to 'admin' or 'user').

## 2. Whitelist Pentest Payloads ("The Dirty Dozen")

The security rules must block and deny access to all of the following malicious payloads:

1. **Unauthenticated Whitelist Reading**: Checking the whitelist database while log-out.
2. **Standard User Whitelist Mutation**: Standard user attempting to create an entry in the whitelist database.
3. **Admin Identity Spoofing**: Standard user attempting to modify their role to `admin` in the whitelist record.
4. **Whitelist Listing Scraping**: Standard user performing a `list` query across all authorized emails.
5. **Dangling Whitelist Field Injection**: Inserting arbitrary fields such as `superPower: true` to bypass verification.
6. **Date Overwrite to Eternity**: Attempting to alter `access_expires_at` value to a date far in the future as a non-admin.
7. **Type Inversion on Role**: Sending a boolean `true` as the role string.
8. **Malicious Email Document Path Escape**: Creating an email document ID containing malicious scripts or path injections.
9. **Mismatched Email Document ID**: Sending an authorized user document whose inner `email` property differs from its document ID.
10. **Bypassing Verification Claims**: Creating whitelist rules that trust client-side claims rather than querying Firestore.
11. **Negative Grant Duration**: Bypassing expiry checks by submitting corrupted dates.
12. **Locked Admin Mutation**: Standard user trying to delete the super admin's whitelist entry.

## 3. Test Matrix Guidelines

```typescript
// Standard security matrix testing guidelines:
// - authContext = null -> Read/Write for any path fails
// - authContext = { email: "eupirne@gmail.com", email_verified: true } -> read/write anywhere succeeds
// - authContext = { email: "user@example.com", email_verified: true } -> get /authorized_users/user@example.com succeeds, write/list fails.
```
