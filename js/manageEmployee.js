//import "JQuery";
//valori
/*
var data = [
    {
      "id": 10001,
      "birthDate": "1953-09-01",
      "firstName": "Georgi",
      "lastName": "Facello",
      "gender": "M",
      "hireDate": "1986-06-25",
    },
    {
      "id": 10002,
      "birthDate": "1964-06-01",
      "firstName": "Bezalel",
      "lastName": "Simmel",
      "gender": "F",
      "hireDate": "1985-11-20",
    },
    {
      "id": 10003,
      "birthDate": "1959-12-02",
      "firstName": "Parto",
      "lastName": "Bamford",
      "gender": "M",
      "hireDate": "1986-08-27T22:00:00.000+0000",
    },
    {
      "id": 10004,
      "birthDate": "1954-04-30",
      "firstName": "Chirstian",
      "lastName": "Koblick",
      "gender": "M",
      "hireDate": "1986-11-30",
  
    },
    {
      "id": 10005,
      "birthDate": "1955-01-20",
      "firstName": "Kyoichi",
      "lastName": "Maliniak",
      "gender": "M",
      "hireDate": "1989-09-11T22:00:00.000+0000",
  
    }
  ];
  */

  var data = [];
  //var nextID = 10006;
  var url = "http://localhost:8080/employees";
  var serverData;

//create employee table
function employeeTable(data){
  var rows = "";
  $.each(data,function (key,value){
    rows = rows + "<tr class='control'>";
    rows = rows + "<th>" + value.id + "</th>";
    rows = rows + "<td>" + value.birthDate + " </td>";
    rows = rows + "<td>" + value.firstName + "</td>";
    rows = rows + "<td>" + value.lastName + "</td>";
    rows = rows + "<td>" + value.gender + "</td>";
    rows = rows + "<td>" + value.hireDate + "</td>";
    rows = rows + "<td>" + "<input type='button' value='Rimuovi' class='rmButton' id='"+value.id+"' onclick='rmEmployee("+value.id+")'>";
    rows = rows + "</tr>";
  });
  $("tbody").html(rows);

}

/*
// first ajax GET request
function connetti(url){
  $.get (url , function( content ){
    data = content["_embedded"]["employees"];
    nextPage = content["_links"]["next"]["href"];
    firstPage = content["_links"]["first"]["href"];
    lastPage = content["_links"]["last"]["href"];
    pageNumber = content["page"]["number"];
    totPage = content["page"]["totalPages"];
    employeeTable(data);
  })
}
*/

function first(){
  $.get(url, function(msg){
      serverData = msg;
      data = msg._embedded.employees;
      Pag_Corente()
      employeeTable(data);
  });
};


function last(){
  $.get(serverData["_links"]["last"]["href"], function(msg){
      serverData = msg;
      data = msg._embedded.employees;
      Pag_Corente()
      employeeTable(data);
  });
};
function next(){
  $.get(serverData["_links"]["next"]["href"], function(msg){
      serverData = msg;
      data = msg._embedded.employees;
      Pag_Corente()
      employeeTable(data);
  });
};

function prev(){
  $.get(serverData["_links"]["prev"]["href"], function(msg){
      serverData = msg;
      data = msg._embedded.employees;
      Pag_Corente()
      employeeTable(data);
  });
};

function Pag_Corente(){
  $("#corrente").text(serverData.page.number);
}

//caricamento pagina
$(document).ready(function (){
    first();
})

//add employee
$(document).ready(function (){
  $("#btnAdd").click(function (){
    //var id = nextID;
    var birthDate = $("#birhtDate").val();
    var firstName = $("#firstName").val().trim();
    var lastName = $("#lastName").val().trim();
    var gender = $("#gender").val().trim();
    var hireDate = $("#hireDate").val();
    const obj = { 
                  "birthDate": birthDate,
                  "firstName": firstName,
                  "gender": gender,
                  "hireDate": hireDate,
                  "lastName": lastName
                };
    $.ajax({
      method: "POST",
      url: url,
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify(obj),
      success: function(result) {
        connetti(url);
      }
    })
            
  })
}) 

//change employee data
$(document).ready(function (){
  $("#btnMod").click(function (){
    var idEmployee = $("#idEmployee").val(); //id utente da modificare
    var newName = $("#firstNameMod").val().trim(); //nuovo nome
    var newSurname = $("#lastNameMod").val().trim(); //nuovo cognome
    var newGender = $("#genderMod").val().trim(); //nuovo genere
    var newHireDate = $("#hireDateMod").val(); //nuova data assunzione
    var newBirthDate = $("#birhtDateMod").val(); //nuova data nascita

    var modifica = url + "/" + idEmployee;
    var obj = { 
            "birthDate": newBirthDate,
            "firstName": newName,
            "gender": newGender,
            "hireDate": newHireDate,
            "lastName": newSurname
          }; 

    $.ajax({
      type: 'PUT',
      url: modifica,
      dataType: "json",
      contentType: "application/json",
      data: JSON.stringify(obj),
      success: function(result) {
        connetti(url);
      },

      error: function(jqXHR, textStatus, errorThrown) {
        console.log("Operazione fallita", jqXHR, textStatus, errorThrown);
      }
    });

  })
}) 


//delete employee
function rmEmployee(id){
  var type = "#";
  type += id;
  var del = url + "/" + id; //

  $.ajax({
    url: del,
    type: 'DELETE',
    success: function(result) {
      $(type).closest("tr").remove();
    }
  });
}

function licenzia(){
  $(".control").remove();
}

//author @josh-delaCruz