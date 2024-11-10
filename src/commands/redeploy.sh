CURRENT_DIR=$(pwd)

cd "$1" || exit

if git pull; then
    bun run build

    pm2 restart "$2"
else
    echo "Git pull failed. Server not restarted."
fi

cd "$CURRENT_DIR"