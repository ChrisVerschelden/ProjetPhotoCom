var accueil = document.getElementById('accueil')


 //card container
 const div_card  = document.createElement( 'div' );
 div_card.classList.add("card");
 div_card.style.backgroundColor = 'red';

//image and frame
const ul_frames = document.createElement( 'ul' );
 ul_frames.classList.add( "Frames" );
const li_frame  = document.createElement( 'li' );
 li_frame.classList.add( "Frame" );
const img = document.createElement( 'img' );
 img.src = "_1090145.png"

//composing image and frame in div card
li_frame.appendChild(img)
ul_frames.appendChild(li_frame);
div_card.appendChild(ul_frames);


//date, title and text inside card side
const div_card_side = document.createElement( 'div' );

const div_card_date  = document.createElement( 'div' );
 div_card_date.classList.add( "card-date" );
 div_card_date.innerText = "22-12-2022";
const div_card_title = document.createElement( 'div' );
 div_card_title.classList.add( "card-title" );
const h2_title = document.createElement( 'h2' );
 h2_title.innerText = "Title";
const div_card_text  = document.createElement( 'div' );
 div_card_text.classList.add( "card-text" );
 div_card.innerText = "ceci est un place holder que je vais essayer de faire super mega giga long parce que j'ai la flemme d'aller chercher un lorem ipsum alors que en vrai ce serai beaucoup plus simple et rapide et voilà que je suis encore la a ecrire cette connerie";

div_card_title.appendChild( h2_title );
div_card_side.appendChild( div_card_date );
div_card_side.appendChild( div_card_title );
div_card_side.appendChild( div_card_text );

div_card.appendChild( div_card_side );

accueil.appendChild(div_card)