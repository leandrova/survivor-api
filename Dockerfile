FROM ubuntu
MAINTAINER Leandro Viana <leandroviana@gmail.com>

RUN apt-get update && apt-get -y upgrade
RUN apt-get install -y nodejs

RUN rm -rf /survivor-api
RUN mkdir /survivor-api

RUN cd /survivor-api && echo "" > .env

ADD ./app /survivor-api/
ADD ./process/node-app.sh /survivor-api/

EXPOSE 3000
