# ttv-lct

Twitch Live Chat Translator

## Requirements

* [Tampermonkey](https://www.tampermonkey.net/) browser extension
## Installation

* Copy the contents of the `.js` file from this repository
* Open Tampermonkey -> Create a new script...
* Paste the copied code
* File -> Save (or Ctrl+S)

## Usage

The script will automatically wait for required elements to load before starting.  
Translation and formatting takes place without user input.

Multiple commands are exposed to the console through `unsafeWindow`:

* `setColor('color')`
    * Input value(s): Any [CSS color value](https://developer.mozilla.org/en-US/docs/Web/CSS/color#syntax)
    * Default value: `#007F00`
    * Example usage: `setColor('#007F00')`
* `setMargins(['left','right'])`
    * Input value(s): Any [CSS length unit](https://developer.mozilla.org/en-US/docs/Web/CSS/length#syntax) or `auto`
    * Default value: `['5px', '5px']`
    * Example usage: `setMargins(['5px','5px'])`
      
* `setStyle('style')`
    * Input value(s): Any [CSS font-style value](https://developer.mozilla.org/en-US/docs/Web/CSS/font-style#values)
    * Default value: `italic`
    * Example usage: `setStyle('italic')`
      
* `setTimer(milliseconds)`
    * If the timer goes by without any new messages being detected, reset the chat observer.
    * Input value(s): any positive integer
    * Default value: `20000`
    * Example usage: `setTimer(20000)`

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
