// ==UserScript==
// @name	    Twitch Live Chat Translator (Russian to English)
// @namespace	http://tampermonkey.net/
// @version	    1.0
// @description	Automatically translates Russian(cyrillic) messages in Twitch chat to English.
// @author	    Phenon
// @match	    https://www.twitch.tv/*
// @grant	    none
// ==/UserScript==


(function() {
    'use strict';

    //Unofficial Google Translate API
    async function translateText(text) {
        const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=ru&tl=en&dt=t&q=${encodeURIComponent(text)}`);
        const result = await response.json();
        return result[0][0][0];
    }

    const chatboxClass = 'main.seventv-chat-list';
    const messageClass = 'span.text-token';

    const observer = new MutationObserver(async (mutations) => {
        for (let mutation of mutations) {
            mutation.addedNodes.forEach(async (node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    for (let textNode of node.querySelectorAll(messageClass)) {
                        const messageText = textNode.innerText;
                        //skip if text isn't Russian
                        if (!/[\u0400-\u04FF]/.test(messageText)) continue;
                        const translatedText = await translateText(messageText);
                        const translatedSpan = document.createElement('span');
                        translatedSpan.style.color = '#007F00';
                        translatedSpan.style.marginLeft = '5px';
                        translatedSpan.style.marginRight = '5px';
                        translatedSpan.style.fontStyle = 'italic';
                        translatedSpan.innerText = `[${translatedText}]`;

                        textNode.appendChild(translatedSpan);
                    }
                }
            });
        }
    });
    function waitFor7TV() {
        const interval = setInterval(() => {
            console.log('ttv-lct: Waiting for 7TV');
            if (document.querySelector(chatboxClass)) {
                clearInterval(interval);
                observer.observe(document.querySelector(chatboxClass), {childList: true, subtree: true});
                console.log('ttv-lct: 7TV elements found. Starting script')
            }
        }, 1000);
    }
    console.log('ttv-lct: Script loaded');
    waitFor7TV();
})();
