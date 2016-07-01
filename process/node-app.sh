#!/bin/bash
TODAY=$(date +"%d-%m-%Y")
TIME=$(date +"%H-%M-%S")
ARQ_EM_PROCE=$(ps -ef | grep app.js | wc -l)
if [ $ARQ_EM_PROCE -eq 1 ]
then
  echo "# Executando Deploy"
  echo "Processo iniciando em ".$TODAY." as ".$TIME > ./logs/app_start_$TODAY_$TIME_.log &
  node ../app/app.js > ./logs/app_log_$TODAY_$TIME_.log &
else
  echo "# APP em execucao"
fi

