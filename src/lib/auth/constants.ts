/**
 * The single source of truth for post-auth navigation.
 *
 * After sign-in, sign-up confirmation, or an OAuth callback the user lands HERE — the
 * app's first authenticated screen — never `/` (the marketing landing) and never a
 * protected route reached before the auth guard has a session.
 * See docs/design/auth.md.
 */
export const DEFAULT_AUTHED_ROUTE = "/pages";

/** Where the user lands after a failed callback or after signing OUT — the auth screen. */
export const SIGNED_OUT_ROUTE = "/auth";
