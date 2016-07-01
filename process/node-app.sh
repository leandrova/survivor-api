#!/bin/bash
TODAY=$(date +"%d-%m-%Y")
TIME=$(date +"%H-%M-%S")
ARQ_EM_PROCE=$(ps -ef | grep app.js | wc -l)
LOG_NODE="./logs/app-log-$TODAY-$TIME.log"
LOG_PROC="./logs/app-start-$TODAY-$TIME.log"
if [ $ARQ_EM_PROCE -eq 1 ]
then
  echo "# Executando Deploy"
  echo "Processo iniciando em $TODAY as $TIME" > $LOG_PROC &
  node ../app/app.js > LOG_NODE &
else
  echo "# APP em execucao"
fi

