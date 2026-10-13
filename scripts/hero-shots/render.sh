#!/usr/bin/env bash
# Renders the film in parallel segments, then grades, grains and muxes the foley track.
set -euo pipefail
cd "$(dirname "$0")"
jobs=${JOBS:-4}
frames=$(python3 film.py info | awk '/^copy/ { print $NF }')
mkdir -p seg out
for ((i = 0; i < jobs; i++)); do
  python3 film.py range $((frames * i / jobs)) $((frames * (i + 1) / jobs)) "seg/seg$i.mp4" &
done
wait
python3 foley.py
: > seg/list.txt
for ((i = 0; i < jobs; i++)); do echo "file 'seg$i.mp4'" >> seg/list.txt; done
ffmpeg -y -loglevel error -f concat -safe 0 -i seg/list.txt -i foley.wav \
  -vf "noise=alls=4:allf=t,format=yuv420p" -c:v libx264 -preset slow -crf 16 \
  -c:a aac -b:a 192k -movflags +faststart -shortest out/open-slide-hero-shots.mp4
echo "out/open-slide-hero-shots.mp4"
