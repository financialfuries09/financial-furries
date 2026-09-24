# Shared Articles + Hindi Translation

Replace `admin.html` and `script.js`, and upload `articles.json` to the repository root.

The Admin uses the GitHub Contents API so published articles are stored in `articles.json` and can be seen by all visitors.

Security: GitHub Pages cannot hide a write token in public JavaScript. Use a fine-grained GitHub token restricted to this repository with only Contents read/write, paste it only into the Admin session, and never commit it. For a production public admin, a server-side authentication layer is preferable.

The Admin also includes an English → Hindi translation helper. Review financial terminology, numbers, names and dates before publishing.
