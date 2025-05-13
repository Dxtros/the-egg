$(document).ready(function () {


    // Story sections array
    let currentIndex = 0;
    let storyTimer;
    let timerEnd = false;
    let contentS1Index = 0;
    let increment = false;

    const introContent = [
        {
            id: 1,
            narrator: 'You were on your way home when you died.',
            narratorClass: 'intro-narrator',
            anim: 'animate__animated animate__fadeIn',
            outAnim: 'animate__animated animate__fadeOut',
            timer: 4000,

        },
        {
            id: 2,
            narrator: 'It was a car accident. Nothing particularly remarkable, but fatal nonetheless.',
            narratorClass: 'intro-narrator',
            anim: 'animate__animated animate__fadeIn',
            outAnim: 'animate__animated animate__fadeOut',
            timer: 4000,
        },
        {
            id: 3,
            narrator: 'lorem ipsum',
            anim: 'animate__animated animate__fadeIn',
            narratorClass: 'intro-narrator',
            timer: 3000,
        },



    ];
    const contentS1 = [
        {
            id: 1,
            narrator: '',
            narratorClass: 'narrator',
            anim: 'animate__animated animate__fadeIn',
            outAnim: '',
            person: '“What… what happened?” <span class="small-narrator">You asked.</span> “Where am I?”',
            personClass: 'person p-pos-mid',
            story: '',
            storyClass: '',
            hasButton: true, // write function for this
            timer: '',
            lingerN: false,
            lingerP: false //write function for this
        },
        {
            id: 2,
            narrator: '“You died,” <span class="small-narrator">I said, matter-of-factly no point in mincing words.</span>',
            narratorClass: 'narrator n-pos-top animate__animated animate__fadeIn',
            anim: 'animate__animated',
            outAnim: '',
            person: '“What… what happened?” <span class="small-narrator">You asked.</span> “Where am I?”',
            personClass: 'person p-pos-mid fade-to-grey',
            story: '',
            storyClass: '',
            hasButton: false, // write function for this
            timer: '8000',
            lingerN: false,
            lingerP: true //write function for this
        },
        {
            id: 3,
            narrator: '',
            narratorClass: 'narrator',
            anim: 'animate__animated animate__fadeIn',
            outAnim: '',
            person: '“There was a… a truck and it was skidding…”',
            personClass: 'person p-pos-mid',
            story: '',
            storyClass: '',
            hasButton: true, // write function for this
            timer: '',
            lingerN: false,
            lingerP: false //write function for this

        },


        {
            id: 4,
            narrator: '“Yup,” <span class="small-narrator">I said.</span>',
            narratorClass: 'narrator n-pos-mid',
            anim: 'animate__animated animate__fadeIn',
            outAnim: '',
            person: '“There was a… a truck and it was skidding…”',
            personClass: 'person fade-text p-pos-mid',
            story: '',
            storyClass: '',
            hasButton: false, // write function for this
            timer: '3000',
            lingerN: false,
            lingerP: false //write function for this
        }
    ];

    // Handle the begin button on the landing page
    $('.button-begin').on('click', function () {
        console.log("Button clicked, currentIndex:", currentIndex);
        //flash anim
        $('.flashScreen').addClass('flash-anim');
        $('main').empty();

        currentIndex = 0;

        setTimeout(function () {

            // this delays the first text from appearing


            displayIntroStoryContent(currentIndex);
        }, 3000);//change this to adjust the begin delay
    });

    // Function to display intro story content
    function displayIntroStoryContent(index) {
        console.log("displayIntroStoryContent called with index:", index);
        // Clear any existing timers and replace with timer value
        if (storyTimer) {

            clearTimeout(storyTimer);

        }

        // Check if we're at the end of the content array
        if (index >= introContent.length) {
            console.log("End of content reached, setting up dialogue section");
            init_DialogueSection();
            return;
        }

        // Get the current segment

        const segment = introContent[index];


        console.log("Displaying segment:", segment);
        // Display the narrator text 

        $('main').html(


            `
 
            

            <div class="intro-div">
                <h1 class="${segment.narratorClass} ${segment.anim}">${segment.narrator}</h1>
            </div>

        `);







        // automatically advance after specified timer delay, fade out after anim 
        console.log("Setting timeout for next segment with index:", index + 1);
        storyTimer = setTimeout(function () {
            const element = document.querySelector('h1');
            console.log('timer end')
            timerEnd = true;
            fadeOut(element, timerEnd);


            element.addEventListener('animationend', () => {
                // Do something when the animation finishes
                console.log('fade out ended', element.classList);
                displayIntroStoryContent(index + 1);

            }
            );


        }, segment.timer);
    }

    function fadeOut(element, t) {

        element.classList.add('animate__animated', 'animate__fadeIn');
        console.log('fadeOut Started');


        // Do something when the animation finishes
        if (t) {
            console.log('Animation ended', element.classList);

            // For example, start a fade-out after fade-in completes
            element.classList.remove('animate__fadeIn');
            element.classList.add('animate__fadeOut', 'animate__slow');
            

            timerEnd = false;
        }

    }

    //===Dialogue section 1 begins===//


    function init_DialogueSection() {


        console.log('Update dialogue section triggerd');
        console.log("next index is:", contentS1Index)
        const segment1 = contentS1[contentS1Index]

        if (contentS1Index >= contentS1.length) {
            console.log("End of content reached, setting up END");
            endStory();//does not exist yet
            return;
        }

        if (segment1.hasButton) {
            console.log("has button trig");
            display_Text(segment1);
            display_button(segment1);

        }
        if (segment1.hasButton == false) {
            console.log("timed section");
            display_Text(segment1);
            timed_dialogue(segment1);
        }
    }


    function display_Text(segment1) {


        $('main').html(`<div class="segment1-div"><p class="${segment1.personClass} ${segment1.anim}">${segment1.person}</p><p class="${segment1.narratorClass} ${segment1.anim}">${segment1.narrator}</p></div>`);
   
        
     }
    function display_button(segment1) {
        $('main').prepend(`<img class="button-cont" src="img/cont-button-v1.svg"></img>`);


        $('.button-cont').on('click', function () {
        
            console.log("cont clicked");
if(segment1.lingerP){
    $('.person').addClass('fade-text')
}
            update_dialogue(segment1)
         
        });
    }

    function timed_dialogue(segment1) {
        // automatically advance after specified timer delay, fade out after anim 
        console.log("Setting timeout for next segment");

        storyTimer = setTimeout(function () {
            const elements = document.querySelectorAll('p');






            let animationsCompleted = 0;

            // Loop through each paragraph element
            elements.forEach(element => {
                // Apply fadeOut to each individual element
                timerEnd = true;
                fadeOut(element, timerEnd);


                element.addEventListener('animationend', () => {
                    // Do something when the animation finishes
                    console.log('fade out ended', element.classList);

                    // Increment counter
                    animationsCompleted++;

                    // Only update dialogue once all animations are complete
                    if (animationsCompleted === elements.length) {
                        console.log("anims complete, updating dialgue")
                        update_dialogue()
                    }

                });
            });


        }, segment1.timer);
    }




    function update_dialogue() {

        //any logic for in between text updates
// const elements = document.querySelectorAll('p');






//             let animationsCompleted = 0;

//             // Loop through each paragraph element
//             elements.forEach(element => {
//                 // Apply fadeOut to each individual element
//                 timerEnd = true;
//                 fadeOut(element, timerEnd);


//                 element.addEventListener('animationend', () => {
//                     // Do something when the animation finishes
//                     console.log('fade out ended', element.classList);

//                     // Increment counter
//                     animationsCompleted++;

//                     // Only update dialogue once all animations are complete
//                     if (animationsCompleted === elements.length) {
//                         contentS1Index++;
//         init_DialogueSection();
//                     }

//                 });
//             });
        contentS1Index++;
         init_DialogueSection();
        
    }


    document.addEventListener('keydown', function (event) {
        console.log('Key pressed:', event.key);



        if (event.key === 'ArrowRight') {
            console.log('Right arrow was pressed');
            currentIndex++;

        }
        if (event.key === 'ArrowLeft') {
            console.log('Right arrow was pressed');
            currentIndex--;
        }
        if (event.key === 'd') {
            console.log('D was pressed');
            // Clear any existing timer
            if (storyTimer) {
                clearTimeout(storyTimer);
            }

            // Increment 
            contentS1Index++;
            if (contentS1Index >= contentS1.length) {
                contentS1Index = contentS1.length - 1;
            }
            $('main').empty();


            init_DialogueSection();


        }
        if (event.key === 'a') {
            console.log('A was pressed');

            if (storyTimer) {
                clearTimeout(storyTimer);
            }

            // Decrement 
            contentS1Index--;
            if (contentS1Index < 0) {
                contentS1Index = 0;
            }


            $('main').empty();


            init_DialogueSection();
        }
    });
})
