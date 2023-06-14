# Development 

FROM node:alpine-18 as development

# working directory
WORKDIR /src/app

# copy package.json and package-lock.json