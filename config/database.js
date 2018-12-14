var mysql= require('mysql');

//For online database on aws server

module.exports={
 'connection':   {
				      
				      host:"localhost",
				      user:"root",
				      password:"hihello123@",
				      database:"concrete"
				      
                 }
};
console.log("database");


//For local host


// module.exports={
  
//   'connection': {    host:"localhost",
//                    	user:"root",
//         			 password:"abhi",
//       				database:"concrete"
//             }

// };