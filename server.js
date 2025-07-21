// MODULES
const express = require("express");
const website = express();
const fileHandler = require("express-fileupload");
const cloudinary = require("cloudinary").v2;
const mailer = require("nodemailer");
const mysql2 = require("mysql2");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv").config(); // is to load the .env file into process.env
const port = process.env.PORT || 2000;

// CLUES AND HINTS
website.use(express.static("public")); // so that the server looks in ./public folder when checking for page hits
website.use(express.urlencoded(true)); // so that the binary data sent by form.method="post" is converted back into JSON
website.use(fileHandler()); // to recieve files such as pics, etc

// AIVEN MYSQL CONNECTIVITY
const aievnConfigURI = process.env.AIVEN_CONFIG_URI;
const mySQLServer = mysql2.createConnection(aievnConfigURI);
mySQLServer.connect(function(err){
    if(err)
        console.log("[ERROR]::AIVEN_CONNECT_FAILED: " + err);
})

// CLOUDINARY CONFIG
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

// GENERATIVE AI CONFIG
const genAIObject = new GoogleGenerativeAI(process.env.GOOGLE_AI_STUDIO_API);
const genAIModel = genAIObject.getGenerativeModel({model: process.env.GOOGLE_AI_MODEL});

// LISTENING PORT
website.listen(port, "0.0.0.0", function(err){
    if(err){
        console.log("PORT::ERROR: " + err);
    } else {
        console.log(`PORT::INFO::LISTENING ON PORT: ${port}`);
    }
})
website.get("/", function(req, res){
    const path = __dirname + "/public/index.html";
    res.sendFile(path);
})
website.get("/signup", function(req, res){
    let emailid = req.query.emailid;
    let password = req.query.password;
    let userType = req.query.userType;
    mySQLServer.query("insert into users(emailid, password, userType, dateOfSignup, userStatus) values(?,?,?,current_date(),1)", [emailid, password, userType], function(err){
        if(err){
            console.log("[ERROR]::SIGNUP_QUERY_INSERT: " + err);
        }
    })
})
website.get("/login", function(req, res){
    let emailid = req.query.emailid;
    // let password = req.query.password;
    mySQLServer.query("select * from users where emailid=?", [emailid], function(err, allRecords){
        if(err) {
            console.log("[ERROR]::LOGIN_QUERY_SELECT: " + err);
        } else {
            res.json(allRecords);
        }
    })
})
website.get("/organiser-dashboard", function(req, res){
    const path = __dirname + "/public/organiser-dashboard.html";
    res.sendFile(path);
})
website.get("/organiser-profile", function(req, res){
    const path = __dirname + "/public/organiser-profile.html";
    res.sendFile(path);
})
website.post("/organiser-profile-savedata", async function(req, res){
    var picURL = "";
    if(req.files != null)
    {
        let fileName = req.files.fileCertificateOrgProfile.name;
        let fullPath = __dirname + "/public/users/" + fileName;
        req.files.fileCertificateOrgProfile.mv(fullPath);

        await cloudinary.uploader.upload(fullPath).then(function(recievedPicURL){
            picURL = recievedPicURL.url;
            console.log("INFO::ORG_PROFILE_PIC_URL: " + picURL);
        });
    
    }
    else
    {
        picURL = "No Pic";
        console.log("ERROR_ORG_PROFILE_PIC_NOT_FOUND");
    }
    
    mySQLServer.query("insert into organisers values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [req.body.txtEmailOrgProfile,
            req.body.txtNameOrgProfile, 
            req.body.txtRegistrationNumberOrgProfile, 
            req.body.txtAddressOrgProfile, 
            req.body.txtCityOrgProfile, 
            req.body.comboStateOrgProfile, 
            req.body.txtZipOrgProfile, 
            req.body.txtSportsOrgProfile, 
            req.body.txtWebsiteOrgProfile, 
            req.body.txtInstaOrgProfile, 
            req.body.txtHeadNameOrgProfile, 
            req.body.txtHeadContactOrgProfile, 
            picURL, 
            req.body.msgOtherOrgProfile
        ],
        function(err){
            if(err)
                console.log("ERROR::INSERT_ORG_PROFILE_DATA: " + err);
            else
                console.log("ORG_PROFILE_DATA saved successfully.");
        }
    )
})
website.get("/organiser-list-tournament", function(req, res){
    const path = __dirname + "/public/organiser-list-tournament.html";
    res.sendFile(path);
})
website.get("/organiser-list-tournament-savedata", function(req, res){
    mySQLServer.query("insert into tournaments values(null,?,?,current_date(),?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [req.query.txtEmailOrgTournament,
            req.query.txtNameOrgTournament, 
            req.query.dateOrgTournament, 
            req.query.timeOrgTournament, 
            req.query.txtVenueOrgTournament, 
            req.query.txtCityOrgTournament, 
            req.query.comboStateOrgTournament, 
            req.query.txtZipOrgTournament, 
            req.query.txtSportsOrgTournament, 
            req.query.numMinAgeOrgTournament, 
            req.query.numMaxAgeOrgTournament, 
            req.query.dateLastOrgTournament,
            req.query.numFeeOrgTournament, 
            req.query.numPrizeOrgTournament, 
            req.query.txtManagerNameOrgTournament, 
            req.query.txtManagerContactOrgTournament, 
            req.query.msgOtherOrgTournament  
        ],
        function(err, info){
            if(err){
                console.log("ERROR::FAILED_INSERTING_NEW_TOURNAMENT: " + err);
            } else {
                console.log("INFO_INSERTING_NEW_TOURNAMENT::AFFECTED_ROWS: " + info.affectedRows);
            }
        }
    )
})
website.get("/organiser-tournament-history", function(req, res){
    const path = __dirname + "/public/organiser-tournament-history.html";
    res.sendFile(path);
})
website.get("/organiser-fetch-all-tournaments", function(req, res){
    mySQLServer.query("select * from tournaments", function(err, allRecords){
        if(err) {
            console.log("[ERROR]::ORGANISER_FETCH_ALL_TOURNAMENTS::QUERY_SELECT: " + err);
        } else {
            res.send(allRecords);
        }
    });
})
website.get("/player-dashboard", function(req, res){
    const path = __dirname + "/public/player-dashboard.html";
    res.sendFile(path);
})
website.get("/player-profile", function(req, res){
    const path = __dirname + "/public/player-profile.html";
    res.sendFile(path);
})
website.get("/player-browse-tournament", function(req, res){
    const path = __dirname + "/public/player-browse-tournament.html";
    res.sendFile(path);
})
website.get("/player-fetch-distinct-sports", function(req, res){
    mySQLServer.query("select distinct sport from tournaments", function(err, allRecords){
        if(err) {
            console.log("[ERROR]::QUERY_SELECT::FETCHING_DISTINCT_SPORT: " + err);
        } else {
            res.send(allRecords);
        }
    })
})
website.get("/player-fetch-distinct-cities", function(req, res){
    mySQLServer.query("select distinct city from tournaments", function(err, allRecords){
        if(err) {
            console.log("[ERROR]::QUERY_SELECT::FETCHING_DISTINCT_CITY: " + err);
        } else {
            res.send(allRecords);
        }
    })
})
website.get("/player-fetch-min-max-ages", function(req, res){
    mySQLServer.query("select min(minAge) as min, max(maxAge) as max from tournaments", function(err, allRecords){
        if(err) {
            console.log("[ERROR]::QUERY_SELECT::FETCHING_MIN_MAX_AGES: " + err);
        } else {
            // console.log(allRecords);
            res.send(allRecords);
        }
    })
})
website.get("/player-fetch-filtered-tournaments", function(req, res){
    // console.log(req.query);
    var query = "select * from tournaments where "; // the space is necessary at the end cuz the append doesnt contain space at the start
    console.log("Query_start: " + query);
    var atLeastOneFilter = false;

    for (const filterParamName in req.query) {
        if (Object.prototype.hasOwnProperty.call(req.query, filterParamName)) {
            const filterParamValue = req.query[filterParamName];

            if(filterParamName != "age") {
                if(filterParamValue != "undefined") {
                    // when nothing is selected, the first option's value would have been sent by default, 
                    // and becuz its value is empty (""), req.query[obj] will be undefined
                    // the Select option's value is empty becuz otherwise it won't show up in the selectbox in the browser
                    query += filterParamName + " = '" + filterParamValue + "' and "; // adding single quotes cuz sql is a bitch
                    atLeastOneFilter = true;
                    console.log("Query_inProgress: " + query);
                } else if(filterParamValue == "undefined") {
                    // skip
                } else {
                    console.log("[ERROR]::QUERY_CREATION::PLAYER_FETCH_FILTERED_TOURNAMENTS: filterParamValue neither 'undefined' nor 'defined'");
                }
            } else if(filterParamName == "age") {
                // console.log("age is: " + filterParamValue);
                query += "(minAge <= " + filterParamValue + " and maxAge >= " + filterParamValue + ") and ";
            } else {
                console.log("[ERROR]::QUERY_CREATION::PLAYER_FETCH_FILTERED_TOURNAMENTS: filterParamValue neither 'undefined' nor 'defined'");
            }
        }
    }

    if(atLeastOneFilter) {
        query = query.slice(0, query.length - 5); // removing the extra " and " from the end
    } else if(!atLeastOneFilter) {
        query = query.slice(0, query.length - 7); // removing the extra " where " from the end
    } else {
        console.log("[ERROR]::QUERY_CREATION::PLAYER_FETCH_FILTERED_TOURNAMENTS: boolean variable 'atLeastOneFilter' is unreadable");
    }
    console.log("Query_final: " + query);
    
    mySQLServer.query(query, function(err, allRecords){
        if(err) {
            console.log("[ERROR]::QUERY_SELECT::PLAYER_FETCH_FILTERED_TOURNAMENTS: " + err);
        } else {
            console.log(allRecords);
            res.send(allRecords);
        }
    })
})
website.get("/admin-console", function(req, res){
    const path = __dirname + "/public/admin-console.html";
    res.sendFile(path);
})
website.get("/admin-manage-users", function(req, res){
    const path = __dirname + "/public/admin-manage-users.html";
    res.sendFile(path);
})
website.get("/admin-fetch-users", function(req, res) {
    mySQLServer.query("select * from users", function(err, allRecords){
        if(err){
            console.log("[ERROR]::QUERY_SELECT::ADMIN_FETCH_ALL_USERS: " + err)
        } else {
            res.send(allRecords);
        }
    })
})
website.get("/admin-manage-players", function(req, res){
    const path = __dirname + "/public/admin-manage-players.html";
    res.sendFile(path);
})
website.get("/admin-fetch-players", function(req, res){
    mySQLServer.query("select * from players", function(err, allRecords){
        if(err){
            console.log("[ERROR]::QUERY_SELECT::ADMIN_FETCH_ALL_PLAYERS: " + err)
        } else {
            // console.log(allRecords);
            res.send(allRecords);
        }
    })
})
website.get("/admin-manage-organisers", function(req, res){
    const path = __dirname + "/public/admin-manage-organisers.html";
    res.sendFile(path);
})
website.get("/admin-fetch-organisers", function(req, res){
    mySQLServer.query("select * from organisers", function(err, allRecords){
        if(err){
            console.log("[ERROR]::QUERY_SELECT::ADMIN_FETCH_ALL_ORGANISERS: " + err)
        } else {
            res.send(allRecords);
        }
    })
})