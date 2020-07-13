# Quiz App API
##### Practice test API for any level certification

## Build

### Non-Docker
1. `npm run build`

### Docker
1. `docker-compose -f .\development.yml build`

## Run
 - Both commands require specific MySQL instructions
### Non-Docker
1. Ensure that MySQL is running and has the schema: quizapp created
2. Ensure that MySQL has a valid non-root user with schema privs
3. `npm run start-local`

### Docker
1. `docker-compose -f .\db.yml up -d`
2. `docker-compose -f .\development.yml up -d`
2. `docker-compose -f production.yml up -d`

## Config

### Docker
1. In the environment-composers directory, ensure that you have at least a `.env` file created
    1. `MYSQL_ROOT_PASSWORD=<root_pw>`
    2. `MYSQL_USER=<your_user>`
    3. `MYSQL_PASSWORD=<your_user_pw>`
    4. `MYSQL_DATABASE=quizapp`
    5. `DB_USER=<your_user> //same as #2`
    6. `DB_PASSWORD=<your_user_pw> //same as #3`
    7. `DB_HOST=db`
    8. `DB_PORT=3306`
    9. `DB_NAME=quizapp`

## Resources

### Docker
https://www.devteam.space/blog/how-to-deploy-a-web-app-with-docker-containers/
https://docs.docker.com/get-started/part2/#sample-dockerfile
https://nodejs.org/de/docs/guides/nodejs-docker-webapp/
https://www.digitalocean.com/community/tutorials/how-to-build-a-node-js-application-with-docker
https://stackoverflow.com/questions/24319662/from-inside-of-a-docker-container-how-do-i-connect-to-the-localhost-of-the-mach

### TypeORM
https://typeorm.io/#/

### Verification commands
1. `curl --location --request GET 'quizzapper.com/api/question'`