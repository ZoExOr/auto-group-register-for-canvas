// ==UserScript==
// @name         Canvas 自动小组注册
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  实时监测Canvas小组注册开放，自动刷新页面并自动注册目标小组
// @author       Zoe Zhou
// @match        这里放你选课页面的URL
// @grant        GM_log
// @run-at       document-end
// ==/UserScript==

(function() {
    GM_log("⚡ 油猴，启动！");

    'use strict';

    const targetGroupName = ; // 这里写目标小组名称，支持关键词识别
    const checkInterval = 10000; // 每10秒检测一次
    const refreshInterval = 30000; // 每30秒自动刷新页面

    window.tryJoinGroup = function() {
        console.log("🔍 正在检查目标小组...");

        const groups = [...document.querySelectorAll(".student-group-title")]; // 查找所有小组标题，这部分可能要根据你当前页面html底下的class修改，可以自己检查一下元素
        let targetGroup = groups.find(group => {
            const groupTitle = group.querySelector("h2");
            return groupTitle && groupTitle.textContent.includes(targetGroupName);
        });

        if (!targetGroup) {
            console.warn(`❌ 目标小组 "${targetGroupName}" 不存在，等待下次刷新！`);
            return;
        }

        console.log(`✅ 找到目标小组 "${targetGroupName}"，检查是否有加入按钮...`);

        // 查找 "Join" 按钮，有的话点击按钮加入小组
        const joinButton = targetGroup.closest(".student-group-title").parentElement.querySelector("button");

        if (joinButton && joinButton.textContent.trim().toLowerCase() === "join") {
            console.log(`✅ 找到 "Join" 按钮，点击！`);
            joinButton.click();
            clearInterval(checkTimer); // 停止检测
            clearInterval(refreshTimer); // 停止自动刷新
        } else {
            console.log(`⚠️ 目标小组 "${targetGroupName}" 存在，但没有找到 "Join" 按钮，等待下次刷新...`);
        }
    };

    const observer = new MutationObserver(() => {
        if ([...document.querySelectorAll(".student-group-title")].some(el => el.textContent.includes(targetGroupName))) {
            console.log("🌍 小组列表加载完成，开始检测...");
            observer.disconnect(); 
            tryJoinGroup();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    const checkTimer = setInterval(tryJoinGroup, checkInterval);

    const refreshTimer = setInterval(() => {
        console.log("🔄 页面刷新中...");
        window.location.reload();
    }, refreshInterval);
})();
