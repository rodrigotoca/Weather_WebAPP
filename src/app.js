const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('../public/js/utils/geocode')
const forecast = require('../public/js/utils/forecast');

const app = express()
const port = process.env.PORT || 3000

//Define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//Setup static directory to seve
app.use(express.static(publicDirectoryPath)) //Aqui le decimos al servidor la ubicacion en la que opera, en este caso el dir public

app.get('', (req,res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Rodrigo Toca'
    })
})

app.get('/about', (req,res) => {
    res.render('about', {
        title: 'About me',
        name: 'Rodrigo Toca'
    })
})

app.get('/help', (req,res) => {
    res.render('help', {
        title:'Help',
        name:'Rodrigo Toca'
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address) {
        return res.send({
            error:'Address not provided'
        })
    }

    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if (error) {
            return res.send({
                error:'Unable to reach geo server'
            })
        }
    
        forecast(latitude, longitude, (error, forecastData) => {
            if (error){
                return res.send({
                    error:'Cannot reach weather server'
                })
            }
            res.send({
                forecast:`Temperature: ${forecastData.temperature}, it feels like ${forecastData.temperatureFeel}`,
                location: location,
                address: req.query.address
            })
        })   
    })
})

//404 page not found code. IMPORTANTE: Hay que tener este código al final del código, antes de app.listen(...)
//*: Aplica para todas las busquedas que no esten descritas arriba, le llaman wildcard
app.get('/help/*', (req,res) => {
    res.render('404page',{
        title:'404 Error',
        message:'Help article not found.'
    })
})

app.get('*', (req,res) => {
    res.render('404page',{
        title:'404 Error',
        message:'PAge not found.'
    })
})

app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})