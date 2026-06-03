# Security Specification: User Profiles & Authentication Safeguards

This document defines the strict relational invariants, security audit payloads, and verification directives for the `users` collection protected via Firebase Security Rules.

## 1. Data Invariants
1. **Identity Integrity**: A user can only read, write, update, or delete their profile if their authenticated Firebase Auth UID matches the document ID `{userId}`.
2. **Immutability check**: Core identity properties, such as `id`, `email`, and `createdAt` must remain immutable after insertion.
3. **Impersonation Prevention**: Users cannot modify their profile fields to assume a different identity or spoof identifiers (e.g. email or username matching other users).
4. **Length and Type Safety**: Field inputs such as name, username, and color are bound by specific format and character size limitations.

## 2. Invalidation & Pentest Payloads ("The Dirty Dozen")
The following payloads are explicitly intended to violate security. The ruleset must synchronously block and raise `permission-denied` for each payload:

1. **Unauthenticated Write**: Creating a profile without a signed-in state.
2. **Identity Spoofing**: Signed-in user `user_A` trying to create or modify a profile for `{userId}` equal to `user_B`.
3. **Email Hijacking / Shadow Update**: Signed-in user attempts to overwrite another user's email address.
4. **Immortality Bypass**: Signed-in user attempts to update the `createdAt` timestamp to block trace audits.
5. **Overlong Username / Exhaustion Attack**: Injecting 10MB of data as a custom username.
6. **Path Poisoning**: Injecting toxic character structures into the document path (e.g. HTML or command inject symbols).
7. **Bypassing Verification**: Writing a profile without `request.auth.token.email_verified == true` (unless authenticated through trusted provider Google).
8. **Malicious ID Mutation**: Authenticated user attempts to update their own `id` key inside the document body to mismatched values.
9. **Dangling Fields**: Inserting un-schema'd elements (such as `isAdmin: true` or `role: "superuser"`) to compromise privilege elevations.
10. **Type Inversion**: Supplying a numeric boolean as the `firstName` or `avatarColor` in place of standard strings.
11. **Mismatched Authenticated Email**: Authenticated user attempts to write a document under their own UID, but specifying a different email address from their actual auth token.
12. **Self-Elevating Admin**: Creating or updating user profile document containing field parameters that attempt to trigger server-privileged roles.

## 3. Test Cases Configuration
Every attempt from a non-matching ID or non-validated email token results in a `PERMISSION_DENIED` exception.

```typescript
import { assertFails, assertSucceeds } from "@firebase/rules-unit-testing";

// Standard security matrix testing guidelines:
// - authContext = null -> Read/Write fails
// - authContext = { uid: "user_A", token: { email_verified: true } } -> read /write /users/user_A succeeds
// - authContext = { uid: "user_A", token: { email_verified: true } } -> read /write /users/user_B fails
```
