const express = require('express');
const path = require('path');
const ejsMate = require('ejs-mate');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();


const PORT = process.env.PORT || 3000;


// Language translations
const translations = {
    en: {
        pricelist: 'Price List',
        welcome: 'Welcome to Parapet Pub',
        menu: 'Menu',
        language: 'Language',
        beer: 'Beer',
        cocktails: 'Cocktails',
        price: 'Price'
    },
    hr: {
        pricelist: 'Cjenik pića',
        welcome: 'Dobrodošli u Parapet Pub',
        menu: 'Cjenik',
        language: 'Jezik',
        beer: 'Pivo',
        cocktails: 'Kokteli',
        price: 'Cijena'
    }
};

app.use(cookieParser());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

// Middleware to set language
const setLanguage = (req, res, next) => {
    // Check cookie first, then query parameter, default to English
    const lang = req.cookies.language || req.query.lang || 'hr';
    
    // Validate language
    req.language = Object.keys(translations).includes(lang) ? lang : 'hr';
    
    // Set language cookie if not already set or changed
    if (req.cookies.language !== req.language) {
        res.cookie('language', req.language, { 
            maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
            httpOnly: true 
        });
    }

    // Make translations available to views
    res.locals.t = translations[req.language];
    res.locals.currentLang = req.language;
    
    next();
};

const pricelist = [
    {
        "id": "warmbev",
        "category":{
            en: "warm beverages",
            hr: "topli napitci"
        },
        "img": "hotbev.webp",
        "drinks":[
            {
                "name":"coffee",
                "size":"cup",
                "price": 1.8
            }
        ]
        
    },
    {
        "id": "nonalc",
        "category":{
            en: "non alcoholic",
            hr: "bezalkoholna pića"
        },
        "img": "hotbev.webp",
        "drinks":[
            {
                "name":"coca-cola",
                "size":"0.33",
                "price": 3.5
            },
            {
                "name":"fanta",
                "size":"0.33",
                "price": 3.5
            },
            {
                "name":"sprite",
                "size":"0.33",
                "price": 3.5
            },
            {
                "name":"tonic",
                "size":"0.33",
                "price": 3.5
            }
        ]
        
    },
    {
        "id": "beer",
        "category":{
            en: "beers",
            hr: "pivo"
        },
        "img": "hotbev.webp",
        "drinks":[
            {
                "name":"heineken",
                "size":"0.25",
                "price": 3
            }
        ]
        
    },
    {
        "id": "wine",
        "category":{
            en: "wines",
            hr: "vino"
        },
        "img": "hotbev.webp",
        "drinks":[
            {
                "name":"chardonnay",
                "size":"0.125",
                "price": 4.2
            }
        ]
        
    },
    {
        "id": "domalc",
        "category":{
            en:"domestic alcohol",
            hr:"domaće žestice"
        },

        "img": "hotbev.webp",
        "drinks":[
            {
                "name":"pelinkovac",
                "size":"0.03",
                "price": 2.5
            }
        ]
        
    }
]

app.get("/", setLanguage, (req, res)=>{
    
    res.render('home', {pricelist, languages: Object.keys(translations)});
})
// Language change route
app.get('/change-language', (req, res) => {
    const lang = req.query.lang;
    
    // Validate language
    if (Object.keys(translations).includes(lang)) {
        res.cookie('language', lang, { 
            maxAge: 365 * 24 * 60 * 60 * 1000, 
            httpOnly: true 
        });
    }

    // Redirect back to previous page or home
    res.redirect(req.get('referer') || '/');
});

app.listen(PORT, ()=>{
    console.log("Listening on port 3000");
})