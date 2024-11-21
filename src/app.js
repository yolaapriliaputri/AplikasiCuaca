const express = require('express');
const hbs = require('hbs');
const path = require('path');

const app = express();
const port = process.env.PORT || 4000;
const geocode = require('./utils/geocode');
const forecast = require('./utils/prediksiCuaca');

// Set view engine
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../templates/views'));

// Menyajikan file statis
app.use(express.static(path.join(__dirname, '../templates')));
app.use(express.static(path.join(__dirname, '../public')));

// Set partials
hbs.registerPartials(path.join(__dirname, '../templates/partials'));

// Rute
app.get('/', (req, res) => {
    res.render('index', {
        judul: 'Aplikasi Cek Cuaca',
        nama: 'Yola Aprilia Putri'
    });
});

// Rute untuk info cuaca
app.get('/infocuaca', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'Kamu harus memasukan lokasi yang ingin dicari'
        });
    }
    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error });
        }
        forecast(latitude, longitude, (error, dataPrediksi) => {
            if (error) {
                return res.send({ error });
            }
            res.send({
                prediksiCuaca: dataPrediksi,
                lokasi: location,
                address: req.query.address
            });
        });
    });
});

// Rute untuk halaman tentang
app.get('/tentang', (req, res) => {
    res.render('tentang', {
        judul: 'Tentang Saya',
        nama: 'Yola Aprilia Putri'
    });
});

// Rute untuk halaman bantuan
app.get('/bantuan', (req, res) => {
    res.render('bantuan', {
        judul: 'Bantuan dan Dukungan'
    });
});

// Rute untuk halaman penjelasan
app.get('/penjelasan', (req, res) => {
    res.render('penjelasan', {
        judul: 'Penjelasan Aplikasi Cek Cuaca'
    });
});

// Wildcard route untuk halaman tidak ditemukan
app.get('*', (req, res) => {
    res.render('404', {
        pesanKesalahan: 'Halaman tidak ditemukan.'
    });
});


// Jalankan server
app.listen(port, () => {
    console.log('Server berjalan pada port '+ port);
});
