FROM node:latest

# Create app directory and set it as the working directory
WORKDIR /usr/src/app 

RUN npm install -g nodemon

# Copy source code and install dependencies
COPY ./nodejs /usr/src/app/
RUN npm install

EXPOSE 9999