#!/usr/bin/env bash

curl --user ${CIRCLE_TOKEN}: \
     --request POST \
     --form revision=${COMMIT}\
     --form config=@config.yml \
     --form notify=false \
     https://circleci.com/api/v1.1/project/github/civicreactor/civic-resourcery/tree/${BRANCH}
