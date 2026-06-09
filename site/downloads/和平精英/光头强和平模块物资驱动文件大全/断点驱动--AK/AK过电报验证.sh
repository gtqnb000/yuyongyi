if [ whoami = "root" ]; then
echo "\n"
echo "已root执行脚本，运行开始！"
else
#非root执行提示：Permission denied，
#并直接中断命令执行且退出脚本。
echo ""
fi

mkdir -p /data/media/0/Android/data/org.telegram.messenger.web/cache

    sleep 1
touch /data/media/0/Android/data/org.telegram.messenger.web/cache/-6323229739019080535_97.jpg

echo "过验证成功"
echo