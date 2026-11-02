#!/bin/bash
# usage: build.sh STORY_DIR OUT.mp4  (engine dir = this script's dir)
set -e;EN="$(cd "$(dirname "$0")";pwd)";SD="$(cd "$1";pwd)";OUT="$2";M="$3"
export PYTHONPATH="$SD:$EN";cd "$SD"
[ -f timing.json ]&&[ -f vo.wav ]||/home/claude/tts_venv/bin/python "$EN/tts_ru.py" "$SD" "${VOICE:-dmitry}"
python3 "$EN/audio.py"
python3 "$EN/render.py" all
ls scenes/*.mp4|sed "s#.*#file '&'#">list.txt
ffmpeg -y -v error -f concat -safe 0 -i list.txt -c copy silent.mp4
ffmpeg -y -v error -i mix_raw.wav -af loudnorm=I=-14:TP=-1.5:LRA=11 -ar 44100 mix.wav
ffmpeg -y -v error -i silent.mp4 -i mix.wav -map 0:v -map 1:a -c:v libx264 -preset medium -crf 24 -pix_fmt yuv420p -c:a aac -b:a 192k -shortest -movflags +faststart "$OUT"
ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT"
