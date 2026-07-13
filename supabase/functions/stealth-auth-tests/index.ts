// Placeholder function — this folder exists to host Deno tests
// (`index_test.ts`) that validate anonymous sign-in and stealth-mode
// user_preferencias RLS rules. Not intended to be invoked as a real
// edge function endpoint.

Deno.serve(() => new Response("stealth-auth-tests: tests only", { status: 200 }));