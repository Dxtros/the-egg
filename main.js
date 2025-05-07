$(document).ready(function () {
    // Story sections array
    let currentIndex = 0;
    let contentS1Index = 0;
    let storyTimer;
    let timerEnd = false;
    //skip with keys

    document.addEventListener('keydown', function (event) {
        console.log('Key pressed:', event.key);


        // check for arrow keys, space, etc.
        if (event.key === 'ArrowRight') {
            console.log('Right arrow was pressed');
            currentIndex++;
        }
        if (event.key === 'ArrowLeft') {
            console.log('Right arrow was pressed');
            currentIndex--;
        }
    });


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
            narrator: 'lorem lorem',
            narratorClass: 'intro-narrator',
            anim: 'animate__animated animate__fadeIn',
            outAnim: 'animate__animated animate__fadeOut',
            person: '“What… what happened?” <span class="small-narrator">You asked.</span> “Where am I?”',
            personClass: 'person',//write css class
            story: '',
            storyClass: '',
            hasButton: true, 
            timer: '3000',
            lingerN: false,
            lingerP: false //write function for this
        },
        {
            id: 2,
            narrator: 'lorem lorem',
            narratorClass: 'intro-narrator',
            anim: 'animate__animated animate__fadeIn',
            outAnim: 'animate__animated animate__fadeOut',
            person: '“What… what happened?” <span class="small-narrator">You asked.</span> “Where am I?”',
            personClass: 'person',//write css class
            story: '',
            storyClass: '',
            hasButton: true, 
            timer: '3000',
            lingerN: false,
            lingerP: true //write function for this
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


        clearTimeout(storyTimer);



        // Check if at the end of the content array
        if (index >= introContent.length) {
            console.log("End of content reached, setting up dialogue section");
            update_DialogueSection(contentS1Index);
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

    function fadeOut(e, t) {
        const element = e;
        element.classList.add('animate__animated', 'animate__fadeIn');
        console.log('fadeOut Started');


        // Do something when the animation finishes
        if (t) {
            console.log('Animation ended', element.classList);

            // For example, start a fade-out after fade-in completes
            element.classList.remove('animate__fadeIn');
            element.classList.add('animate__fadeOut');
            timerEnd = false;
        }

    }


    //===Dialogue section 1 begins===//


    function update_DialogueSection(contentS1Index) {
        console.log('Update dialogue section triggerd');
        const segment1 = contentS1[contentS1Index] //timer logic is a mess
        console.log(segment1);
        //checks for story end
        if (contentS1Index >= contentS1.length) { 
            console.log("End of content reached, setting up END");
            endStory();//does not exist yet
            return;
        }


        // checking to set linger
        if (segment1.lingerN) {
            const narrator = document.querySelector("${segment1.narratorClass}");
            narrator.classList.add('fade-text')

        }

        if (segment1.lingerP) {
            const currentClass ="${segment1.personClass}";
            const person = document.querySelector("currentClass");
            person.classList.add("fade-text") //fix this error on finding class
        }
        // display button or timer logic here-- if button display it here and on click trigger button section
        if (segment1.hasButton) {
            //display button and trigger on click
            console.log(segment1.hasButton);
            //need to make .button-cont class
           
            $('main').html(
                `
                <div class="segment1-wrapper">
                    <p class="${segment1.personClass} ${segment1.anim}">${segment1.person}</p>
                </div>
            `);
            $('main').append(`

                <img class="button-cont " src="/img/cont-button-v1.svg">
              `);
            $('.button-cont').on('click', function () {
                console.log("cont clicked, currentIndex:", segment1);
                buttonDialogue(segment1);
            }
                //writeDialogueSection(segment);

            )
        }
        else {
            console.log('timer dialgue was triggered');
            //timer logic goes here same as intro?
            //needs to be fixed right now it just repeats and doesnt reach .length
            if (storyTimer>=segment1.timer) {

                clearTimeout(storyTimer);

            }

            console.log("Displaying segment:", segment1);
            // Display the narrator text 

            $('main').html(
                `
                <div class="segment1-wrapper">
                    <p class="${segment1.narratorClass} ${segment1.anim}">${segment1.narrator}</p>
                </div>
            `);

            console.log("Setting timeout for next segment with index:", contentS1Index + 1);
            storyTimer = setTimeout(function () {
                const element = document.querySelector('p');
                console.log('timer end')
                timerEnd = true;
                fadeOut(element, timerEnd);


                element.addEventListener('animationend', () => {
                    // Do something when the animation finishes
                    console.log('fade out ended', element.classList);

                    update_DialogueSection(contentS1Index+1);

                }
                );


            }, segment1.timer);
        }

    }



    function buttonDialogue(s) {
        console.log('button dialogue triggered');

        update_DialogueSection(contentS1Index+1);
        //display next text from button click (narrator usually)

    }
}


);