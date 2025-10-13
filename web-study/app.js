const x = "hello world";
const buttonA = document.querySelector("#button_A");

let array = [10, "asjd", 40];

buttonA.onclick = () => {
    console.log( name1(array) );
}


function name1( array) {
    for (let index = 0; index < array.length; index++) {
        console.log( typeof array[index] );
    }
    return "potato";
}