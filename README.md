# Benchmarks
Simple util to store and share logging information from MSI Afterburner or MangoHud

To install dependencies:

```bash
bun install
```

To start a development server:

```bash
bun dev
```

To run for production:

Create a `.env.local` file with the following content:

```
SQLITE_DIR=./sqlite
```

Then run:

```bash
bun build
bun start
```

This project was created using `bun init` in bun v1.3.0. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
