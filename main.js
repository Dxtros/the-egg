$(document).ready(function () {
    // Story sections array
    let currentIndex = 0;
    let storyTimer;
    let timerEnd = false;

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
            narratorClass: '',
            anim: 'animate__animated animate__fadeIn',
            outAnim: 'animate__animated animate__fadeOut',
            person: '“What… what happened?”<span class="small-narrator">You asked.</span> “Where am I?”',
            personClass: '',
            story: '',
            storyClass: '',
            hasButton: true, // write function for this
            timer: '',
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
            update_DialogueSection();
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

   


})