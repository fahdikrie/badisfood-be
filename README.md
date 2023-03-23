# Badisfood API

## Objectives
Build a RESTful API which will provides these functions:
- [x] Show menus
- [x] Add item to the cart
- [x] Update existing item in the cart
- [x] Remove the item from the cart
- [x] Checkout the cart and create an order

## Documentation

### Postman
Below are the links to the Postman documentation for each Module:

1. **Auth** - [Docs](https://documenter.getpostman.com/view/13513565/2s93RMTuqx)
2. **Users** - [Docs](https://documenter.getpostman.com/view/13513565/2s93RMTuvQ)
3. **Menu** - [Docs](https://documenter.getpostman.com/view/13513565/2s93RMTuvL)
4. **Cart** - [Docs](https://documenter.getpostman.com/view/13513565/2s93RMTuvG)
5. **Order** - [Docs](https://documenter.getpostman.com/view/13513565/2s93RMTuvN)

### Swagger
Swagger documentation can be accessed at [https://hangry-be-test-fahdii.herokuapp.com/api](https://hangry-be-test-fahdii.herokuapp.com/api)

## Running the App in Development Mode
### Preparing the Database & Environment
1. Clone the repo
```bash
git clone https://github.com/fahdikrie/badisfood-be.git
```

2. Run the following command to start the database
```bash
docker-compose up -d
```

3. Copy the .env.dist file and rename it to .env. Fill all the required fields.
```env
# Prisma db URL
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/badisfood?schema=public"

# NestJS
JWT_ACCESS_SECRET=
JWT_REFRESH_SECRET=

# PostgreSQL
POSTGRES_HOST="localhost"
POSTGRES_PORT="5432"
POSTGRES_NAME="badisfood"
POSTGRES_USER="username"
POSTGRES_PASSWORD="password"
```

4. Run the following command to generate the prisma client
```bash
pnpx prisma generate
```

### Runnning the Application

1. Install dependencies
```bash
pnpm install
```

2. Install all the dependencies
```bash
pnpm install
```

3. Run the following command to seed the database
```bash
pnpm run seed
```

4. Run the application in development mode
```bash
pnpm run start:dev
```

## Remarks & Lessons Learned
1. This is my first time using Nest.js with Prisma. Nest.js opinionated structure and Prisma's ORM improves the velocity of development by a lot.
2. Nest.js's built in CLI is also helps improve the development velocity.
3. User login & register is added as a means for me to learn Authentication & Authorization in Nest.js and make the API closer to real-world example.

## Future Improvements
1. Refactor
2. Better documentations & example
3. Add pagination for the menu
4. Access-based authorization on some routes (not just based on role). E.g. only the owner of the cart can update the cart.
5. Add tests

## Credits
1. [Nest.js](https://nestjs.com/)
2. [Free Foood Menus API](https://github.com/igdev116/free-food-menus-api/tree/main/menus)
