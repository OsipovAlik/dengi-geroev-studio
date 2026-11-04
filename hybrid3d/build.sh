#!/bin/bash
# usage: bash build.sh stories/NN_slug OUT.mp4   (run from this folder, after tts_ru.py; resumes finished shots)
set -e;S=$1;O=$2;cd "$(dirname "$0")";export NODE_PATH=$(npm root -g)
node render.cjs --story "$S"
python3 audio.py "$S"
ls "$S"/out/shots/*.mp4 | grep -v tmp | sort | sed "s#^#file '$PWD/#; s#\$#'#" > "$S"/out/list.txt
ffmpeg -y -loglevel error -f concat -safe 0 -i "$S"/out/list.txt -c copy "$S"/out/v.mp4
ffmpeg -y -loglevel error -i "$S"/out/v.mp4 -i "$S"/out/mix.m4a -map 0:v -map 1:a -c:v copy -c:a copy -movflags +faststart -shortest "$O"
echo BUILD_OK; ffprobe -v error -show_entries format=duration -of csv=p=0 "$O"
