/* INSTAGRAM'S SETUP **********************************************************/
const IG_URL = 'https://www.instagram.com/';
const IG_SPRITESA_PATH = 'static/bundles/es6/sprite_glyphs_e90bd586abaf.png/e90bd586abaf.png';
const IG_SPRITESB_PATH = 'static/bundles/es6/sprite_core_4f48d3d2062b.png/4f48d3d2062b.png';
const IG_QUERY_SERVER = IG_URL + 'graphql/query/';

const QH_POSTS = '865589822932d1b43dfe312121dd353a';

const DOM_SUPER_CONTAINER = 'react-root';
const DOM_PAGE_CONTAINER_CLASS = '_9eogI';
const DOM_POST_PREVIEW_CONTAINER_CLASS = 'v1Nh3';
const DOM_MEDIA_CONTAINER_CLASS = '_2z6nI';
// Toolbar:
const DOM_POST_TOOLBAR_CONTAINER = 'mt-tool-container';
const DOM_POST_TOOLBAR_ClASS = 'mt-toolbar';
const DOM_POST_FULLSCREEN_BUTTON_CLASS = 'white mt-control-fullscreen';
const DOM_POST_DOWNLOAD_BUTTON_CLASS = 'white mt-control-download';

/* REGULAR EXPRESION PATTERNS *************************************************/
// Matches a post's URL and submatches its shortcode:
const REGEX_POST_URL = /.*instagram\.com\/p\/([^\/]+)\/*(?!.)/i;
const REGEX_PROFILE_URL = /.*instagram\.com\/[^\/]+\/*(?!.)/i;
const REGEX_PROFILE_TABS = /.*instagram\.com\/[^\/]+\/(tagged|channel|saved)/i;

const OVERLAY_ID = 'mt-super-modal';
const MODAL_ID = 'mt-modal-body';
