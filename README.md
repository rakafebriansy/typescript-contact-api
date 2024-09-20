# Setup Project

Create .env file

```
DATABASE_URL="mysql://root:@localhost:3306/typescript-contact-api"
```

```shell
npm install

npx prisma generate

npx prisma migrate dev

npx tsc

node dist/main.js
```