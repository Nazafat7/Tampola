const restify=require('restify');
const {Pool}=require('pg');
//Create Restify server
const server=restify.createServer();

// parse Body restify plugin
// server.use(restify.plugins.bodyParser());
server.use(restify.plugins.bodyParser({ mapParams: false }));

server.use(restify.plugins.queryParser());

//Set up PostgreSQL connection:
const pool =new Pool({
   user:'postgres',
   password:'admin',
   host:'localhost',
   port:5432,
   database:'postgres'
})
//create user Api
server.post('/api/createUser',(req,res,next)=>{
   const data = req.body;
   pool.query(`INSERT INTO user_profile 
   (created_date, updated_date, user_name, passwrod, email)VALUES(now(),now(),$1,$2,$3)returning id`,[data.username,data.password,data.email]).then((result)=>{
      console.log(result.rows);
       if(result.rows.length===0){
         res.send(401,'Invalid Data')
       }else{
         res.send(200,'User Added Successfull');
       }
       next();
   }).catch((error)=>{
      res.send(500,'An error occured')
      console.log('error',error);
      next();
   })
})
//Login route
server.post('/api/login',(req,res,next)=>{
   const data=req.body;
    console.log("data",data);
    if (!email || !password) {
      res.send(400, 'Username and password are required');
      return;
    }
   pool.query(`SELECT * from user_profile where email=$1 AND passwrod=$2`,[data.email,data.password]).then((result)=>{
       if(result.rows.length===0){
         res.send(401,'Invalid Credentials')
       }else{
         res.send(200,'Login Successful');
       }
       next();
   }).catch((error)=>{
      res.send(500,'An error occured')
      console.log('error',error);
      next();
   })
})

//Tickets Api
server.post('/api/tickets',(req,res,next)=>{
   const numTickets=req.body.numTickets || 1;
   const tickets=generateTickets(numTickets);
   pool.query(`INSERT INTO tickets(ticket_data)VALUES($1) returning id`,[tickets],(error,result)=>{
     if(error){
      console.error('Error creating ticket:', error);
      res.send(500, { error: 'Failed to create ticket' });
     }else{
      const ticketId = result.rows[0].id;
      res.send({ ticketId });
     }
     next();
   })
})

//Generate Tickets 
function generateTickets(numTickets){

   const tickets = [];
   for(let i = 0; i<numTickets ; i++){
      const ticket = [];
      const numbers =Array.from({length:90},(_,index)=> index + 1);
      shuffle(numbers);

      for(let col=0;col<9;col++){
         const column=[];

         for(let row = 0; row<3;row++){
            const num=numbers.shift();
            column.push(num);
         }
         column.sort((a,b)=>a-b)
         ticket.push(...column)
      }
      tickets.push(ticket);
   }
   console.log("GenerateTicket",tickets)
   return tickets;
   
}

//Shuffle Tickets
function shuffle(array){
   console.log("Suffle ARRY",array);
   for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
}

// Ticket List
server.post('/api/ticketsList', (req, res, next) => {
   // try {
   //   const { id, page } = req.query;
   //   let limit =10;
   //   const offset = (page - 1) * limit;
   //   const query = `SELECT * FROM tickets WHERE id = $1 ORDER BY id LIMIT $2 OFFSET $3`;
   //   const values = [id, limit, offset];
 
   //   const result = await pool.query(query, values);
   //   const tickets = result.rows;
 
   //   res.send(tickets);
   //   next();
   // } catch (error) {
   //   console.error(error);
   //   res.send(500, 'Internal Server Error');
   // }

   // const { id, page } = req.body;
   const data=req.body;
   console.log("data",data);
   // const { id, page } = req.query;
   let limit =10;
   const offset = parseInt(data.page - 1) * limit;
   console.log("OFFSET",offset);
   console.log("IDDDDD",data.id);
   console.log("limit",limit);
   pool.query(`SELECT * FROM tickets WHERE id = $1 ORDER BY id LIMIT $2 OFFSET $3`,[data.id, limit, offset],(error,result)=>{
      console.log("Result",result)
     if(error){
      console.error('Error creating ticket:', error);
      res.send(500, { error: 'Failed to create ticket' });
     }else{
      const tickets = result.rows;
       res.send(tickets);
     }
     next();
   })
 });
 
 

//Specify port Number
const port = 8080;
server.listen(port,()=>{
    console.log('Server is running in 8080');
})