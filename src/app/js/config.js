/* INSTAGRAM'S SETUP **********************************************************/
const IG_URL = 'https://www.instagram.com/';
const IG_SPRITESA_PATH = 'static/bundles/es6/sprite_glyphs_e90bd586abaf.png/e90bd586abaf.png';
const IG_SPRITESB_PATH = 'static/bundles/es6/sprite_core_4f48d3d2062b.png/4f48d3d2062b.png';
const IG_QUERY_SERVER = IG_URL + 'graphql/query/';

const QH_POSTS = '865589822932d1b43dfe312121dd353a';
const QH_REEL_INFO = 'aec5501414615eca36a9acf075655b1e';

const DOM_EMBEDED_SCRIPTS = 'mt-embeded-script';
const DOM_SUPER_CONTAINER = 'react-root';
const DOM_PAGE_CONTAINER_CLASS = '_9eogI';
// Avatar toolbar:
const DOM_AVATAR_CONTAINER_CLASS = 'XjzKX';
const DOM_AVATAR_OVERLAY_CLASS = 'mt-avatar-overlay';
const DOM_AVATAR_TOOLBAR_CLASS = 'mt-avatar-toolbar';
const DOM_AVATAR_CONTROL_FULL_CLASS = 'mt-control-avatar-max';
const DOM_AVATAR_CONTROL_INCOGNITO_CLASS = 'mt-control-incognito-indicator';
const DOM_USERNAME_CONTAINER_CLASS = 'nZSzR';
const DOM_POST_PREVIEW_CONTAINER_CLASS = 'v1Nh3';
const DOM_MEDIA_CONTAINER_CLASS = '_2z6nI';
// Post toolbar:
const DOM_POST_TOOLBAR_CONTAINER = 'mt-tool-container';
const DOM_POST_TOOLBAR_ClASS = 'mt-toolbar';
const DOM_POST_FULLSCREEN_BUTTON_CLASS = 'white mt-control-fullscreen';
const DOM_POST_DOWNLOAD_BUTTON_CLASS = 'white mt-control-download';

const MSG_UNPROTECT_AVATAR = 'unprotect_avatar';

const EVENT_AJAX_REQUEST = chrome.runtime.id + '-AJAX';

/* REGULAR EXPRESION PATTERNS *************************************************/
const REGEX_STORIES_VIEW_LOGGER = /.*\/*stories\/reel\/seen\/*(?!.)/i;
const REGEX_REEL_INFO_JSON = new RegExp(
	'.*graphql\\/query\\/\\?query_hash=' + QH_REEL_INFO, 'i'
);
// Matches a post's URL and submatches its shortcode:
const REGEX_POST_URL = /.*instagram\.com\/p\/([^\/]+)\/*(?!.)/i;
const REGEX_PROFILE_URL = /.*instagram\.com\/[^\/]+\/*(?!.)/i;
const REGEX_PROFILE_TABS = /.*instagram\.com\/[^\/]+\/(tagged|channel|saved)/i;

const OVERLAY_ID = 'mt-super-modal';
const MODAL_ID = 'mt-modal-body';
