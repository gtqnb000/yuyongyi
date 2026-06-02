@echo off
chcp 65001 >nul
title 光头强内核 - 自动部署监控
cd /d "%~dp0"
node auto.js
pause
