#!/bin/bash
TODAY=$(date +"%Y%m%d")
TIME=$(date +%s)
ARQ_EM_PROCE=$(ps -ef | grep app.js | wc -l)
if [ $ARQ_EM_PROCE -eq 1 ]
then
  echo "# Executando Deploy"
  node ../app/app.js > ./logs/app_$TODAY_$TIME_.log &
else
  echo "# APP em execucao"
fi

