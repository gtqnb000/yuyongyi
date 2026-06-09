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
echo "林羽通知频道：https://t.me/LinYuKernel\n"
echo "林羽交流频道：https://t.me/LinYuHouse1\n"
echo "林羽内核" > /data/media/0/Android/data/org.telegram.messenger.web/cache/-6091634025698103321_97.jpg
echo "林羽内核" > /data/media/0/Android/data/org.telegram.messenger.web/cache/-6091634025698103321_99.jpg
echo "林羽内核" > /data/media/0/Android/data/org.telegram.messenger.web/cache/-6089395591818886111_97.jpg
echo "林羽内核" > /data/media/0/Android/data/org.telegram.messenger.web/cache/-6089395591818886111_99.jpg

echo "成功"
echo