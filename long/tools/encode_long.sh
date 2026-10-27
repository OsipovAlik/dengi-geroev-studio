set -e
OUT=$1
ffmpeg -loglevel error -y -framerate 24 -i frames/%05d.jpg -vf hqdn3d=3:3:8:8 -c:v libx264 -preset slow -b:v 1200k -pix_fmt yuv420p -pass 1 -passlogfile /tmp/pllong -an -f null /dev/null
ffmpeg -loglevel error -y -framerate 24 -i frames/%05d.jpg -i mix.wav -vf hqdn3d=3:3:8:8 -c:v libx264 -preset slow -b:v 1200k -pix_fmt yuv420p -pass 2 -passlogfile /tmp/pllong -af loudnorm=I=-16:TP=-1.5:LRA=11 -c:a aac -b:a 128k -shortest -movflags +faststart $OUT
echo ENCDONE
