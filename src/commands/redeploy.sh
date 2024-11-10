CURRENT_DIR=$(pwd)

cd "$1" || exit

echo "Pulling latest code from git..."
echo "Calling with command: " "$1" " and " "$2"

if git pull; then
    bun run build

    echo "Git pull completed successfully."

    pm2 restart "$2"

    echo "Server restarted successfully with PM2."
else
    echo "Git pull failed. Server not restarted."
fi

cd "$CURRENT_DIR"