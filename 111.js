// ==UserScript==
// @name         一键获取小红书当前搜索页面的所有笔记 (改进版)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Simulate scroll on note page with visual feedback
// @author       wujiafa azyasaxi (modified by Assistant)
// @match        http*://xhslink.com/*
// @match        http*://www.xiaohongshu.com/explore*
// @match        http*://www.xiaohongshu.com/user/profile/*
// @match        http*://www.xiaohongshu.com/search_result*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    // 使用 unsafeWindow 访问页面的全局变量
    const win = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
        #xhs-helper {
            position: fixed;
            left: -60px;
            top: 50%;
            transform: translateY(-50%);
            transition: left 0.3s;
            z-index: 9999;
        }
        #xhs-helper:hover {
            left: 0;
        }
        #xhs-helper-button {
            width: 100px;
            height: 100px;
            background-color: #ff2442;
            border-radius: 0 60px 60px 0;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            cursor: pointer;
            overflow: hidden;
        }
        #xhs-helper-icon {
            width: 50px;
            height: 50px;
            margin-right: 20px;
            background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="none" stroke="white" stroke-width="5"/><path d="M50,5 Q72.5,27.5 95,50 Q72.5,72.5 50,95 Q27.5,72.5 5,50 Q27.5,27.5 50,5 Z" fill="white"/></svg>');
            transition: transform 0.3s;
        }
        #xhs-helper:hover #xhs-helper-icon {
            transform: rotate(180deg);
        }
        #xhs-helper-menu {
            display: none;
            position: absolute;
            left: 100px;
            top: 0;
            width: 200px;
            background-color: white;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            color:black;
        }
        #xhs-helper:hover #xhs-helper-menu {
            display: block;
        }
        .xhs-helper-item {
            padding: 15px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        .xhs-helper-item:hover {
            background-color: #f0f0f0;
        }
        .xhs-helper-item:first-child {
            border-radius: 5px 5px 0 0;
        }
        .xhs-helper-item:last-child {
            border-radius: 0 0 5px 5px;
        }
    `;
    document.head.appendChild(style);

    // 创建 HTML 结构
    const helper = document.createElement('div');
    helper.id = 'xhs-helper';
    helper.innerHTML = `
    <div id="xhs-helper-button">
        <div id="xhs-helper-icon"></div>
    </div>
    <div id="xhs-helper-menu">
        <div class="xhs-helper-item" id="all-note-info">获取搜索页面目前文章</div>
    </div>
    `;
    document.body.appendChild(helper);

    document.getElementById('all-note-info').addEventListener('click', async () => {
        const extractAllNoteInfo = () => {
            if (win.__INITIAL_STATE__) {
                console.log(win.__INITIAL_STATE__.search.feeds._rawValue);
                return win.__INITIAL_STATE__.search.feeds._rawValue;
            } else {
                console.error("__INITIAL_STATE__ 未定义");
                return null;
            }
        };

        const extractIdsAndTokens = (notes) => {
            if (!notes) {
                console.error("未获取到笔记信息");
                return null;
            }
            return notes.map(note => ({
                id: note.id,
                xsecToken: note.xsecToken
            }));
        };

        function simulateScroll(element, progressBar) {
            if (!element) {
                console.error("未找到目标元素");
                return;
            }
            let scrollTop = 0;
            const interval = setInterval(() => {
                element.scrollTop += 100;
                scrollTop = element.scrollTop;
                const progress = (scrollTop / (element.scrollHeight - element.clientHeight)) * 100;
                progressBar.style.width = `${progress}%`;
                if (scrollTop >= element.scrollHeight - element.clientHeight) {
                    clearInterval(interval);
                    console.log("滚动到底部");
                    progressBar.style.backgroundColor = '#4CAF50';
                }
            }, 100);
        }

        async function simulateNotePageVisit(noteId, index, total) {
            return new Promise((resolve, reject) => {
                const url = `https://www.xiaohongshu.com/explore/${noteId}`;
                const container = document.createElement('div');
                container.className = 'note-scroller';
                container.style.position = 'fixed';
                container.style.top = '50px';
                container.style.right = '10px';
                container.style.width = '500px';
                container.style.height = '800px';
                container.style.backgroundColor = '#f0f0f0';
                container.style.border = '1px solid #ccc';
                container.style.padding = '10px';
                container.style.zIndex = '1001';
                container.style.overflow = 'auto'; // 确保容器可以滚动

                const title = document.createElement('h3');
                title.textContent = `模拟访问笔记 ${index + 1}/${total}`;
                container.appendChild(title);

                const iframe = document.createElement('iframe');
                iframe.style.width = '100%';
                iframe.style.height = '800px';
                iframe.style.border = 'none';
                iframe.src = url;

                const progressBarContainer = document.createElement('div');
                progressBarContainer.style.width = '100%';
                progressBarContainer.style.height = '20px';
                progressBarContainer.style.backgroundColor = '#ddd';
                progressBarContainer.style.marginTop = '10px';

                const progressBar = document.createElement('div');
                progressBar.style.width = '0%';
                progressBar.style.height = '100%';
                progressBar.style.backgroundColor = '#4CAF50';
                progressBar.style.transition = 'width 0.5s';

                progressBarContainer.appendChild(progressBar);
                container.appendChild(iframe);
                container.appendChild(progressBarContainer);
                document.body.appendChild(container);

                iframe.onload = async () => {
                    const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

                    const noteScroller = iframeDocument.querySelector('div.note-scroller');
                    if (noteScroller) {
                        iframeDocument.body.innerHTML = ''; // 清空iframe的body内容
                        iframeDocument.body.appendChild(noteScroller); // 将noteScroller添加到iframe的body中
                        noteScroller.style.overflow = 'auto';
                        noteScroller.style.height = '100%';
                        simulateScroll(noteScroller, progressBar);
                    } else {
                        console.error("未找到目标元素");
                        progressBar.style.backgroundColor = 'red';
                    }
                    setTimeout(() => {
                        document.body.removeChild(container);
                        resolve();
                    }, 5000);
                };

                iframe.onerror = (err) => {
                    console.error("加载 iframe 失败", err);
                    progressBar.style.backgroundColor = 'red';
                    setTimeout(() => {
                        document.body.removeChild(container);
                        reject(err);
                    }, 5000);
                };
            });
        }

        const allNotes = extractAllNoteInfo();
        const idsAndTokens = extractIdsAndTokens(allNotes);
        console.log(idsAndTokens);
        if (idsAndTokens && idsAndTokens.length > 0) {
            for (let i = 0; i < idsAndTokens.length; i++) {
                const note = idsAndTokens[i];
                console.log(note.id);
                await simulateNotePageVisit(note.id, i, idsAndTokens.length);
            }
        } else {
            console.error("未获取到笔记信息");
        }
    });
})();
