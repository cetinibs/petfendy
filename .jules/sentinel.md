## 2024-05-23 - Fix Rate Limit Memory Leak
**Vulnerability:** The rate limiter used a probabilistic cleanup strategy (`now % 1000 === 0`) which rarely triggered in low/medium traffic, causing the in-memory `Map` to grow indefinitely (memory leak / DoS risk).
**Learning:** Avoid using modulo on timestamps for scheduling periodic tasks in request paths. It is nondeterministic and load-dependent.
**Prevention:** Use a dedicated timestamp variable (`lastCleanup`) to ensure cleanup runs at guaranteed intervals (`now - lastCleanup > INTERVAL`), regardless of traffic density. Always enforce a hard `MAX_SIZE` on unbounded collections.
