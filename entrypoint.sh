#!/bin/sh
echo "window.ENV = {" >/usr/share/nginx/html/env.js
echo "  MEDIA_UTILITY_API_LINK: '${MEDIA_UTILITY_API_LINK}'," >>/usr/share/nginx/html/env.js
echo "  FFMPEG_UTILITY_API_LINK: '${FFMPEG_UTILITY_API_LINK}'" >>/usr/share/nginx/html/env.js
echo "};" >>/usr/share/nginx/html/env.js

nginx -g "daemon off;"
