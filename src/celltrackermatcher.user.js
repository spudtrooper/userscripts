// ==UserScript==
// @name          Celltracker wine matcher
// @namespace     http://jeffpalm.com/celltrackerwinematcher
// @description   Matches wines on celltracker.com with the perfect 
//                type of prok rinds
// @include       http://www.cellartracker.com/*list*
// ==/UserScript==

(function() {

  IMGS_AND_PRODUCTS = [
    'http://ecx.images-amazon.com/images/I/51mMuiztGLL._AA115_.jpg','http://www.amazon.com/Lowreys-microwave-chicharrones-original-1-75-Ounce/dp/B000UPFWW6/ref=sr_1_1?ie=UTF8&qid=1347940144&sr=8-1&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/51r28F5YJFL._AA115_.jpg','http://www.amazon.com/Lowreys-microwave-chicharrones-1-75-Ounce-Packages/dp/B000UP8QQ0/ref=sr_1_2?ie=UTF8&qid=1347940144&sr=8-2&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/51LCwJl29sL._AA115_.jpg','http://www.amazon.com/Fried-Pork-Rinds-Mixed-Flavor/dp/B000G671SM/ref=sr_1_4?ie=UTF8&qid=1347940144&sr=8-4&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/41ePBUlxqSL._AA115_.jpg','http://www.amazon.com/18-oz-Barrels-Pork-Rinds/dp/B0001WVZLK/ref=sr_1_5?ie=UTF8&qid=1347940144&sr=8-5&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/41sBbUgeU8L._AA115_.jpg','http://www.amazon.com/Microwave-Rinds-Cinnamon-Sugar-Flavor-Gluten/dp/B006ENY6PC/ref=sr_1_7?ie=UTF8&qid=1347940144&sr=8-7&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/21u0MEtUKIL._AA115_.jpg','http://www.amazon.com/Lowreys-microwave-chicharrones-original-1-75-oz/dp/B003EML8PM/ref=sr_1_8?ie=UTF8&qid=1347940144&sr=8-8&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/61PBK-1EqVL._AA115_.jpg','http://www.amazon.com/Microwave-Pork-Rinds-Assortment-Flavors/dp/B00423CZ3G/ref=sr_1_9?ie=UTF8&qid=1347940144&sr=8-9&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/318N6YXDFKL._AA115_.jpg','http://www.amazon.com/Fried-Pork-Rinds-Vinegar-pkgs/dp/B000G671RI/ref=sr_1_10?ie=UTF8&qid=1347940144&sr=8-10&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/31M7GN93NNL._AA115_.jpg','http://www.amazon.com/Fried-Pork-Rinds-12-2-pkgs/dp/B000G6BX9U/ref=sr_1_11?ie=UTF8&qid=1347940144&sr=8-11&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/31A2AN896NL._AA115_.jpg','http://www.amazon.com/Orginal-Cracklin-Pork-Rinds-pkgs/dp/B000G6BXCC/ref=sr_1_12?ie=UTF8&qid=1347940144&sr=8-12&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/31pDmIE9KQL._AA115_.jpg','http://www.amazon.com/Time-Back-Skins-Chicharron-Pepper/dp/B001JIWOZQ/ref=sr_1_13?ie=UTF8&qid=1347940144&sr=8-13&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/41aFdp3blhL._AA115_.jpg','http://www.amazon.com/Microwave-Rinds-Sassy-Pepper-Gluten/dp/B006EDXRNY/ref=sr_1_14?ie=UTF8&qid=1347940144&sr=8-14&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/41-dYPtVNwL._AA115_.jpg','http://www.amazon.com/Case-Assorted-Snack-Size-Bags/dp/B0001WV0TW/ref=sr_1_15?ie=UTF8&qid=1347940144&sr=8-15&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/31S70PBNTZL._AA115_.jpg','http://www.amazon.com/Fried-Pork-Rinds-Plain-pkgs/dp/B000G3MFJA/ref=sr_1_16?ie=UTF8&qid=1347940144&sr=8-16&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/51NCK21DQ3L._AA115_.jpg','http://www.amazon.com/Back-Pork-Rinds-Plain-pkgs/dp/B000G6BXCM/ref=sr_1_17?ie=UTF8&qid=1347940144&sr=8-17&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/41U7yMgvQZL._AA115_.jpg','http://www.amazon.com/Lowreys-microwave-chicharrones-1-75-oz-packet/dp/B003EM7J9Q/ref=sr_1_18?ie=UTF8&qid=1347940144&sr=8-18&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/51NCK21DQ3L._AA115_.jpg','http://www.amazon.com/Back-Pork-Rinds-Plain-pkgs/dp/B000G6BXCM/ref=sr_1_17?ie=UTF8&qid=1347940351&sr=8-17&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/41U7yMgvQZL._AA115_.jpg','http://www.amazon.com/Lowreys-microwave-chicharrones-1-75-oz-packet/dp/B003EM7J9Q/ref=sr_1_18?ie=UTF8&qid=1347940351&sr=8-18&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/51FRJD6YJAL._AA115_.jpg','http://www.amazon.com/Just-Cheese-Classic-Cheddar-0-5-Ounce/dp/B000EML7DS/ref=sr_1_20?ie=UTF8&qid=1347940351&sr=8-20&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/51UD3gDdxSL._AA115_.jpg','http://www.amazon.com/Microwave-Rinds-Pounds-Shipping-Gluten/dp/B003EFJTS2/ref=sr_1_21?ie=UTF8&qid=1347940351&sr=8-21&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/318N6YXDFKL._AA115_.jpg','http://www.amazon.com/Fried-Pork-Rinds-Vinegar-pkgs/dp/B000G671R8/ref=sr_1_23?ie=UTF8&qid=1347940351&sr=8-23&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/51CHmBCBWaL._AA115_.jpg','http://www.amazon.com/Lowreys-Bacon-Curls-Microwave-Rinds/dp/B000K3FOTO/ref=sr_1_24?ie=UTF8&qid=1347940351&sr=8-24&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/51qYHpXkG6L._AA115_.jpg','http://www.amazon.com/Microwave-Pork-Rinds-Shipping-Gluten/dp/B00361DHKU/ref=sr_1_25?ie=UTF8&qid=1347940351&sr=8-25&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/31FY790G1CL._AA115_.jpg','http://www.amazon.com/Fried-Skins-Strips-Pepper-pkgs/dp/B000G671UA/ref=sr_1_26?ie=UTF8&qid=1347940351&sr=8-26&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/31DXRi0vJOL._AA115_.jpg','http://www.amazon.com/Time-Skins-Chicharron-Strips-Plain/dp/B001JIU48K/ref=sr_1_27?ie=UTF8&qid=1347940351&sr=8-27&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/31A2AN896NL._AA115_.jpg','http://www.amazon.com/Orginal-Cracklin-Pork-Rinds-Case/dp/B000G6523I/ref=sr_1_28?ie=UTF8&qid=1347940351&sr=8-28&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/51FWo6v6d5L._AA115_.jpg','http://www.amazon.com/Microwave-Rinds-Jalapeno-Flavor-Gluten/dp/B006EKUZQO/ref=sr_1_29?ie=UTF8&qid=1347940351&sr=8-29&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/41j8CtbvPuL._AA115_.jpg','http://www.amazon.com/Microwave-Pork-Rinds-Original-Flavor/dp/B006EDT66Q/ref=sr_1_30?ie=UTF8&qid=1347940351&sr=8-30&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/41%2BUT3S95aL._AA115_.jpg','http://www.amazon.com/Microwave-Rinds-Smokey-Flavor-Gluten/dp/B006EKPNJ8/ref=sr_1_31?ie=UTF8&qid=1347940351&sr=8-31&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/41K2DARKQSL._AA115_.jpg','http://www.amazon.com/Fried-Pork-Rinds-Hot-pkgs/dp/B000G671QO/ref=sr_1_32?ie=UTF8&qid=1347940351&sr=8-32&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/31M7GN93NNL._AA115_.jpg','http://www.amazon.com/Fried-Pork-Rinds-BBQ-pkgs/dp/B000G671QE/ref=sr_1_33?ie=UTF8&qid=1347940351&sr=8-33&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/51IpXbGbK1L._AA115_.jpg','http://www.amazon.com/Goya-Pork-Cracklin-Chicharrones/dp/B005F5K36G/ref=sr_1_34?ie=UTF8&qid=1347940351&sr=8-34&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/410pT77ICSL._AA115_.jpg','http://www.amazon.com/PORK-RINDS-BANNER-skins-signs/dp/B005NIULR6/ref=sr_1_49?ie=UTF8&qid=1347940385&sr=8-49&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/31S70PBNTZL._AA115_.jpg','http://www.amazon.com/Fried-Pork-Rinds-Plain-pkgs/dp/B000G3MFJU/ref=sr_1_50?ie=UTF8&qid=1347940385&sr=8-50&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/61fHhsPteWL._AA115_.jpg','http://www.amazon.com/Pork-Rind-Disco-Instrumental/dp/B000QPMZU2/ref=sr_1_52?ie=UTF8&qid=1347940385&sr=8-52&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/31S70PBNTZL._AA115_.jpg','http://www.amazon.com/Fried-Pork-Rinds-Plain-pkgs/dp/B000G3IHKQ/ref=sr_1_53?ie=UTF8&qid=1347940385&sr=8-53&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/51eJjlVVakL._AA115_.jpg','http://www.amazon.com/Bills-Rinds-Display-Premium-Poster/dp/B0058RXUQ6/ref=sr_1_55?ie=UTF8&qid=1347940385&sr=8-55&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/51iC7wvAIiL._AA115_.jpg','http://www.amazon.com/Lowreys-Bacon-Curls-Microwave-Original/dp/B000K3LQ1E/ref=sr_1_56?ie=UTF8&qid=1347940385&sr=8-56&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/41%2BkXlPoi1L._AA115_.jpg','http://www.amazon.com/Cornball-Classics/dp/B0032JKKP6/ref=sr_1_57?ie=UTF8&qid=1347940385&sr=8-57&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/51lEeLqonnL._AA115_.jpg','http://www.amazon.com/Atkins-Break-Chocolate-Hazelnut-count/dp/B004DGL2GI/ref=sr_1_58?ie=UTF8&qid=1347940385&sr=8-58&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/51NCK21DQ3L._AA115_.jpg','http://www.amazon.com/Back-Pork-Rinds-Plain-pkgs/dp/B000G65242/ref=sr_1_59?ie=UTF8&qid=1347940385&sr=8-59&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/516X4OMfyfL._AA115_.jpg','http://www.amazon.com/Fleisch-Peel-Stick-Decal-Wallmonkeys/dp/B008Z8EALY/ref=sr_1_60?ie=UTF8&qid=1347940385&sr=8-60&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/31DXRi0vJOL._AA115_.jpg','http://www.amazon.com/Time-Skins-Chicharron-Strips-Plain/dp/B001JILH3Q/ref=sr_1_61?ie=UTF8&qid=1347940385&sr=8-61&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/41mcxYdgt8L._AA115_.jpg','http://www.amazon.com/Kays-Naturals-Protein-Parmesan-1-2-Ounce/dp/B000E1VF86/ref=sr_1_62?ie=UTF8&qid=1347940385&sr=8-62&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/21C2V70KAJL._AA115_.jpg','http://www.amazon.com/REDNECK-RAMPAGE-RIDES-AGAIN-ARKANSAS-PC/dp/B00083V73I/ref=sr_1_63?ie=UTF8&qid=1347940385&sr=8-63&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/41V7EjYKU5L._AA115_.jpg','http://www.amazon.com/GameSoft-FISHSREV3-Fishs-Revenge-3D/dp/B0002BNWVQ/ref=sr_1_64?ie=UTF8&qid=1347940385&sr=8-64&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/31D4VE47Y9L._AA115_.jpg','http://www.amazon.com/Fried-Pork-Rinds-Sweet-pkgs/dp/B000G6BXAY/ref=sr_1_65?ie=UTF8&qid=1347940385&sr=8-65&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/51MWSk2llBL._AA115_.jpg','http://www.amazon.com/Baken-ets-Original-Flavored-Strips-3-5oz/dp/B004MTOJG6/ref=sr_1_66?ie=UTF8&qid=1347940385&sr=8-66&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/31D4VE47Y9L._AA115_.jpg','http://www.amazon.com/Fried-Pork-Rinds-Sweet-pkgs/dp/B000G6BXAY/ref=sr_1_65?ie=UTF8&qid=1347940400&sr=8-65&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/51MWSk2llBL._AA115_.jpg','http://www.amazon.com/Baken-ets-Original-Flavored-Strips-3-5oz/dp/B004MTOJG6/ref=sr_1_66?ie=UTF8&qid=1347940400&sr=8-66&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/21Q0WW3EGSL._AA115_.jpg','http://www.amazon.com/Fat-Back-Pork-Rinds-pkgs/dp/B000G671UU/ref=sr_1_68?ie=UTF8&qid=1347940400&sr=8-68&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/51aWE%2BVphYL._AA115_.jpg','http://www.amazon.com/Slim-Jim-Smoked-Original-0-28-Ounce/dp/B000CQE3IC/ref=sr_1_69?ie=UTF8&qid=1347940400&sr=8-69&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/318N6YXDFKL._AA115_.jpg','http://www.amazon.com/Fried-Pork-Rinds-Vinegar-pkgs/dp/B000G6916W/ref=sr_1_71?ie=UTF8&qid=1347940400&sr=8-71&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/210Py6e%2BZ2L._AA115_.jpg','http://www.amazon.com/Angler-Surfcasting-Pork-Holder-Version/dp/B007TYBYBY/ref=sr_1_72?ie=UTF8&qid=1347940400&sr=8-72&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/51PrkYsHBHL._AA115_.jpg','http://www.amazon.com/Howards-Fried-Pork-Strips-3-5-Oz/dp/B0070EUICY/ref=sr_1_73?ie=UTF8&qid=1347940400&sr=8-73&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/415GrkixEIL._AA115_.jpg','http://www.amazon.com/Team-PORK-Light-T-Shirt-CafePress/dp/B008DAHFYS/ref=sr_1_74?ie=UTF8&qid=1347940400&sr=8-74&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/41R-wojFNxL._AA115_.jpg','http://www.amazon.com/Microwave-Pork-Rinds-Habanero-Flavor/dp/B003AHMCUG/ref=sr_1_75?ie=UTF8&qid=1347940400&sr=8-75&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/51-DyxHHPuL._AA115_.jpg','http://www.amazon.com/Pork-Rind-Disco-Chicharones/dp/B0009SO7P2/ref=sr_1_76?ie=UTF8&qid=1347940400&sr=8-76&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/21P32CMXT6L._AA115_.jpg','http://www.amazon.com/Fried-Skins-Strips-Plain-Pkgs/dp/B000G671U0/ref=sr_1_77?ie=UTF8&qid=1347940400&sr=8-77&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/41Cjba5VNqL._AA115_.jpg','http://www.amazon.com/2009-2014-Outlook-Cracklings-Purchased-Carcasses/dp/0497846772/ref=sr_1_78?ie=UTF8&qid=1347940400&sr=8-78&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/412fmLPibpL._AA115_.jpg','http://www.amazon.com/Mambi-Fried-Pork-Rinds-4-5/dp/B008G00JUM/ref=sr_1_79?ie=UTF8&qid=1347940400&sr=8-79&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/31WHahEDTxL._AA115_.jpg','http://www.amazon.com/Lovely-Sushi-Shape-Worldwide-shiping/dp/B009B6LF7Q/ref=sr_1_80?ie=UTF8&qid=1347940400&sr=8-80&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/31D4VE47Y9L._AA115_.jpg','http://www.amazon.com/Fried-Pork-Rinds-Sweet-pkgs/dp/B000G6521A/ref=sr_1_81?ie=UTF8&qid=1347940400&sr=8-81&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/41y4Z6eyPKL._AA115_.jpg','http://www.amazon.com/Aquaskinz-Pork-Rind-Bottle-Holder/dp/B003VSO7SE/ref=sr_1_82?ie=UTF8&qid=1347940400&sr=8-82&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/31M7GN93NNL._AA115_.jpg','http://www.amazon.com/Fried-Pork-Rinds-BBQ-pkgs/dp/B000G671QE/ref=sr_1_33?ie=UTF8&qid=1347940372&sr=8-33&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/51IpXbGbK1L._AA115_.jpg','http://www.amazon.com/Goya-Pork-Cracklin-Chicharrones/dp/B005F5K36G/ref=sr_1_34?ie=UTF8&qid=1347940372&sr=8-34&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/31ZCBP76DJL._AA115_.jpg','http://www.amazon.com/Popcorn-Cracklins-Plain-Bags-Rinds/dp/B000G6521K/ref=sr_1_36?ie=UTF8&qid=1347940372&sr=8-36&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/616sbvYuU0L._AA115_.jpg','http://www.amazon.com/Porky-Pork-Scratchings-Card-400g/dp/B005EPJABG/ref=sr_1_37?ie=UTF8&qid=1347940372&sr=8-37&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/21%2BG11Oy8bL._AA115_.jpg','http://www.amazon.com/Golden-Flake-Louisianna-Sauce-Skins/dp/B0067CG5SG/ref=sr_1_39?ie=UTF8&qid=1347940372&sr=8-39&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/518lIh5LPGL._AA115_.jpg','http://www.amazon.com/Pork-Chop-Blue-Around-Rind/dp/B0006NCWZM/ref=sr_1_40?ie=UTF8&qid=1347940372&sr=8-40&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/41K2DARKQSL._AA115_.jpg','http://www.amazon.com/Fried-Pork-Rinds-Case-pkgs/dp/B000G6916M/ref=sr_1_41?ie=UTF8&qid=1347940372&sr=8-41&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/41jdV1LrdgL._AA115_.jpg','http://www.amazon.com/2009-2014-Outlook-Pellets-Cracklings-Slaughtering/dp/0497846454/ref=sr_1_42?ie=UTF8&qid=1347940372&sr=8-42&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/51RNGK85G9L._AA115_.jpg','http://www.amazon.com/Just-Cheese-Popped-Butter-1-7-Ounce/dp/B000EM9E2Y/ref=sr_1_43?ie=UTF8&qid=1347940372&sr=8-43&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/11l2pCmXWfL._AA115_.jpg','http://www.amazon.com/Titec-Pluto-Rinds-Mountain-Grips/dp/B001T85994/ref=sr_1_44?ie=UTF8&qid=1347940372&sr=8-44&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/41o3EyE-HGL._AA115_.jpg','http://www.amazon.com/Microwave-Rinds-Habanero-Flavor-Gluten/dp/B00361PABO/ref=sr_1_45?ie=UTF8&qid=1347940372&sr=8-45&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/31R3ANhHbsL._AA115_.jpg','http://www.amazon.com/Lovely-Sushi-Shape-Worldwide-shiping/dp/B009B6LEUY/ref=sr_1_46?ie=UTF8&qid=1347940372&sr=8-46&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/41%2BfR8tbcjL._AA115_.jpg','http://www.amazon.com/Microwave-Rinds-Chipolte-Flavor-Gluten/dp/B006EKSR3W/ref=sr_1_47?ie=UTF8&qid=1347940372&sr=8-47&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/51jLBWP06aL._AA115_.jpg','http://www.amazon.com/Puff-Puppies-Microwave-Pork-Rinds/dp/B002WHMGSI/ref=sr_1_48?ie=UTF8&qid=1347940372&sr=8-48&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/410pT77ICSL._AA115_.jpg','http://www.amazon.com/PORK-RINDS-BANNER-skins-signs/dp/B005NIULR6/ref=sr_1_49?ie=UTF8&qid=1347940372&sr=8-49&keywords=pork+rinds',
    'http://ecx.images-amazon.com/images/I/31S70PBNTZL._AA115_.jpg','http://www.amazon.com/Fried-Pork-Rinds-Plain-pkgs/dp/B000G3MFJU/ref=sr_1_50?ie=UTF8&qid=1347940372&sr=8-50&keywords=pork+rinds',
    ];

  function log(msg) {
    try {console.log(msg);} catch (e) {}
  }

  function insertPorkRindsBefore(tr) {
    
    var td = tr.firstChild;
    while (true) {
      if (!td) return;
      if (td.nodeName === 'TD') break;
      td = td.nextSibling;
    }
    var newTd = document.createElement('TD');
    newTd.className = 'type';
    var a = document.createElement('A');
    var img = document.createElement('IMG');
    img.style.maxHeight = '50px';
    img.style.maxWidth = '50px';
    var srcLink = randomSrcLink();
    var src = srcLink[0];
    var lnk = srcLink[1];
    img.src = src;
    a.innerHTML = '';
    a.href = lnk;
    tr.insertBefore(newTd,td);
    a.appendChild(img);
    newTd.appendChild(a);
  }

  function randomSrcLink() {
    var p = IMGS_AND_PRODUCTS;
    var r = Math.floor(Math.random() * p.length/2) * 2;
    var img = p[r];
    var link = p[r+1];
    log(r + ":" + p.length + ":" + img + ":" + link);
    return [img,link];
  }

  function main() {

    // Change the heading
    var ths = document.getElementsByTagName('TH');
    if (!!ths && ths.length > 0) {
      var th = ths[0];
      var tr = th.parentNode;
      while (!!tr) {
	if (tr.nodeName == 'TR') break;
      }
      var newTh = document.createElement('TH');
      newTh.style.paddingLeft = '20px';
      var newA = document.createElement('A');
      newA.href = '#';
      newA.innerHTML = 'Snack';
      newTh.appendChild(newA);
      tr.insertBefore(newTh,th);
    }

    // Find all the TDs with class=type
    var trs = document.getElementsByTagName('TR');
    var len = trs.length;
    for (var i=0; i<len; i++) {
      var tr = trs[i];
      if (!!tr.id && tr.id.match(/^W\d+_/)) {
	insertPorkRindsBefore(tr);
      }
    }
  }

  main();



})();