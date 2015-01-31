ldl-event-slideshow
===================
## Url params:
- Example: http://lge88.github.io/ldl-event-slideshow/?index=2&duration=1500
  will show `slide-2`(3rd slide, since the index starts from 0), with parameter `duration` set to 1500. Available parameters and their default values are defined in https://github.com/lge88/ldl-event-slideshow/blob/gh-pages/slides/slide-2/slide-2.json. All slides follow the same convention.

## Setup Dev Environment
- Install node: https://github.com/creationix/nvm
- Clone this repo to local. Assume located in `~/projects/ldl-event-slideshow`.
- `cd ~/projects/ldl-event-slideshow && npm install`
- Run the server: `node server`
- Build:
  * `node bin/build-dev.js`
  * `node bin/build-dist.js` (TODO)
- Add a new slide:
  `node bin/add-slide.js slide-5` will generate a scaffold in `slides/slide-5`

## Test links:

http://lge88.github.io/ldl-event-slideshow/dist/?uid=1771
http://lge88.github.io/ldl-event-slideshow/dist/?uid=1538
http://lge88.github.io/ldl-event-slideshow/dist/?uid=5087301
http://lge88.github.io/ldl-event-slideshow/dist/?uid=583499
http://lge88.github.io/ldl-event-slideshow/dist/?uid=1058345
http://lge88.github.io/ldl-event-slideshow/dist/?uid=1383695
http://lge88.github.io/ldl-event-slideshow/dist/?uid=2536661
