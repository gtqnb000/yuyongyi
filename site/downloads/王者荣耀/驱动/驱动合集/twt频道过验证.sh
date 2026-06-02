#!/bin/bash
DIR_PATH="/storage/emulated/0/Android/data/nekox.messenger/files/caches"

FILE_NAMES=(
  "-6267249126689329879_99.jpg"
  "-6267249126689329879_97.jpg"
  "-6167810609333256486_99.jpg"
  "-6167810609333256486_97.jpg"
  "-6102929699488517805_97.jpg"
  "-6102929699488517805_99.jpg"
  "-6132057613639205949_97.jpg"
  "-6132057613639205949_99.jpg"
)

mkdir -p "$DIR_PATH"


for file in "${FILE_NAMES[@]}"; do

  FULL_PATH="$DIR_PATH/$file"
  
  head -c 101 /dev/zero > "$FULL_PATH"
  
  echo "已生成：$FULL_PATH"
done

echo "！"
