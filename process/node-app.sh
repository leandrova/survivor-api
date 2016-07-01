#!/bin/bash
export TZ=America/Sao_Paulo
TODAY=$(date +"%Y-%m-%d")
TIME=$(date +"%H-%M-%S")
ARQ_EM_PROCE=$(ps -ef | grep app.js | wc -l)
LOG_NODE="/home/leandroviana/survivor-api/process/logs/node/node-$TODAY-$TIME.log"
LOG_PROC="/home/leandroviana/survivor-api/process/logs/app/app-$TODAY-$TIME.log"
LOG_CRON="/home/leandroviana/survivor-api/process/logs/cron.log"
if [ $ARQ_EM_PROCE -eq 1 ]
then
  echo "# Executando Deploy"
  echo "Processo iniciando em $TODAY as $TIME" &>> $LOG_PROC
  node /home/leandroviana/survivor-api/app/app.js &>> $LOG_NODE
else
  echo "# APP em execucao as $TODAY $TIME" &>> $LOG_CRON
fi
