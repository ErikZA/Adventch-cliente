#!/bin/bash

function getJsonValue() {
  key=$1
  awk -F"[,:}]" '{for(i=1;i<=NF;i++){if($i~/\042'$key'\042/){print $(i+1)}}}' | tr -d '"' | sed -e 's/^[[:space:]]*//'
}

fileName="src/assets/envinfo.json"
version="0.0.0"
buildDate=`date '+%Y-%m-%d %H:%M:%S'`
branch=`git rev-parse --abbrev-ref HEAD`
message=""

# PATCH v0.0.x
if [[ $branch =~ ^fix/.*|^style/.*|^refactor/.* ]]; then
  version=`npm --no-git-tag-version version patch`
  version="${version/v/}"
  message="Upgrade patch to"
fi

# MINOR v0.x.0
if [[ $branch =~ ^feat/.*|^test/.* ]]; then
  version=`npm --no-git-tag-version version minor`
  version="${version/v/}"
  message="Upgrade minor to"
fi

# MAJOR vx.0.0
if [[ $branch =~ ^release/.* ]]; then
  version=`npm --no-git-tag-version version major`
  version="${version/v/}"
  message="Upgrade major to"
fi

echo "{" > $fileName
echo "  \"version\": \"$version\"," >> $fileName
echo "  \"buildDate\": \"$buildDate\"," >> $fileName
echo "  \"branch\": \"$branch\"" >> $fileName
echo "}" >> $fileName

git add .
git commit -m "$message $version"
git push origin HEAD:master --force
echo "$message $version"

if [[ $version == "0.0.0" ]]; then
  version=`cat package.json | getJsonValue version`
  message="Current version"
else
  if [ $(git tag -l "$version") ]; then
    echo "Existing tag $version"
  else
    git tag -a $version -m "$message $version"
    git push origin $version
    echo "Tag $version created"
  fi
fi
