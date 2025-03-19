#!/bin/bash

BUCKETS=(
  'api-bucket'
)

export AWS_ACCESS_KEY_ID="access"
export AWS_SECRET_ACCESS_KEY="secret"
export AWS_REGION="us-east-1"

for bucket in "${BUCKETS[@]}"; do
  echo "Creating bucket ${bucket}, please wait ..."
  aws s3api create-bucket \
    --endpoint-url=http://localhost:4566 \
    --bucket ${bucket}
  echo "Created bucket ${bucket}"
  echo " "
done
