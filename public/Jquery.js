$(document).ready(function () {

    //TOGGLE COLLAPSE FUNCTION FOR INDEX.HTML LOGIN ACCORDIAN     
    // ******************************************************** //         
    $('[data-toggle="collapse"]').click(function () {
        $('.collapse.in').collapse('hide')
    });
    // ******************************************************** // 


    // //CHANGE CLAIM TO CHECKBOX   
    // // ******************************************************** //      
    // $(document).on('click', ".btn", function () {
    //     // GET TEXT OF BUTTON
    //     var buttonText = $(this).text();
    //     // IF IT IS A CLAIM BUTTON CHANGE TO CHECKBOX
    //     if (buttonText == 'Claim') {
    //         // GET NODE TO MAKE CHECKBOX VISIBLE
    //         var checkboxNode = $(this).parent().prev().prev();
    //         // TOGGLE HIDDEN CLASS ON CHECKBOX
    //         checkboxNode.toggleClass("hidden");
    //         $(this).addClass("claim");
    //         // CHANGE TO ABANDON BUTTON
    //         $(this).text("Abandon");
    //         // // GET USER ID
    //         // var userId = $('#userId').val();
    //         // // CHANGE PLACEHOLDER TEXT
    //         // $(this).parent().prev().attr("placeholder", "Owned by: "+userId);
    //     }
    // });
    // // ******************************************************** // 



    // //CHANGE ABANDON TO CLAIM  
    // // ******************************************************** //      
    // $(document).on('click', ".claim", function () {
    //     // GET TEXT OF BUTTON
    //     var buttonText = $(this).text();
    //     // IF IT IS ABANDON BUTTON MAKE IT CLAIM
    //     if (buttonText == 'Abandon') {
    //         // GET NODE TO MAKE CHECKBOX HIDDEN
    //         var checkboxNode = $(this).parent().prev().prev();
    //         // TOGGLE HIDDEN CLASS ON CHECKBOX
    //         checkboxNode.toggleClass("hidden");
    //         $(this).removeClass("claim");
    //         // CHANGE TO CLAIM BUTTON
    //         $(this).text("Claim");
    //         // CHANGE PLACEHOLDER TEXT
    //         // $(this).parent().prev().attr("placeholder", "Unclaimed");
    //     }
    // });
    // // ******************************************************** // 


    // //CHANGE CHECKBOX CLICK
    // // ******************************************************** // 
    // $(document).on('change', ".check", function (event) {
    //     event.stopImmediatePropagation();
    //     // GET TEXT OF TO DO LIST ITEM
    //     var checkText = $(this).parent().parent().next();
    //     // TOGGLE LINE THROUGH TEXT
    //     checkText.toggleClass("line-through no-line");
    //     // TOGGLE THE ABANDON BUTTON
    //     var hideButton = $(this).parent().parent().next().next().children();
    //     if (checkText.hasClass("line-through")) {
    //         hideButton.addClass("removed");
    //     } else hideButton.removeClass("removed");

    // });
    // // ******************************************************** // 


    //REMOVE COMPLETED TASKS
    // ******************************************************** // 
    $('#removeComplete').click(function (event) {
        //FIND ALL OBJECTS WITH 'REMOVED' CLASS
        var deleteMe = $(".removed").parent().prev().prev().parent();
        //DELETE TASKS WITH FADEOUT
        deleteMe.fadeOut(600, function(){ deleteMe.remove();});
    });
    // ******************************************************** //


});
