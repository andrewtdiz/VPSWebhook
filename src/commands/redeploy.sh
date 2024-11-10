CURRENT_DIR=$(pwd)

cd "$1" || exit

echo "Current directory: $(pwd)"

echo "Pulling latest code from git..."
echo "Calling with command: " "$1" " and " "$2"

if git pull; then
    echo "Git pull completed successfully."

    # echo "Restart pm2 of: " "$2"
    pm2 restart "$2"

    echo "Server restarted successfully with PM2."
else
    echo "Git pull failed. Server not restarted."
fi

cd "$CURRENT_DIR"