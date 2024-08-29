// ==UserScript==
// @name	    Twitch Live Chat Translator (Russian to English)
// @namespace	http://tampermonkey.net/
// @version	    1.1
// @description	Automatically translates Russian(cyrillic) messages in Twitch chat to English.
// @author	    Phenon
// @match	    https://www.twitch.tv/*
// @grant	    GM_setValue
// @grant	    GM_getValue
// ==/UserScript==


(function() {
    'use strict';

    //initialize vars
    GM_setValue('color', GM_getValue('color', '#007F00'));
    GM_setValue('margins', GM_getValue('margins', ['5px', '5px']));
    GM_setValue('style', GM_getValue('style', 'italic'));

    GM_setValue('msTimeout', GM_getValue('msTimeout', 20000));

    //console functions
    unsafeWindow.setColor = function(cl) {
        console.log(`Changed color: ${GM_getValue('color')} -> ${cl}`);
        GM_setValue('color', cl);
    }
    unsafeWindow.setMargins = function(mg) {
        console.log(`Changed margins: ${GM_getValue('margins')} -> ${mg}`);
        GM_setValue('margins', mg);
    }
    unsafeWindow.setStyle = function(st) {
        console.log(`Changed style: ${GM_getValue('style')} -> ${st}`);
        GM_setValue('style', st);
    }

    unsafeWindow.setTimer = function(to) {
        console.log(`Changed timeout: ${GM_getValue('msTimeout')}ms -> ${to}ms`);
        GM_setValue('msTimeout', to);
    }

    function getFirst(queryList) {
        for (let query of queryList) {
            if (document.querySelector(query)) return query;
        }
        return null;
    }

    //Unofficial Google Translate API
    async function translateText(text) {
        const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=ru&tl=en&dt=t&q=${encodeURIComponent(text)}`);
        const result = await response.json();
        return result[0][0][0];
    }

    const chatboxQueries = new Map([
        ['main.seventv-chat-list','span.text-token'],							//live, 7tv
        ['div.chat-scrollable-area__message-container', 'span.text-fragment'],	//live, default
        ['div.video-chat__message-list-wrapper', 'span.text-token'],			//video, 7tv
        ['div.video-chat__message-list-wrapper', 'span.text-fragment']			//video, default
    ]);

    const observerConfig = { childList: true, subtree: true };
    const chatObserver = new MutationObserver(async (mutations) => {
        resetTimeout();
        for (let mutation of mutations) {
            mutation.addedNodes.forEach(async (node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    for (let textNode of node.querySelectorAll(getFirst(chatboxQueries.values()))) {
                        const messageText = textNode.innerText;
                        //skip if text isn't Russian or is translated span
                        if (!/[\u0400-\u04FF]/.test(messageText) || textNode.querySelector('.translated-text')) continue;
                        const translatedText = await translateText(messageText);

                        const translatedSpan = document.createElement('span');
                        translatedSpan.style.color = GM_getValue('color');
                        translatedSpan.style.marginLeft = GM_getValue('margins')[0];
                        translatedSpan.style.marginRight = GM_getValue('margins')[1];
                        translatedSpan.style.fontStyle = GM_getValue('style');

                        translatedSpan.className = 'translated-text';
                        translatedSpan.innerText = `[${translatedText}]`;

                        textNode.appendChild(translatedSpan);
                    }
                }
            });
        }
    });

    function resetObserver() {
        chatObserver.disconnect();
        console.log(`ttv-lct: No messages detected for ${GM_getValue('msTimeout')}ms. Resetting observer...`);
        const interval = setInterval(() => {
            if (getFirst(chatboxQueries.keys())) {
                clearInterval(interval);
                chatObserver.observe(document.querySelector(getFirst(chatboxQueries.keys())), observerConfig);
            }
        }, 1000);
    }

    let timeoutId;

    function resetTimeout() {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(resetObserver, GM_getValue('msTimeout'));
    }

    //Init
    const interval = setInterval(() => {
        if (getFirst(chatboxQueries.keys())) {
            clearInterval(interval);
            chatObserver.observe(document.querySelector(getFirst(chatboxQueries.keys())), observerConfig);
            timeoutId = setTimeout(resetObserver, GM_getValue('msTimeout'));
        }
    }, 1000);
})();
