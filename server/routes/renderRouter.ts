import Rout, {Request,Response} from 'express'
const renderRoutes = Rout()

renderRoutes.get('/index', (req:Request,res:Response)=>{
    res.render('index')
})

renderRoutes.get('/login', (req:Request,res:Response)=>{
    res.render('login')
})

renderRoutes.get('/managers', (req:Request,res:Response)=>{
    res.render('managers')
})

renderRoutes.get('/password', (req:Request,res:Response)=>{
    res.render('password')
})

renderRoutes.get('/profile', (req:Request,res:Response)=>{
    res.render('profile')
})

renderRoutes.get('/queue', (req:Request,res:Response)=>{
    res.render('queue')
})

renderRoutes.get('/registration', (req:Request,res:Response)=>{
    res.render('registration')
})

renderRoutes.get('/team', (req:Request,res:Response)=>{
    res.render('team')
})

export default renderRoutes