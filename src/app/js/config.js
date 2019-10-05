/* INSTAGRAM'S SETUP **********************************************************/
const IG_URL = 'https://www.instagram.com/';
const IG_MOBILE_QUERY_SERVER = 'https://i.instagram.com/api/v1/';
const IG_SPRITESA_PATH = 'static/bundles/es6/sprite_glyphs_e90bd586abaf.png/e90bd586abaf.png';
const IG_SPRITESB_PATH = 'static/bundles/es6/sprite_core_4f48d3d2062b.png/4f48d3d2062b.png';
const IG_QUERY_SERVER = IG_URL + 'graphql/query/';
const QH_POSTS = '865589822932d1b43dfe312121dd353a';
const QH_REEL_INFO = 'aec5501414615eca36a9acf075655b1e';

const G_MAPS_QUERY_URL = 'https://www.google.com/maps?q=';

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
// Profile info:
const DOM_USER_INFO_CONTAINER_CLASS = '-vDIg';
const DOM_MUTUAL_ONLY_CONTAINER_CLASS = '_32eiM';
const DOM_CONTAC_INFO_CLASS = 'mt-contact-info';
const DOM_FULL_NAME_CONTAINER_CLASS = 'rhpdm';
const DOM_ACCOUNT_TYPE_CLASS = 'mt-account-type';
// Post toolbar:
const DOM_POST_TOOLBAR_CONTAINER = 'mt-tool-container';
const DOM_POST_TOOLBAR_ClASS = 'mt-toolbar';
const DOM_POST_FULLSCREEN_BUTTON_CLASS = 'white mt-control-fullscreen';
const DOM_POST_DOWNLOAD_BUTTON_CLASS = 'white mt-control-download';

const MSG_UNPROTECT_AVATAR = 'unprotect_avatar';
const MSG_GET_BUSINESS_INFO = 'MSG_GET_BUSINESS_INFO';
const MSG_GET_SHARED_DATA = 'GET_SHARED_DATA';

const EVENT_AJAX_REQUEST = chrome.runtime.id + '-AJAX';
const EVENT_GET_SHARED_DATA = chrome.runtime.id + '-' + MSG_GET_SHARED_DATA;
const EVENT_SEND_SHARED_DATA = chrome.runtime.id + '-' + MSG_GET_SHARED_DATA + '-response';

/* REGULAR EXPRESION PATTERNS *************************************************/
const REGEX_STORIES_VIEW_LOGGER = /.*\/*stories\/reel\/seen\/*(?!.)/i;
const REGEX_REEL_INFO_JSON = new RegExp(
	'.*graphql\\/query\\/\\?query_hash=' + QH_REEL_INFO, 'i'
);
const REGEX_PROFILE_JSON = /\/[^\/]+\/\?__a=1/i;
// Matches a post's URL and submatches its shortcode:
const REGEX_POST_URL = /.*instagram\.com\/p\/([^\/]+)\/*(?!.)/i;
const REGEX_PROFILE_URL = /.*instagram\.com\/[^\/]+\/*(?!.)/i;
const REGEX_PROFILE_TABS = /.*instagram\.com\/[^\/]+\/(tagged|channel|saved)/i;

const OVERLAY_ID = 'mt-super-modal';
const MODAL_ID = 'mt-modal-body';
