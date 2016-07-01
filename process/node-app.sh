#!/bin/bash
export TZ=America/Sao_Paulo
TODAY=$(date +"%d-%m-%Y")
TIME=$(date +"%H-%M-%S")
ARQ_EM_PROCE=$(ps -ef | grep app.js | wc -l)
LOG_NODE="/home/leandroviana/survivor-api/process/logs/app-log-$TODAY-$TIME.log"
LOG_PROC="/home/leandroviana/survivor-api/process/logs/app-start-$TODAY-$TIME.log"
LOG_CRON="/home/leandroviana/survivor-api/process/logs/cron.log"
if [ $ARQ_EM_PROCE -eq 1 ]
then
  echo "# Executando Deploy"
  echo "Processo iniciando em $TODAY as $TIME" &>> $LOG_PROC
  screen -d -m -S survivor node /home/leandroviana/survivor-api/app/app.js &>> $LOG_NODE &
else
  echo "# APP em execucao as $TODAY $TIME" &>> $LOG_CRON
fi
