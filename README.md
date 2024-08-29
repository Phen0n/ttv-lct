# ttv-lct

Twitch Live Chat Translator

## Requirements

* Tampermonkey](https://www.tampermonkey.net/) browser extension
## Installation

* Copy the contents of the `.js` file from this repository
* Open Tampermonkey -> Create a new script...
* Paste the copied code
* File -> Save (or Ctrl+S)

## Usage

The script will automatically wait for 7TV elements to load before starting.  
Translation and formatting takes place without user input.

Multiple commands are exposed to the console through `unsafeWindow`:

* `setColor('color')`
    * Can take any [CSS color value](https://developer.mozilla.org/en-US/docs/Web/CSS/color#syntax) as input.
    * Default value: `#007F00`
    * `setColor('#007F00')`
* `setMargins(['left','right'])`
    * Can take any allowed [CSS length unit](https://developer.mozilla.org/en-US/docs/Web/CSS/length#syntax) or `auto` as input values.
    * Default value: `['5px', '5px']`
    * `setMargins(['5px','5px'])`
* `setStyle('style')`
    * Takes any [font-style value](https://developer.mozilla.org/en-US/docs/Web/CSS/font-style#values) as input
    * Default value: `italic`
    * `setStyle('italic')`
* `setTimer(milliseconds)`
    * If the timer goes by without any new messages being detected, reset the chat observer.
    * Takes integers as input.
    * Default value: `20000`
    * `setTimer(20000)`

## Limitations

* Only translates cyrillic text

## To-Do

* ~~Support for clips, videos~~
* ~~Remove 7TV dependency~~
* Optimize API calls for larger workloads
* Change to officially supported translation service
* Support for more languages

## Changelog

### 1.1

* Added support for videos
* Removed 7TV dependency
* Now resets observed element if no changes are detected in a given time
    * Length customized via `setTimer`

#### 1.0.1

* Added `@grant` values: `GM_setValue` and `GM_getValue`.
    * Now saves style values within Tampermonkey
* Added console commands to change style of translated text
    * Settings persist between sessions

### 1.0

* Released
