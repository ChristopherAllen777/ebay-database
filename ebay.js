
var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  // Your username
  user: "root",
  // Your password
  password: "test",
  database: "greatbay_db"
});
//-- inquirer  --//
  var inquirer = require("inquirer");
  var postResponses;
  var bidResponses;
connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  mainMenu();
});
function mainMenu(){
inquirer.prompt([
{
    type:"list",
    message:"What do you want to do ?",
    choices:["POST AN ITEM","BID ON AN ITEM", "EXIT"],
    name:"whattodo"
}
    ]).then(function(answers){
        switch(answers.whattodo){
            case "POST AN ITEM":
                postItem();
                break;
            case "BID ON AN ITEM":
                bidItem();
                break;
            case "EXIT":
                console.log("Thank you for your interest in our auction.")
                return;
                break;
        }
    })
};
function postItem(){
    console.log("Post Item Reached");
    inquirer.prompt([
    {
        type: "input",
        name: "typeItem",
        message: "What type of item would you like to post?"
    },{
        type: "input",
        name: "describeItem",
        message: "Can you describe the item?"
    },{
        type: "input",
        name: "priceItem",
        message: "How much would you like to sell the item for?"
    }
    ]).then(function(postItem){
        postResponses = postItem;
        console.log(postResponses);
        connection.query("INSERT INTO auctionItems SET ?", {
          gbType: postItem.typeItem,
          gbDesc: postItem.describeItem,
          bidAmt: postItem.priceItem
        }, function(err, res) {
          if (err) throw err;
          console.log(res);
        });
    })
 //mainMenu();
}
   
function bidItem(){
      console.log("Bid Item Reached");
       connection.query("SELECT * FROM auctionItems", function(err, res) {
            bidResponses = res;
            if (err) throw err;
            //console.log(res);
          for (var i = 0; i<bidResponses.length; i++)
           { var displayresults = '-------------------------------------------------------------------------------------------' + "\r\n" + 
            ' Item Num: ' + bidResponses[i].id + "     Type: " + bidResponses[i].gbType + "      Description: " + bidResponses[i].gbDesc + "     Price: " + bidResponses[i].bidAmt 
             console.log(displayresults) }
        });
        
    inquirer.prompt([
    {
        type: "input",
        name: "itemNum",
        message: "Which item Num would you like to bid on?"
    },
    {
        type: "input",
        name: "priceItem",
        message: "How much would you like to pay for the item ?"
    }
    ]).then(function(bidItem){
         for (var i = 0; i<bidResponses.length; i++)
            {  if (bidResponses[i].id = bidItem.itemNum)
                { if (bidResponses[i].bidAmt < bidItem.priceItem)
                    { connection.query("UPDATE auctionItems SET ? WHERE ? ", [
                            { bidAmt:  bidItem.priceItem },
                            {id: bidItem.itemNum}
                          ], function(err, res) {
           
                     if (err) throw err;
                         console.log ("you the highest bid!!!")
                        })
                    }
                }
            }
        });
         
      };