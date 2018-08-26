var user = function(username, password) {
    this.username = username;
    this.password = password;
};

var userList = [];

var userLoggedIn;

//true if private
var post = function(postTitle, postDirectory, postTags, postOwner, postPrivacy, postViewers){
    this.postTitle = postTitle;
    this.postDirectory = postDirectory;
    this.postTags = postTags;
    this.postOwner = postOwner;
    this.postPrivacy = postPrivacy;
    this.postViewers = postViewers;
};

var postList = [];

/*DUMMY DATA*/
userList.push(new user("xTianDK2", "waw"));
userList.push(new user("xxxTwiceFan09xxx", "waw"));
userList.push(new user("Jane", "waw"));
userList.push(new user("KimYerim", "waw"));


var tags = ["momoland", "nancy", "eheads"];
var viewers = [];
postList.push(new post("Advance magisip", "MP1pics/meme1", tags, "xTianDK2", false, viewers));

tags = ["milk", "waw"];
viewers = [];
postList.push(new post("Relatable", "MP1pics/meme2", tags, "xxxTwiceFan09xxx", false, viewers));

tags = ["marijuana"];
viewers = ["xTianDK2"];
postList.push(new post("Murica", "MP1pics/meme3", tags, "Jane", true, viewers));

tags = ["oxygen", "relatable", "tag1", "tag2"];
viewers = ["xTianDK2", "Jane", "KimYerim"];
postList.push(new post("So true", "MP1pics/meme4", tags, "KimYerim", true, viewers));

tags = ["starwars"];
viewers = [];
postList.push(new post("Huwaw", "MP1pics/meme5", tags, "xTianDK2", true, viewers));

tags = ["emoji", "cancer"];
viewers = [];
postList.push(new post("Im Dead", "MP1pics/meme6", tags, "xxxTwiceFan09xxx", false, viewers));

/*DUMMY DATA*/

//$(document).ready(function () {
//    $("#signupButton").click(function(){
//         console.log("cksdfadsf");
//        var username = document.getElementById("usernameForm").val;
//        var password = document.getElementById("passwordForm").val;
//
//
//        if(username == null || password == null){
//            console.log(username + password);
//            //alert("Please fill up all fields")
//        }
//        else{
//            console.log(username + password);
//            console.log("complete field");
//        }
//    });
//});

//$(document).ready(function() {
//  $("#signupButton").click(function () {
//      console.log("clicked");
//    var username = $("#usernameForm").val();
//    var password = $("#passwordForm").val();
//    
//    console.log(username);
//  });
//});



$(document).ready(function() {
    
    function renderPage(){
        console.log(userLoggedIn);
        //var name = document.createElement("div");
        //name.className = "text-light nav-link";
        //$(name).text(userLoggedIn);
        //$("#welcome").append(name);
    };
    
    $("#signupButton").click(function () {
        var username = $("#usernameSignupForm").val();
        var password = $("#passwordSignupForm").val();
        var hit = false;
        
        if(username == "" || password == ""){
            alert("Please fill up all fields");
        }
        else{
            userList.forEach(function(element) {
                if(element.username == username){
                    hit=true;
                }
            });
            
            if(!hit){
                userList.push(new user(username, password));
            }
            userList.forEach(function(element) {
                console.log(element.username);
            });
        }
    });
    
    $("#loginButton").click(function () {
        var username = $("#usernameLoginForm").val();
        var password = $("#passwordLoginForm").val();
        var hitUsername = false;
        var hitPassword = false;
        
        if(username == "" || password == ""){
            alert("Please fill up all fields");
        }
        else{
            userList.forEach(function(element) {
                if(element.username == username){
                    hitUsername=true;
                }
                if(element.password == password){
                    hitPassword=true;
                }
            });
            
            if(hitUsername && hitPassword && username == "Jane"){
                userLoggedIn= username;
                //link to log in
                alert("Log in Succesful");
                window.location = "indexLoggedInJane.html";
            }
            
            else if(hitUsername && hitPassword && username == "KimYerim"){
                userLoggedIn= username;
                //link to log in
                alert("Log in Succesful");
                window.location = "indexLoggedInYerim.html";
            }
            
            else{
                alert("Wrong username or Password");
            }
            
        }
    });
    
    $("#logoutButton").click(function () {
        userLoggedIn = "";
        window.location = "index.html";
    });
    
    
     $("#profileJane").click(function () {
        
        window.location = "userProfileJane.html";
    });
    
        $(".byProfileJane").click(function () {
        
        window.location = "userProfileJane.html";
    });
    
     $("#profileYeri").click(function () {
        
        window.location = "userProfileYerim.html";
    });
    
        $(".byProfileYeri").click(function () {
        
        window.location = "userProfileYerim.html";
    });
   
    $("#homeJane").click(function () {
        
        window.location = "indexLoggedInJane.html";
    });
    
    $("#homeYeri").click(function () {
        
        window.location = "indexLoggedInYerim.html";
    });
    
     $(".byProfileKimtoJane").click(function () {
        
        window.location = "KimvisitJane.html";
    });
    
    $(".byProfileJanetoKim").click(function () {
        
        window.location = "JanevisitKim.html";
    });
});

//$(document).ready(function() {
//    $("#loginButton").click(function () {
//        var username = $("#usernameLoginForm").val();
//        var password = $("#passwordLoginForm").val();
//        var hitUsername = false;
//        var hitPassword = false;
//        
//        if(username == "" || password == ""){
//            alert("Please fill up all fields");
//        }
//        else{
//            userList.forEach(function(element) {
//                if(element.username == username){
//                    hitUsername=true;
//                }
//                if(element.password == password){
//                    hitPassword=true;
//                }
//            });
//            
//            if(hitUsername && hitPassword){
//                userLoggedIn= username;
//                //link to log in
//                alert("Log in Succesful");
//                window.location = "indexLoggedIn.html";
//                console.log("flasjd");
//                renderPage();
//            }
//            else{
//                alert("Wrong username or Password");
//            }
//            
//        }
//    });
//});
//
//$(document).ready(function() {
//    $("#logoutButton").click(function () {
//        userLoggedIn = "";
//        window.location = "index.html";
//    });
//});
//
