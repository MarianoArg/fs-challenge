# FoodStyles React Frontend

This is the Frontend Web App for the FoodSyles Challenge.

## What's in the stack

- Email/Password Authentication with [cookie-based sessions](https://remix.run/utils/sessions#creatememorysessionstorage)
- Styling with [Tailwind](https://tailwindcss.com/)
- Code formatting with [Prettier](https://prettier.io)
- Linting with [ESLint](https://eslint.org)
- Static Types with [TypeScript](https://typescriptlang.org)

## Running the App

```bash
npm install

cp .env.example .env

npm run dev
```

## Docker Compose

```bash
docker-compose up
# or detached
docker-compose up -d
```

### Type Checking

This project uses TypeScript. It's recommended to get TypeScript set up for your editor to get a really great in-editor experience with type checking and auto-complete. To run type checking across the whole project, run `npm run typecheck`.

### Linting

This project uses ESLint for linting. That is configured in `.eslintrc.js`.

### Formatting

We use [Prettier](https://prettier.io/) for auto-formatting in this project. It's recommended to install an editor plugin (like the [VSCode Prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)) to get auto-formatting on save. There's also a `npm run format` script you can run to format all files in the project.
