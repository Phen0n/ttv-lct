// ==UserScript==
// @name	    Twitch Live Chat Translator (Russian to English)
// @namespace	http://tampermonkey.net/
// @version	    1.0.1
// @description	Automatically translates Russian(cyrillic) messages in Twitch chat to English.
// @author	    Phenon
// @match	    https://www.twitch.tv/*
// @grant	    GM_setValue
// @grant	    GM_getValue
// ==/UserScript==


(function() {
    'use strict';

    //initialize style vars
    GM_setValue('color', GM_getValue('color', '#007F00'));
    GM_setValue('margins', GM_getValue('margins', ['5px', '5px']));
    GM_setValue('style', GM_getValue('style', 'italic'));

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
                        translatedSpan.style.color = GM_getValue('color');
                        translatedSpan.style.marginLeft = GM_getValue('margins')[0];
                        translatedSpan.style.marginRight = GM_getValue('margins')[0];
                        translatedSpan.style.fontStyle = GM_getValue('style');
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
