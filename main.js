let textbox1 = null;
let textbox2 = null;

function generete(){
textbox1 = document.getElementById('idea-prompt1');
textbox2 = document.getElementById('idea-prompt2');
if (textbox1.value.length > 3 && textbox2.value.length > 3) 
    {
        alert("Молодец")
    } else {
        alert("Заполни форму!")
    }
}