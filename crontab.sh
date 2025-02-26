#!/bin/bash
export PATH=/usr/local/bin:/usr/bin:/bin
export MONGO_CERT_PATH=/path/to/scrap_cert.pem
export JSON_PATH=/project_code/data/output.json

echo "$(date) - Starting yahoo_scrap_mongo.py" >> /project_code/output.log
python3 /project_code/yahoo_scrap_mongo.py >> /project_code/yahoo_scrap.log 2>&1
if [ $? -ne 0 ]; then
    echo "$(date) - Error: yahoo_scrap_mongo.py failed!" >> /project_code/output.log
    exit 1
fi
echo "$(date) - scrap successful!!" >> /project_code/output.log

echo "$(date) - Starting training_embedding.py" >> /project_code/output.log
python3 /project_code/training_embedding.py >> /project_code/training_embedding.log 2>&1
if [ $? -ne 0 ]; then
    echo "$(date) - Error: training_embedding.py failed!" >> /project_code/output.log
    exit 1
fi
echo "$(date) - json successful!!" >> /project_code/output.log

echo "$(date) - Starting embedding.py" >> /project_code/output.log
python3 /project_code/embedding.py >> /project_code/embedding.log 2>&1
if [ $? -ne 0 ]; then
    echo "$(date) - Error: embedding.py failed!" >> /project_code/output.log
    exit 1
fi
echo "$(date) - embedding successful!!" >> /project_code/output.log