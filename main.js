//requieres for the program
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

//Model
let posts = require('./src/models/postes');
let comments = require('./src/models/comments')
const { redirect } = require('express/lib/response');

//const 
const port = process.env.PORT;
let path = __dirname + '/src/views';
app.set('views', path)
app.set('view engine', 'ejs')

//Static File 
app.use('/css', express.static('node_modules/bootstrap/dist/css'));
app.use(express.static('src'));
app.use(bodyParser.urlencoded({extended:true}));
// app.use( express.static( __dirname  +  '/src/styles') ); para colocar css
//Bd mongo
mongoose
    .connect(process.env.MONGODB)
    .then((db)=>{
        console.log('Conectado en la base de datos');
    }).catch((err)=>{
        console.log('Se ha producido un error al conectar' + err);
    })

//directions
app.get('/', async (req,res)=>{
    let findb = await posts.find();
    // console.log(findb)
    res.render('index', {find:findb});
})

app.get('/crear', (req,res)=>{
    res.render('crear');
})

app.post('/generar', async(req,res)=>{
    let doc = req.body
    let date = new Date();
    let calendar = `${date.getDay()} / ${date.getMonth()} / ${date.getFullYear()}`;
    let time = `${date.getHours()} - ${date.getMinutes()} - ${date.getSeconds()}`;
    let obj={
        calendar,
        time,
        ...doc
    }
    let post = await new posts(obj)
    post.save()
    res.redirect('/');
})

app.get('/eliminar/:id', async(req,res)=>{
    let doc = req.params.id
    let bds = await posts.findById(String(doc)) 
    await bds.remove()
    res.redirect('/');
})
app.get('/editar',(req,res)=>{
    res.render('editar')
})
app.get('/editar/:id', async (req,res)=>{
    let base = req.params.id;
    let bsa = await posts.findById(String(base));
    res.render('editar',{bs:bsa});
})

app.post('/modificar/:id',async (req,res)=>{
    let ids = req.params.id
    let dbs = await posts.updateOne({_id:ids},req.body);
    res.redirect('/')
})
app.get('/vermas/:idss', async (req,res)=>{
    let id = req.params.idss;
    let doc = await posts.findById(String(id));
    res.render('vermas',{mas:doc});
})
app.post('/filter',async(req,res)=>{
    //mejorar buscador
    let value = req.body.filte;
    let key = req.body.seleccion;
    console.log(value)
    console.log(key)
    if(key == 'titulo'){
        let findb = await posts.find({
            titulo:{
                $in:[new RegExp(`${value}`,'i')]
            }
        });
        res.render('index',{find:findb});
    }else if(key == 'creador'){
        let findb = await posts.find({
            creador:{
                $in:[new RegExp(`${value}`,'i')]
            }
        });
        res.render('index',{find:findb});
    }else if(key == 'categoria'){
        let findb = await posts.find({
            categoria:{
                $in:[new RegExp(`${value}`,'i')]
            }
        });
        res.render('index',{find:findb});
    }else{
        let findb = await posts.find();
        res.render('index',{find:findb});
    }
})
// app.post('/comment', async(req,res)=>{
//     let doc = req.body;
//     let bdc = await new comments(doc);
//     await bdc.save();
//     res.render('vermas')
// })
// app.get('/vermas', async(req,res)=>{
//     let doc = await comments.find();
//     await res.render('mensaje',{mensajes:doc})
// })
//Connect to the Port
app.listen(port,()=>{
    console.log('Estamos conectados en el puerto' + port)
})
