#!/bin/bash
# generate-voices.sh — reads voices.json, generates MP3s via edge-tts
# Usage: ./generate-voices.sh          (skip existing)
#        ./generate-voices.sh --force   (regenerate all)

VOICE="en-US-AnaNeural"
RATE="-5%"
DIR="public/audio"
JSON="voices.json"

if [ ! -f "$JSON" ]; then echo "❌ $JSON not found"; exit 1; fi

mkdir -p "$DIR"

if [ "$1" = "--force" ]; then
  echo "🔄 Force mode — regenerating all..."
  rm -f "$DIR"/*.mp3
fi

count=0
total=$(jq -r 'keys | length' "$JSON")

for key in $(jq -r 'keys[]' "$JSON"); do
  text=$(jq -r --arg k "$key" '.[$k]' "$JSON")
  out="$DIR/${key}.mp3"
  if [ -f "$out" ]; then
    echo "  ✅ $key (exists)"
  else
    echo "  🎙️ $key"
    edge-tts --voice "$VOICE" --rate="$RATE" --text "$text" --write-media "$out" 2>/dev/null
    count=$((count + 1))
  fi
done

echo ""
echo "Done! Generated $count new files. Total: $(ls "$DIR"/*.mp3 2>/dev/null | wc -l | tr -d ' ') MP3s in $DIR/"
