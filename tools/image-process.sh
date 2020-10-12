for f in *.png; do ffmpeg -i "$f" -vf scale=128:128 "../output/${f%%.png}.png"; done
