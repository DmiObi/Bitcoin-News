const PORT = process.env.PORT || 8000
const express = require('express') // for creating a server 
const axios = require('axios') // for making http requests 
const cheerio = require('cheerio')
const app = express()

const newspapers = [
    {
        name: 'bbc',
        address: 'https://www.bbc.com/news/topics/c734j90em14t',
        base: 'https://www.bbc.co.uk',
    },
    {
        name: 'smh',
        address: 'https://www.smh.com.au/topic/bitcoin-hqn',
        base: 'https://www.smh.com.au',
    },
    {
        name: 'thetimes',
        address: 'https://www.nytimes.com/topic/subject/bitcoin',
        base: ''
    },
    {
        name: 'nyt',
        address: 'https://www.nytimes.com/topic/subject/bitcoin',
        base: '',
    },
    {
        name: 'nytimes',
        address: 'https://www.nytimes.com/topic/subject/bitcoin',
        base: ''
    },
]

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html) // for grabbing thml elements

            // look for a tags that contain a key word "Bitcoin"
            $('a:contains("Bitcoin")', html).each(function () {
                const title = $(this).text() // grab the text that has the word "bitcoin"
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })

        })
})

app.get('/', (req, res) => {
    res.json('Welcome to my Bitcoin News API')
})

app.get('/news', (req, res) => {
    res.json(articles)
})

// returns all articles from a specific news source
app.get('/news/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base


    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("Bitcoin")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('Bitcoin')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))