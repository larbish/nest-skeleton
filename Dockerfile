#############
### build ###
#############

FROM mhart/alpine-node:14.16 AS builder

WORKDIR /app

ARG CI_JOB_TOKEN
ARG NPM_TOKEN
RUN npm config set
RUN npm config set '//gitlab.com/api/v4/packages/npm/:_authToken' "${CI_JOB_TOKEN:-${NPM_TOKEN}}"

COPY package*.json ./

RUN npm ci

COPY . .

ARG TARGET
ARG SERVER_PORT
ENV NODE_ENV=${TARGET}
EXPOSE ${SERVER_PORT}
ENV PORT ${SERVER_PORT}

RUN npm run build

############
### prod ###
############

FROM mhart/alpine-node:14.16 AS production

WORKDIR /app

ARG CI_JOB_TOKEN
ARG NPM_TOKEN
RUN npm config set
RUN npm config set '//gitlab.com/api/v4/packages/npm/:_authToken' "${CI_JOB_TOKEN:-${NPM_TOKEN}}"

COPY package*.json ./

RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

ARG SERVER_PORT
ARG TARGET
ENV NODE_ENV=${TARGET}
EXPOSE ${SERVER_PORT}
ENV PORT ${SERVER_PORT}

ENTRYPOINT ["npm", "run"]
CMD ["start:prod"]
