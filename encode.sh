set -e
N=$1; OUT=$2
ffmpeg -loglevel error -y -framerate 24 -i frames/%05d.jpg -i mix.wav -vf hqdn3d=3:3:8:8 -c:v libx264 -preset slow -b:v 2600k -pix_fmt yuv420p -pass 1 -passlogfile /tmp/pl$N -an -f null /dev/null
ffmpeg -loglevel error -y -framerate 24 -i frames/%05d.jpg -i mix.wav -vf hqdn3d=3:3:8:8 -c:v libx264 -preset slow -b:v 2600k -pix_fmt yuv420p -pass 2 -passlogfile /tmp/pl$N -c:a aac -b:a 160k -shortest -movflags +faststart $OUT
echo ENCDONE
