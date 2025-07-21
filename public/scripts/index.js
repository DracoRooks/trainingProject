let signupEmailFlag = false;
let signupPasswordFlag = false;
let signupComboFlag = false;
let loginFlag = true;

$(document).ready(function(){
    $("#AJAXSignup").click(function(){
        let pass1 = $("#txtPwdSignup1").val();
        let pass2 = $("#txtPwdSignup2").val();
        let pass = "";
        let userType = 0;
        
        // checking if any of the input fields are empty, chkElementEmpty() returns true if element is empty
        if(chkElementEmpty($("#txtEmailSignup"), $("#email-validation-signup"), "Email")) { console.log("email empty!"); }
        if(chkElementEmpty($("#txtPwdSignup1"), $("#password1-validation-signup"), "Password")) { console.log("pass1 empty!"); }
        if(chkElementEmpty($("#txtPwdSignup2"), $("#password2-validation-signup"), "Password")) { console.log("pass2 empty!"); }
        if(chkComboEmpty($("#comboUserTypeSignup"), $("#userType-validation-signup"))) { signupComboFlag = false; }

        // checking if both password fields are same or not, if aren't, update the validation box and return
        if (pass1 != pass2) {
            $("#password2-validation-signup").html("Passwords don't match.");
            return;
        } else if (!signupPasswordFlag) {
            $("#modal-validation-signup").html("Password is too weak!");
            $("#modal-validation-signup").css("color", "red");
            return;
        } else {
            signupPasswordFlag = true;
            pass = pass1;
        }
        
        // setting the local variable to whatever the value of userType is
        if($("#comboUserTypeSignup").val() == "1") { // organiser
            userType = 1;
            signupComboFlag = true;
            $("#userType-validation").html("");
        } else if ($("#comboUserTypeSignup").val() == "2") { // player
            userType = 2;
            signupComboFlag = true;
            $("#userType-validation").html("");
        }

        // checking to see if the password passed all security criteria, if didn't, return
        if(!signupEmailFlag || !signupPasswordFlag || !signupComboFlag) {
            $("#modal-validation-signup").html("Please fill the data as intended.");
            $("#modal-validation-signup").css("color", "red");
            console.log(signupEmailFlag);
            console.log(signupPasswordFlag);
            console.log(signupComboFlag);
            return;
        }

        // ajax object
        let obj = {
            type: "get",
            url: "/signup",
            data: {
                emailid: $("#txtEmailSignup").val(),
                password: pass,
                userType: userType,
            }
        };

        $.ajax(obj).then(function(responseArray){ alert(responseArray); }).fail(function(err){ console.log(err); });

        alert("Signed up successfully.");
    })
    //------------------------------------------------------------------------------------------------------------

    $("#signup").click(function(){ // function to reset signup modal on button click
        // resetting input fields
        $("#txtEmailSignup").val("");
        $("#txtPwdSignup1").val("");
        $("#txtPwdSignup2").val("");
        $("#comboUserTypeSignup").val("0");

        // resetting validaion fields
        $("#email-validation-signup").html("");
        $("#password1-validation-signup").html("We won't share your password!");
        $("#password2-validation-signup").html("");
        $("#userType-validation-signup").html("");
    })
    //------------------------------------------------------------------------------------------------------------

    $("#signup-to-login").click(function(){ // function to reset signup modal on button click
        // resetting input fields
        $("#txtEmailSignup").val("");
        $("#txtPwdSignup1").val("");
        $("#txtPwdSignup2").val("");
        $("#comboUserTypeSignup").val("0");

        // resetting validaion fields
        $("#email-validation-signup").html("");
        $("#password1-validation-signup").html("We won't share your password!");
        $("#password2-validation-signup").html("");
        $("#userType-validation-signup").html("");
    })
    //------------------------------------------------------------------------------------------------------------

    $(".emailValidate").blur(function(){
        let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        let emailValidarionDivRef = "#" + this.getAttribute("aria-errormessage");

        if(emailRegex.test($(this).val())) {
            $(emailValidarionDivRef).html("");
            signupEmailFlag = true;
        } else {
            $(emailValidarionDivRef).html("Not a valid E-mail.");
            signupEmailFlag = false;
        }
    })
    //------------------------------------------------------------------------------------------------------------

    $(".passwordValidate").keyup(function(){
        // Minimum eight characters, at least one letter and one number
        let passwordRegex1 = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

        // Minimum eight characters, at least one letter, one number and one special character:
        let passwordRegex2 = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

        // Minimum eight characters, at least one uppercase letter, one lowercase letter and one number:
        let passwordRegex3 = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

        // Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character:
        let passwordRegex4 = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        let numberRegex = /^(?=.*\d)[A-Za-z\d@$!%*?&]{1,}$/;
        let symbolRegex = /^(?=.*[@$!%*#?&])[A-Za-z\d@$!%*?&]{1,}$/;
        let lowercaseRegex = /^(?=.*[a-z])[A-Za-z\d@$!%*?&]{1,}$/;
        let uppercaseRegex = /^(?=.*[A-Z])[A-Za-z\d@$!%*?&]{1,}$/;
        let characterCountRegex = /^[A-Za-z\d@$!%*?&]{8,}$/;

        let pass1 = $(this).val();
        let passwordValidationDivRef = "#" + $(this).attr("aria-errormessage");

        // alert(passwordValidationDivRef);
        if(!lowercaseRegex.test(pass1)) {
            $(passwordValidationDivRef).html("Password must contain atleast one lowercase character.");
            signupPasswordFlag = false;
        } else if(!uppercaseRegex.test(pass1)) {
            $(passwordValidationDivRef).html("Password must contain atleast one uppercase character.");
            signupPasswordFlag = false;
        } else if(!numberRegex.test(pass1)) {
            $(passwordValidationDivRef).html("Password must include atleast one number.");
            signupPasswordFlag = false;
        } else if(!symbolRegex.test(pass1)) {
            $(passwordValidationDivRef).html("Password must include atleast one special symbol.");
            signupPasswordFlag = false;
        } else if(!characterCountRegex.test(pass1)) {
            $(passwordValidationDivRef).html("Password must contain atleast 8 characters.");
            signupPasswordFlag = false;
        } else {
            $(passwordValidationDivRef).html("Strong password!");
            signupPasswordFlag = true;
        }
    })
    //------------------------------------------------------------------------------------------------------------

    $("#AJAXLogin").click(function(){
        if(chkElementEmpty($("#txtEmailLogin"), $("#email-validation-login"), "Email")) { console.log("Email empty!"); }
        if(chkElementEmpty($("#txtPwdLogin"), $("#password-validation-login"), "Password")) { console.log("Password empty!"); }

        var obj = {
            type: "get",
            url: "/login",
            data: {
                emailid: $("#txtEmailLogin").val(),
                // password: $("#txtPwdLogin").val()
            }
        };

        $.ajax(obj).then(function(allRecords){ 
            // alert(JSON.stringify(allRecords[0]));
            if(allRecords.length == 0) {
                alert("We don't know this Email. Try signing up instead?");
            } else if(allRecords.length == 1) {
                if(allRecords[0].password == $("#txtPwdLogin").val()) {
                    if(allRecords[0].userStatus == 1) {
                        // alert("Logged in successfully.");
                        localStorage.setItem("activeUser", allRecords[0].emailid);
                        // alert(localStorage.getItem("activeUser"));
                        
                        if(allRecords[0].userType == 1) { // player
                            location.href = "/player-dashboard";
                        } else if(allRecords[0].userType == 2) { // organiser
                            location.href = "/organiser-dashboard";
                        } else if(allRecords[0].userType == -1) { // admin breh, i gotta be special since i fucking built it
                            location.href = "/admin-console";
                        } else {
                            console.log("[ERROR]:: LOGIN::USER_TYPE_NOT_FOUND");
                        }
                    } else if(allRecords[0].userStatus == 0) {
                        alert("Sorry, you are blocked by the admin.");
                    } else {
                        alert("Something is wrong, fix it.");  
                    }
                } else if(allRecords[0].password != $("#txtPwdLogin").val()) {
                    alert("Incorrect Password.");
                } else {
                    alert("Something is horribly wrong, fix it.");
                }
            } else {
                alert(JSON.stringify(allRecords));
                alert("Somehow the number of accounts found is neither 0 nor 1.");
            }
         }).fail(function(err){ console.log(err); });
    })
    //------------------------------------------------------------------------------------------------------------

    $(".signup-modal-input").click(function(){
        $("#modal-validation-signup").html("");
        $("#modal-validation-signup").css("color", "white");
    })
    //------------------------------------------------------------------------------------------------------------

    $(".btn-toggle-password-signup").click(function(){
        let txtPwdSignup = $("#" + this.getAttribute("aria-controls"));
        let iconToggle = $("#" + this.getAttribute("aria-describedby"));

        if(txtPwdSignup.prop("type") == "password") {
            txtPwdSignup.prop("type", "text");
            iconToggle.removeClass("fa-eye").addClass("fa-eye-slash");
        } else if(txtPwdSignup.prop("type") == "text") {
            txtPwdSignup.prop("type", "password");
            iconToggle.removeClass("fa-eye-slash").addClass("fa-eye");
        }
    })
    //------------------------------------------------------------------------------------------------------------

    $("#login").click(function(){ // function to reset signup modal on button click
        // resetting input fields
        $("#txtEmailLogin").val("");
        $("#txtPwdLogin").val("");

        // resetting validaion fields
        $("#email-validation-login").html("");
        $("#password-validation-login").html("We won't share your password!");
    })
    //------------------------------------------------------------------------------------------------------------

    $("#login-to-signup").click(function(){ // function to reset signup modal on button click
        // resetting input fields
        $("#txtEmailLogin").val("");
        $("#txtPwdLogin").val("");

        // resetting validaion fields
        $("#email-validation-login").html("");
        $("#password-validation-login").html("We won't share your password!");
    })
    //------------------------------------------------------------------------------------------------------------
})

function chkElementEmpty(txtBox, errBox, typeStr){
    if(txtBox.val() == "") {
        errBox.html(typeStr + " field cannot be left empty.");
        return true;
    }
    return false;
}

//------------------------------------------------------------------------------------------------------------

function chkComboEmpty(comboBox, errBox){
    if(comboBox.val() == "0") {
        errBox.html("Please select a user type before proceeding.");
        return true;
    }
    return false;
}