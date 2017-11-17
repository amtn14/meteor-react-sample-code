//Retrieves language array - what we are currently using on our legacy site
//Source: https://github.com/forxer/languages-list (2014)
//key - ISO 639-1 - standarized way of classifying languages - is unique and can be used as unique identifiers in code
export function getLanguageArray() {  
  const languageArray = [
    {
        "key": "aa",
        "value": "Afar",
        "label": "Afar"
    },
    {
        "key": "ab",
        "value": "Abkhaz",
        "label": "Abkhaz"
    },
    {
        "key": "ae",
        "value": "Avestan",
        "label": "Avestan"
    },
    {
        "key": "af",
        "value": "Afrikaans",
        "label": "Afrikaans"
    },
    {
        "key": "ak",
        "value": "Akan",
        "label": "Akan"
    },
    {
        "key": "am",
        "value": "Amharic",
        "label": "Amharic"
    },
    {
        "key": "an",
        "value": "Aragonese",
        "label": "Aragonese"
    },
    {
        "key": "ar",
        "value": "Arabic",
        "label": "Arabic"
    },
    {
        "key": "as",
        "value": "Assamese",
        "label": "Assamese"
    },
    {
        "key": "av",
        "value": "Avaric",
        "label": "Avaric"
    },
    {
        "key": "ay",
        "value": "Aymara",
        "label": "Aymara"
    },
    {
        "key": "az",
        "value": "Azerbaijani",
        "label": "Azerbaijani"
    },
    {
        "key": "az",
        "value": "South Azerbaijani",
        "label": "South Azerbaijani"
    },
    {
        "key": "ba",
        "value": "Bashkir",
        "label": "Bashkir"
    },
    {
        "key": "be",
        "value": "Belarusian",
        "label": "Belarusian"
    },
    {
        "key": "bg",
        "value": "Bulgarian",
        "label": "Bulgarian"
    },
    {
        "key": "bh",
        "value": "Bihari",
        "label": "Bihari"
    },
    {
        "key": "bi",
        "value": "Bislama",
        "label": "Bislama"
    },
    {
        "key": "bm",
        "value": "Bambara",
        "label": "Bambara"
    },
    {
        "key": "bn",
        "value": "Bengali/Bangla",
        "label": "Bengali/Bangla"
    },
    {
        "key": "bo",
        "value": "Tibetan",
        "label": "Tibetan (Standard, Tibetan, Central)"
    },
    {
        "key": "br",
        "value": "Breton",
        "label": "Breton"
    },
    {
        "key": "bs",
        "value": "Bosnian",
        "label": "Bosnian"
    },
    {
        "key": "ca",
        "value": "Catalan/Valencian",
        "label": "Catalan/Valencian"
    },
    {
        "key": "ce",
        "value": "Chechen",
        "label": "Chechen"
    },
    {
        "key": "ch",
        "value": "Chamorro",
        "label": "Chamorro"
    },
    {
        "key": "co",
        "value": "Corsican",
        "label": "Corsican"
    },
    {
        "key": "cr",
        "value": "Cree",
        "label": "Cree"
    },
    {
        "key": "cs",
        "value": "Czech",
        "label": "Czech"
    },
    {
        "key": "cu",
        "value": "Old Church Slavonic/Church Slavonic/Old Bulgarian",
        "label": "Old Church Slavonic/Church Slavonic/Old Bulgarian"
    },
    {
        "key": "cv",
        "value": "Chuvash",
        "label": "Chuvash"
    },
    {
        "key": "cy",
        "value": "Welsh",
        "label": "Welsh"
    },
    {
        "key": "da",
        "value": "Danish",
        "label": "Danish"
    },
    {
        "key": "de",
        "value": "German",
        "label": "German"
    },
    {
        "key": "dv",
        "value": "Divehi/Dhivehi/Maldivian;",
        "label": "Divehi/Dhivehi/Maldivian;"
    },
    {
        "key": "dz",
        "value": "Dzongkha",
        "label": "Dzongkha"
    },
    {
        "key": "ee",
        "value": "Ewe",
        "label": "Ewe"
    },
    {
        "key": "el",
        "value": "Greek/Modern",
        "label": "Greek/Modern"
    },
    {
        "key": "en",
        "value": "English",
        "label": "English"
    },
    {
        "key": "eo",
        "value": "Esperanto",
        "label": "Esperanto"
    },
    {
        "key": "es",
        "value": "Spanish/Castilian",
        "label": "Spanish/Castilian"
    },
    {
        "key": "et",
        "value": "Estonian",
        "label": "Estonian"
    },
    {
        "key": "eu",
        "value": "Basque",
        "label": "Basque"
    },
    {
        "key": "fa",
        "value": "Persian (Farsi)",
        "label": "Persian (Farsi)"
    },
    {
        "key": "ff",
        "value": "Fula/Fulah/Pulaar/Pular",
        "label": "Fula/Fulah/Pulaar/Pular"
    },
    {
        "key": "fi",
        "value": "Finnish",
        "label": "Finnish"
    },
    {
        "key": "fj",
        "value": "Fijian",
        "label": "Fijian"
    },
    {
        "key": "fo",
        "value": "Faroese",
        "label": "Faroese"
    },
    {
        "key": "fr",
        "value": "French",
        "label": "French"
    },
    {
        "key": "fy",
        "value": "Western Frisian",
        "label": "Western Frisian"
    },
    {
        "key": "ga",
        "value": "Irish",
        "label": "Irish"
    },
    {
        "key": "gd",
        "value": "Scottish Gaelic/Gaelic",
        "label": "Scottish Gaelic/Gaelic"
    },
    {
        "key": "gl",
        "value": "Galician",
        "label": "Galician"
    },
    {
        "key": "gn",
        "value": "Guaraní",
        "label": "Guaraní"
    },
    {
        "key": "gu",
        "value": "Gujarati",
        "label": "Gujarati"
    },
    {
        "key": "gv",
        "value": "Manx",
        "label": "Manx"
    },
    {
        "key": "ha",
        "value": "Hausa",
        "label": "Hausa"
    },
    {
        "key": "he",
        "value": "Hebrew (modern)",
        "label": "Hebrew (modern)"
    },
    {
        "key": "hi",
        "value": "Hindi",
        "label": "Hindi"
    },
    {
        "key": "ho",
        "value": "Hiri Motu",
        "label": "Hiri Motu"
    },
    {
        "key": "hr",
        "value": "Croatian",
        "label": "Croatian"
    },
    {
        "key": "ht",
        "value": "Haitian/Haitian Creole",
        "label": "Haitian/Haitian Creole"
    },
    {
        "key": "hu",
        "value": "Hungarian",
        "label": "Hungarian"
    },
    {
        "key": "hy",
        "value": "Armenian",
        "label": "Armenian"
    },
    {
        "key": "hz",
        "value": "Herero",
        "label": "Herero"
    },
    {
        "key": "ia",
        "value": "Interlingua",
        "label": "Interlingua"
    },
    {
        "key": "id",
        "value": "Indonesian",
        "label": "Indonesian"
    },
    {
        "key": "ie",
        "value": "Interlingue",
        "label": "Interlingue"
    },
    {
        "key": "ig",
        "value": "Igbo",
        "label": "Igbo"
    },
    {
        "key": "ii",
        "value": "Nuosu",
        "label": "Nuosu"
    },
    {
        "key": "ik",
        "value": "Inupiaq",
        "label": "Inupiaq"
    },
    {
        "key": "io",
        "value": "Ido",
        "label": "Ido"
    },
    {
        "key": "is",
        "value": "Icelandic",
        "label": "Icelandic"
    },
    {
        "key": "it",
        "value": "Italian",
        "label": "Italian"
    },
    {
        "key": "iu",
        "value": "Inuktitut",
        "label": "Inuktitut"
    },
    {
        "key": "ja",
        "value": "Japanese",
        "label": "Japanese"
    },
    {
        "key": "jv",
        "value": "Javanese",
        "label": "Javanese"
    },
    {
        "key": "ka",
        "value": "Georgian",
        "label": "Georgian"
    },
    {
        "key": "kg",
        "value": "Kongo",
        "label": "Kongo"
    },
    {
        "key": "ki",
        "value": "Kikuyu/Gikuyu",
        "label": "Kikuyu/Gikuyu"
    },
    {
        "key": "kj",
        "value": "Kwanyama/Kuanyama",
        "label": "Kwanyama/Kuanyama"
    },
    {
        "key": "kk",
        "value": "Kazakh",
        "label": "Kazakh"
    },
    {
        "key": "kl",
        "value": "Kalaallisut/Greenlandic",
        "label": "Kalaallisut/Greenlandic"
    },
    {
        "key": "km",
        "value": "Khmer",
        "label": "Khmer"
    },
    {
        "key": "kn",
        "value": "Kannada",
        "label": "Kannada"
    },
    {
        "key": "ko",
        "value": "Korean",
        "label": "Korean"
    },
    {
        "key": "kr",
        "value": "Kanuri",
        "label": "Kanuri"
    },
    {
        "key": "ks",
        "value": "Kashmiri",
        "label": "Kashmiri"
    },
    {
        "key": "ku",
        "value": "Kurdish",
        "label": "Kurdish"
    },
    {
        "key": "kv",
        "value": "Komi",
        "label": "Komi"
    },
    {
        "key": "kw",
        "value": "Cornish",
        "label": "Cornish"
    },
    {
        "key": "ky",
        "value": "Kyrgyz",
        "label": "Kyrgyz"
    },
    {
        "key": "la",
        "value": "Latin",
        "label": "Latin"
    },
    {
        "key": "lb",
        "value": "Luxembourgish/Letzeburgesch",
        "label": "Luxembourgish/Letzeburgesch"
    },
    {
        "key": "lg",
        "value": "Ganda",
        "label": "Ganda"
    },
    {
        "key": "li",
        "value": "Limburgish/Limburgan/Limburger",
        "label": "Limburgish/Limburgan/Limburger"
    },
    {
        "key": "ln",
        "value": "Lingala",
        "label": "Lingala"
    },
    {
        "key": "lo",
        "value": "Lao",
        "label": "Lao"
    },
    {
        "key": "lt",
        "value": "Lithuanian",
        "label": "Lithuanian"
    },
    {
        "key": "lu",
        "value": "Luba-Katanga",
        "label": "Luba-Katanga"
    },
    {
        "key": "lv",
        "value": "Latvian",
        "label": "Latvian"
    },
    {
        "key": "mg",
        "value": "Malagasy",
        "label": "Malagasy"
    },
    {
        "key": "mh",
        "value": "Marshallese",
        "label": "Marshallese"
    },
    {
        "key": "mi",
        "value": "Māori",
        "label": "Māori"
    },
    {
        "key": "mk",
        "value": "Macedonian",
        "label": "Macedonian"
    },
    {
        "key": "ml",
        "value": "Malayalam",
        "label": "Malayalam"
    },
    {
        "key": "mn",
        "value": "Mongolian",
        "label": "Mongolian"
    },
    {
        "key": "mr",
        "value": "Marathi (Marāṭhī)",
        "label": "Marathi (Marāṭhī)"
    },
    {
        "key": "ms",
        "value": "Malay",
        "label": "Malay"
    },
    {
        "key": "mt",
        "value": "Maltese",
        "label": "Maltese"
    },
    {
        "key": "my",
        "value": "Burmese",
        "label": "Burmese"
    },
    {
        "key": "na",
        "value": "Nauru",
        "label": "Nauru"
    },
    {
        "key": "nb",
        "value": "Norwegian Bokmål",
        "label": "Norwegian Bokmål"
    },
    {
        "key": "nd",
        "value": "North Ndebele",
        "label": "North Ndebele"
    },
    {
        "key": "ne",
        "value": "Nepali",
        "label": "Nepali"
    },
    {
        "key": "ng",
        "value": "Ndonga",
        "label": "Ndonga"
    },
    {
        "key": "nl",
        "value": "Dutch",
        "label": "Dutch"
    },
    {
        "key": "nn",
        "value": "Norwegian Nynorsk",
        "label": "Norwegian Nynorsk"
    },
    {
        "key": "no",
        "value": "Norwegian",
        "label": "Norwegian"
    },
    {
        "key": "nr",
        "value": "South Ndebele",
        "label": "South Ndebele"
    },
    {
        "key": "nv",
        "value": "Navajo/Navaho",
        "label": "Navajo/Navaho"
    },
    {
        "key": "ny",
        "value": "Chichewa/Chewa/Nyanja",
        "label": "Chichewa/Chewa/Nyanja"
    },
    {
        "key": "oc",
        "value": "Occitan",
        "label": "Occitan"
    },
    {
        "key": "oj",
        "value": "Ojibwe/Ojibwa",
        "label": "Ojibwe/Ojibwa"
    },
    {
        "key": "om",
        "value": "Oromo",
        "label": "Oromo"
    },
    {
        "key": "or",
        "value": "Oriya",
        "label": "Oriya"
    },
    {
        "key": "os",
        "value": "Ossetian/Ossetic",
        "label": "Ossetian/Ossetic"
    },
    {
        "key": "pa",
        "value": "Panjabi/Punjabi",
        "label": "Panjabi/Punjabi"
    },
    {
        "key": "pi",
        "value": "Pāli",
        "label": "Pāli"
    },
    {
        "key": "pl",
        "value": "Polish",
        "label": "Polish"
    },
    {
        "key": "ps",
        "value": "Pashto/Pushto",
        "label": "Pashto/Pushto"
    },
    {
        "key": "pt",
        "value": "Portuguese",
        "label": "Portuguese"
    },
    {
        "key": "qu",
        "value": "Quechua",
        "label": "Quechua"
    },
    {
        "key": "rm",
        "value": "Romansh",
        "label": "Romansh"
    },
    {
        "key": "rn",
        "value": "Kirundi",
        "label": "Kirundi"
    },
    {
        "key": "ro",
        "value": "Romanian",
        "label": "Romanian"
    },
    {
        "key": "ru",
        "value": "Russian",
        "label": "Russian"
    },
    {
        "key": "rw",
        "value": "Kinyarwanda",
        "label": "Kinyarwanda"
    },
    {
        "key": "sa",
        "value": "Sanskrit (Saṁskṛta)",
        "label": "Sanskrit (Saṁskṛta)"
    },
    {
        "key": "sc",
        "value": "Sardinian",
        "label": "Sardinian"
    },
    {
        "key": "sd",
        "value": "Sindhi",
        "label": "Sindhi"
    },
    {
        "key": "se",
        "value": "Northern Sami",
        "label": "Northern Sami"
    },
    {
        "key": "sg",
        "value": "Sango",
        "label": "Sango"
    },
    {
        "key": "si",
        "value": "Sinhala/Sinhalese",
        "label": "Sinhala/Sinhalese"
    },
    {
        "key": "sk",
        "value": "Slovak",
        "label": "Slovak"
    },
    {
        "key": "sl",
        "value": "Slovene",
        "label": "Slovene"
    },
    {
        "key": "sm",
        "value": "Samoan",
        "label": "Samoan"
    },
    {
        "key": "sn",
        "value": "Shona",
        "label": "Shona"
    },
    {
        "key": "so",
        "value": "Somali",
        "label": "Somali"
    },
    {
        "key": "sq",
        "value": "Albanian",
        "label": "Albanian"
    },
    {
        "key": "sr",
        "value": "Serbian",
        "label": "Serbian"
    },
    {
        "key": "ss",
        "value": "Swati",
        "label": "Swati"
    },
    {
        "key": "st",
        "value": "Southern Sotho",
        "label": "Southern Sotho"
    },
    {
        "key": "su",
        "value": "Sundanese",
        "label": "Sundanese"
    },
    {
        "key": "sv",
        "value": "Swedish",
        "label": "Swedish"
    },
    {
        "key": "sw",
        "value": "Swahili",
        "label": "Swahili"
    },
    {
        "key": "ta",
        "value": "Tamil",
        "label": "Tamil"
    },
    {
        "key": "te",
        "value": "Telugu",
        "label": "Telugu"
    },
    {
        "key": "tg",
        "value": "Tajik",
        "label": "Tajik"
    },
    {
        "key": "th",
        "value": "Thai",
        "label": "Thai"
    },
    {
        "key": "ti",
        "value": "Tigrinya",
        "label": "Tigrinya"
    },
    {
        "key": "tk",
        "value": "Turkmen",
        "label": "Turkmen"
    },
    {
        "key": "tl",
        "value": "Tagalog",
        "label": "Tagalog"
    },
    {
        "key": "tn",
        "value": "Tswana",
        "label": "Tswana"
    },
    {
        "key": "to",
        "value": "Tonga (Tonga Islands)",
        "label": "Tonga (Tonga Islands)"
    },
    {
        "key": "tr",
        "value": "Turkish",
        "label": "Turkish"
    },
    {
        "key": "ts",
        "value": "Tsonga",
        "label": "Tsonga"
    },
    {
        "key": "tt",
        "value": "Tatar",
        "label": "Tatar"
    },
    {
        "key": "tw",
        "value": "Twi",
        "label": "Twi"
    },
    {
        "key": "ty",
        "value": "Tahitian",
        "label": "Tahitian"
    },
    {
        "key": "ug",
        "value": "Uyghur/Uighur",
        "label": "Uyghur/Uighur"
    },
    {
        "key": "uk",
        "value": "Ukrainian",
        "label": "Ukrainian"
    },
    {
        "key": "ur",
        "value": "Urdu",
        "label": "Urdu"
    },
    {
        "key": "uz",
        "value": "Uzbek",
        "label": "Uzbek"
    },
    {
        "key": "ve",
        "value": "Venda",
        "label": "Venda"
    },
    {
        "key": "vi",
        "value": "Vietnamese",
        "label": "Vietnamese"
    },
    {
        "key": "vo",
        "value": "Volapük",
        "label": "Volapük"
    },
    {
        "key": "wa",
        "value": "Walloon",
        "label": "Walloon"
    },
    {
        "key": "wo",
        "value": "Wolof",
        "label": "Wolof"
    },
    {
        "key": "xh",
        "value": "Xhosa",
        "label": "Xhosa"
    },
    {
        "key": "yi",
        "value": "Yiddish",
        "label": "Yiddish"
    },
    {
        "key": "yo",
        "value": "Yoruba",
        "label": "Yoruba"
    },
    {
        "key": "za",
        "value": "Zhuang/Chuang",
        "label": "Zhuang/Chuang"
    },
    {
        "key": "zh",
        "value": "Chinese",
        "label": "Chinese"
    },
    {
        "key": "zu",
        "value": "Zulu",
        "label": "Zulu"
    }
  ];
  return languageArray;
}





