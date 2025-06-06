/**
 * The Egg By Andy Weir - retrieved from https://www.galactanet.com/oneoff/theegg_mod.html
 * 
 *  Adapted into an interactive web story by Dexter Delaski - dextros.net
 * 
 * This script manages the interactive story for "The Egg"
 * by Andy Weir, providing animations, transitions, and user interactions.
 */

$(document).ready(() => {
  // Story Engine - manages the story state and progression
  const StoryEngine = {
    // State
    state: {
      currentIndex: 0,
      dialogueIndex: 0,
      activeSection: 'landing', // 'landing', 'intro', 'dialogue', 'ending'
      activeTimer: null,
      animatingOut: false,
      scrollSection: {
        currentSegment: 0,
        totalSegments: 0,
        hasInitialized: false,
        isLast: false
      },
      questionScreen: {
        afterlifeAsked: false,
        godAsked: false,
        showingAnswer: false,
        currentAnswer: null

      }
    },

    // Initialize the story engine
    init() {
      this.bindEvents();
      console.log('Story engine initialized');
      AudioManager.init();
    },

    // Bind necessary event listeners
    bindEvents() {
      // Main button click handler
      $('.button-begin').on('click', () => this.startStory());

      // Debug keyboard controls
      this.bindDebugControls();
    },

    // Start the story experience
    startStory() {
      console.log('Starting story experience');
       AudioManager.play();
      $('.flashScreen').addClass('flash-anim');
      $('main').empty();

      this.state.activeSection = 'intro';
      this.state.currentIndex = 0;

      // Delay first text appearance to allow for flash animation
      setTimeout(() => this.displayIntroContent(0), 3000);
    },

    // Display intro story content
    displayIntroContent(index) {
      console.log(`Displaying intro content at index: ${index}`);
      this.clearActiveTimer();

      // Check if we've reached the end of intro content
      if (index >= StoryContent.intro.length) {
        console.log("reached end of intro content")
        this.transitionToDialogue();
        return;
      }

      // Get current segment and display it
      const segment = StoryContent.intro[index];
      console.log("displaying intro segment:",segment)
      $('main').html(`
        <div class="intro-div">
          <h1 class="${segment.narratorClass} ${segment.anim}">${segment.narrator}</h1>
        </div>
      `);

      // Set up timer for automatic progression
      this.state.activeTimer = setTimeout(() => {
        const element = document.querySelector('h1');
        this.state.animatingOut = true;

        // Start fade out animation
        this.animateElementOut(element, () => {
          // When animation is complete, move to next segment
          this.state.animatingOut = false;
          this.displayIntroContent(index + 1);
        });
      }, segment.timer);
    },

    // Transition to dialogue section
    transitionToDialogue() {
      console.log('Transitioning to dialogue section');
      this.state.activeSection = 'dialogue';
      this.state.dialogueIndex = 0;
      this.displayDialogueContent();
    },

    // Display dialogue content
    displayDialogueContent() {
      console.log(`Displaying dialogue at index: ${this.state.dialogueIndex}`);


      // show question screen on index #
      if (this.state.dialogueIndex === 6) {
        console.log('Transitioning to question screen');
        this.showQuestionScreen();
        return;
      }

      if (this.state.dialogueIndex === 22) {
        console.log('Transitioning to walking section');
        this.initScrollSection();
        return;
      }

      // Check if we've reached the end of dialogue content
      if (this.state.dialogueIndex >= StoryContent.dialogue.length) {
        console.log('End of story reached');
        this.initEndSection(); 
        return;
        
      }

      const segment = StoryContent.dialogue[this.state.dialogueIndex];
      this.renderDialogueSegment(segment);

      // Handle progression based on segment type
      if (segment.hasButton) {
        this.addProgressionButton(segment);
      } else {
        this.setupTimedProgression(segment);
      }
    },

    // Render dialogue segment content
    renderDialogueSegment(segment) {
      $('main').html(`
        <div class="segment1-div">
          ${segment.person ? `<p class="${segment.personClass} ${segment.anim || ''}">${segment.person}</p>` : ''}
          ${segment.narrator ? `<p class="${segment.narratorClass} ${segment.anim || ''}">${segment.narrator}</p>` : ''}
        </div>
      `);
    },


    // Add progression button for interactive segments
    addProgressionButton(segment) {
      $('main').prepend(`<svg class ="button-cont button-move" width="66" height="85" viewBox="0 0 66 85" fill="none" xmlns="http://www.w3.org/2000/svg">

<g id="dialogue-3" clip-path="url(#clip0_1_2)">


<path id="egg-outline" d="M33 3C34.8549 3 37.6823 3.88544 41.0654 5.91309C44.3752 7.89677 47.9437 10.8111 51.2285 14.4561C57.8257 21.7765 63 31.7174 63 42.5C63 65.0657 48.9066 82 33 82C17.0934 82 3 65.0657 3 42.5C3 31.5947 7.54603 21.6392 13.7305 14.3955C20.0141 7.03567 27.5058 3 33 3Z"  stroke-width="2"/>



</g>

<defs>
<clipPath id="clip0_1_3">
<rect width="1514" height="1024" fill="white" transform="translate(-1371 -883)"/>
</clipPath>
</defs>
</svg>

<svg class ="button-cont" width="66" height="85" viewBox="0 0 66 85" fill="none" xmlns="http://www.w3.org/2000/svg">

<g id="dialogue-4" clip-path="url(#clip0_1_2)">


<path id="egg-outline-2" d="M33 3C34.8549 3 37.6823 3.88544 41.0654 5.91309C44.3752 7.89677 47.9437 10.8111 51.2285 14.4561C57.8257 21.7765 63 31.7174 63 42.5C63 65.0657 48.9066 82 33 82C17.0934 82 3 65.0657 3 42.5C3 31.5947 7.54603 21.6392 13.7305 14.3955C20.0141 7.03567 27.5058 3 33 3Z" stroke-width="6"/>



</g>

<defs>
<clipPath id="clip0_1_3">
<rect width="1514" height="1024" fill="white" transform="translate(-1371 -883)"/>
</clipPath>
</defs>
</svg>
`);

      $('.button-cont').on('click', () => {
        console.log('Progression button clicked');

        if (segment.lingerP) {
          $('.person').addClass('fade-text');
        }

        this.advanceDialogue();
      });
    },

    // Set up timed progression for automatic segments
    setupTimedProgression(segment) {
      if (!segment.timer) {
        console.warn('No timer specified for timed segment, using default');
        segment.timer = 3000; // Default timer
      }

      this.state.activeTimer = setTimeout(() => this.handleTimedTransition(segment), segment.timer);
    },

    // Handle timed transition between dialogue segments
    handleTimedTransition(segment) {
      // Collect elements that need to fade out
      const narratorElement = document.querySelector(`.${segment.narratorClass.split(' ')[0]}`);
      const personElement = document.querySelector(`.${segment.personClass.split(' ')[0]}`);

      // Determine which elements should fade and which should remain
      let elementsToFade = [];

      // Narrator element logic
      if (narratorElement && !segment.skipFadeN && !segment.lingerN) {
        elementsToFade.push(narratorElement);
      }

      // Person element logic
      if (personElement && !segment.skipFadeP && !segment.lingerP) {
        elementsToFade.push(personElement);
      }

      // If no elements to fade, advance immediately
      if (elementsToFade.length === 0) {
        this.advanceDialogue();
        return;
      }

      // Set up animation tracking
      let completedAnimations = 0;

      // Apply fade animations
      elementsToFade.forEach(element => {
        this.animateElementOut(element, () => {
          completedAnimations++;
          if (completedAnimations === elementsToFade.length) {
            this.advanceDialogue();
          }
        });
      });
    },

    // Advance to the next dialogue segment
    advanceDialogue() {
      this.clearActiveTimer();
      this.state.dialogueIndex++;
      this.displayDialogueContent();
    },

    // Helper methods
    animateElementOut(element, callback) {
      if (!element) {
        if (callback) callback();
        return;
      }

      // Remove any existing animation classes
      element.classList.remove('animate__fadeIn', 'animate__fadeOut');

      // Add fade out animation
      element.classList.add('animate__animated', 'animate__fadeOut', 'animate__slow');

      // Set up one-time animation end listener
      const handleAnimEnd = (event) => {
        if (event.animationName === 'fadeOut') {
          element.removeEventListener('animationend', handleAnimEnd);
          if (callback) callback();
        }
      };

      element.addEventListener('animationend', handleAnimEnd);
    },

    clearActiveTimer() {
      if (this.state.activeTimer) {
        clearTimeout(this.state.activeTimer);
        this.state.activeTimer = null;
      }
    },

    //question section code ================

    showQuestionScreen() {
      console.log('showing question screen')

      //setup variables from array at button (question section)

      const setup = StoryContent.questions.setup;
      const options = StoryContent.questions.options;

      // html stored in variable
      let html = '<div class="questionScreen">'

      // Add the setup text if not showing an answer
      if (!this.state.questionScreen.showingAnswer) {
        html += `<p class="${setup.class}">${setup.text}</p>`;
      }

      html += `<div class="question-options-container">`;


      let optionsContent = '';

      //===========first question after life section

      //show as grey text if asked
      const afterlifeClass = this.state.questionScreen.afterlifeAsked ?
        `${options[0].class} grey-button` : options[0].class;

      //show clickable afterlife button
      if (!this.state.questionScreen.afterlifeAsked && this.state.questionScreen.currentAnswer != 'god') {
        optionsContent += `<div class="question-option" data-question="afterlife"><p class="${afterlifeClass}"> ${options[0].text}</p></div>`;

      }
      // Show as grey text and not clickable if already asked
      else if (this.state.questionScreen.afterlifeAsked && this.state.questionScreen.currentAnswer != 'god') {
         optionsContent += `<p class="grey-button-no-anim person">${options[0].text}</p>`;
      }
      //show the answer if we are asking the correlating question
      if (this.state.questionScreen.currentAnswer === 'afterlife') {
        const answer = options[0].answer;
        optionsContent += `<p class = "${answer.class}">${answer.text}</p>`

      }

      //===========second question god section

      //show as grey text if asked     
      const godClass = this.state.questionScreen.godAsked ?
        `${options[1].class} grey-button` : options[1].class;

      //show clickable god button bug here! it shows both when both questions havent been asked
      if (!this.state.questionScreen.godAsked && this.state.questionScreen.currentAnswer != 'afterlife') {
        optionsContent += `<div class="question-option" data-question="god"> <p class="${godClass}"> ${options[1].text}</p></div>`;
        console.log(godClass)
      }
      // Show as grey text and not clickable if already asked
      else if (this.state.questionScreen.godAsked && this.state.questionScreen.currentAnswer != 'afterlife') {
        optionsContent += `<p class="grey-button-no-anim person">${options[1].text}</p>`;
      }
      //show the answer if we are asking the correlating question
      if (this.state.questionScreen.currentAnswer === 'god') {
        const answer = options[1].answer;
        optionsContent += `<p class = "${answer.class}">${answer.text}</p>`
      }



      //add content from above to surronding html
      html += optionsContent;
      // add closing divs
      html += '</div>';
      html += '</div>';

      //take html and put it into main 
      $('main').html(html)

      //attach click handlers to buttons
    
        console.log("click handler init");
        $('.question-option').on('click', (e) => {
          const question = $(e.currentTarget).data('question');
          console.log(question)
          this.handleQuestionClick(question)

        });

        //if both questions have been asked continue story after delay
        if (this.state.questionScreen.afterlifeAsked &&
          this.state.questionScreen.godAsked) {

          console.log("Both questions asked, continuing story");
$('.questionScreen').addClass('animate__animated animate__fadeOut animate__slow animate__delay-2s')
          setTimeout(() => {

            this.state.dialogueIndex = 7;
            this.state.activeSection = 'dialogue';
            this.displayDialogueContent();

          }, 3500); //delay before continuing set here, should add a fade out



        }

      

    },

    handleQuestionClick(question) {
      console.log('Question clicked:', question);

      //set up to show answer

      this.state.questionScreen.showingAnswer = true;
      this.state.questionScreen.currentAnswer = question
       if (question === 'afterlife') {
          this.state.questionScreen.afterlifeAsked = true;
          
        }
        if (question === 'god') {
          this.state.questionScreen.godAsked = true;
        }
      this.showQuestionScreen();
      //really cool logic that searches the array for the timer value, it stores the options in 
      //opt and then compares to find a the matching question.answer.timer (timer in the array)
      const answerTimer = StoryContent.questions.options.find(
        opt => opt.id === question

      ).answer.timer;

      $('.questionScreen').removeClass('animate__animated animate__fadeIn');
    $('.questionScreen').addClass('animate__animated animate__fadeOut animate__slow animate__delay-3s');
    console.log($('.question-option'))
    // trying to make un asked question fade out
      //marks questions as asked
      setTimeout(() => {


    
    

 


        //return to setup question screen

        this.state.questionScreen.showingAnswer = false;
        this.state.questionScreen.currentAnswer = null;
      
        if (this.state.questionScreen.afterlifeAsked &&
          this.state.questionScreen.godAsked) {
            return;
          }
          else{
        this.showQuestionScreen();
          }
      }, answerTimer);

    },

    //end question section code ================

    //scroll section code====================

    // Initialize and display the scroll section
    initScrollSection() {
      console.log('Initializing scroll section');

      this.state.activeSection = 'scrollSection';
      this.state.scrollSection.currentSegment = 0;
      this.state.scrollSection.totalSegments = StoryContent.scrollSection.length;
      this.state.scrollSection.hasInitialized = true;


      // Create scroll container
      $('main').html(`
    <div class="scroll-container">
      ${StoryContent.scrollSection.map(segment =>
        `<div id="${segment.id}" class="${segment.class}">${segment.content}</div>`
      ).join('')}
      <div class="scroll-indicator">Scroll to continue the story...</div>
    </div>
  `);

      // Initialize scroll event listener
      this.bindScrollEvents();
      const segmentElement = $(`#scroll-1`);
      segmentElement.addClass('active');

    },

    // Bind scroll events for the scroll section
    bindScrollEvents() {
      $(window).on('scroll.storyScroll', () => {
        if (this.state.activeSection !== 'scrollSection') {
          return;
        }

        const scrollPosition = $(window).scrollTop();
        const windowHeight = $(window).height();
        const documentHeight = $(document).height();
        // Calculate scroll progress

        const scrollPercentage = scrollPosition / (documentHeight - windowHeight);

        console.log('Scroll percentage:', scrollPercentage);

        // Update each segment's visibility
        StoryContent.scrollSection.forEach((segment, index) => {
          const segmentElement = $(`#${segment.id}`);
          const segmentStart = index / StoryContent.scrollSection.length;
          const segmentPeak = (index + 0.5) / StoryContent.scrollSection.length;
          const segmentEnd = (index + 1) / StoryContent.scrollSection.length;


          // Remove all classes first
          segmentElement.removeClass('active fade-out');

          if (scrollPercentage >= segmentStart && scrollPercentage < segmentPeak) {
            // Fading in
            segmentElement.addClass('active');
            this.state.scrollSection.currentSegment = Math.max(this.state.scrollSection.currentSegment, index + 1);
          } else if (scrollPercentage >= segmentPeak && scrollPercentage < segmentEnd) {
            // At peak visibility
            segmentElement.addClass('active');
          } else if (scrollPercentage >= segmentEnd && index < StoryContent.scrollSection.length - 1) {
            // Fading out (except for the last element)
            segmentElement.addClass('fade-out');


          }

          else if (scrollPercentage === segmentEnd) {
            this.exitScrollSection();
          }
        });
      });
    },

    // Clean up and exit scroll section
    exitScrollSection() {
      console.log('Exiting scroll section');

      // Remove scroll event listener
      $(window).off('scroll.storyScroll');


      // Transition to the next section
      setTimeout(() => {



        // Move to dialogue section after scroll section
        this.state.activeSection = 'dialogue';
        this.state.dialogueIndex = 23; // index to continue the story
        this.displayDialogueContent();
      }, 1000);
    },
initEndSection(){
  this.state.activeSection = 'endSection';
  this.renderEndScreen();
  console.log('end section init');
},
bindEndButton(){
  $('.button-end').on('click', () => this.startStory());
},

renderEndScreen(){
$('main').html(`
 
        <div class="intro-div">
          <h1 class="narrator">Thanks for watching!</h1>
          <p class="end-text"><a href="https://galactanet.com/writing.html"> This story</a> was written by Andy Weir and Adapted into an interactive web story by <a href="https://dextros.net"> Dexter Delaski</a></p>
            <div class="button-end">Restart</div>
        </div>

      `);
  this.bindEndButton();    
},

    // Debug controls
    bindDebugControls() {


      console.log('Binding debug keyboard controls');

      document.addEventListener('keydown', (event) => {
        console.log(`Key pressed: ${event.key}`);


        if (event.key === 's') {
          console.log('S pressed - jumping to scroll section');
          $('main').empty();
          this.initScrollSection();
        }

        if (event.key === 'z') {

          $('main').empty();
          this.state.dialogueIndex = 75;
          this.state.activeSection = 'dialogue'
          this.displayDialogueContent();
        }

        if (event.key === 'q') {
          console.log('Q pressed - testing question screen');
          // Quick way to jump to question screen for testing
          this.state.activeSection = 'interactive';
          this.state.questionScreen = {
            placeAsked: false,
            godAsked: false,
            showingAnswer: false,
            currentAnswer: null
          };
          this.showQuestionScreen();
        }

        // Handle 'd' key press (advance)
        if (event.key === 'd') {
          console.log('D key pressed - advancing content');

          // clear timers
          if (this.state.activeTimer) {
            clearTimeout(this.state.activeTimer);
            this.state.activeTimer = null;
          }

          // Determine which section 
          if (this.state.activeSection === 'intro') {
            // For intro section, advance to next intro content
            this.state.currentIndex++;
            if (this.state.currentIndex >= StoryContent.intro.length) {
              // If reached the end of intro, move to dialogue
              this.transitionToDialogue();
            } else {
              // Otherwise show next intro content
              this.displayIntroContent(this.state.currentIndex);
            }
          }
          else if (this.state.activeSection === 'dialogue') {
            // For dialogue section, advance to next dialogue
            this.state.dialogueIndex++;

            // Refresh
            $('main').empty();
            this.displayDialogueContent();
          }
          else if (this.state.activeSection === 'interactive') {
            // For interactive question section
            console.log(this.activeSection)
            // Otherwise, simulate clicking the first available question
            if (!this.state.questionScreen.placeAsked) {
              this.handleQuestionClick('afterlife');
            } else if (!this.state.questionScreen.godAsked) {
              this.handleQuestionClick('god');
            }

            this.showQuestionScreen();


          }
        }

        // Handle 'a' key press (go back)
        else if (event.key === 'a') {
          console.log('A key pressed - going back');

          // clear timers
          if (this.state.activeTimer) {
            clearTimeout(this.state.activeTimer);
            this.state.activeTimer = null;
          }

          // Determine which section 
          if (this.state.activeSection === 'intro') {
            // For intro section, go back to previous content
            this.state.currentIndex = Math.max(0, this.state.currentIndex - 1);
            this.displayIntroContent(this.state.currentIndex);
          }
          else if (this.state.activeSection === 'dialogue') {
            // For dialogue section, go back 
            this.state.dialogueIndex = Math.max(0, this.state.dialogueIndex - 1);
            $('main').empty();
            this.displayDialogueContent();
          }
          else if (this.state.activeSection === 'interactive') {
            // For interactive questions, reset state
            this.state.questionScreen.afterlifeAsked = false;
            this.state.questionScreen.godAsked = false;
            this.state.questionScreen.showingAnswer = false;
            this.state.questionScreen.currentAnswer = null;
            this.showQuestionScreen();
          }
        }
      });
    }
  };
  // Audio management
  const AudioManager = {
    backgroundAudio: null,

    init() {
      // Create audio element
      this.backgroundAudio = new Audio('audio/aphex-twin.mp3');
      this.backgroundAudio.loop = true;
      this.backgroundAudio.volume = 0.3; // 30% volume

      // Handle audio loading
      this.backgroundAudio.addEventListener('canplaythrough', () => {
        console.log('Audio loaded and ready to play');
      });

      // Handle errors
      this.backgroundAudio.addEventListener('error', (e) => {
        console.error('Audio failed to load:', e);
      });
    },

    play() {
      if (this.backgroundAudio) {
        this.backgroundAudio.play().catch(e => {
          console.log('Audio play failed:', e);
          // Modern browsers require user interaction before playing audio
        });
      }
    },

    pause() {
      if (this.backgroundAudio) {
        this.backgroundAudio.pause();
      }
    },

    setVolume(volume) {
      if (this.backgroundAudio) {
        this.backgroundAudio.volume = Math.max(0, Math.min(1, volume));
      }
    }
  };
  // Story content - all dialogue and narrative segments
  const StoryContent = {
    // Intro sequence content
    intro: [
      {
        narrator: 'You were on your way home when you died.',
        narratorClass: 'intro-narrator',
        anim: 'animate__animated animate__fadeIn animate__slow',
        timer: 4000
      },
      {
        narrator: 'It was a car accident. Nothing particularly remarkable, but fatal nonetheless.',
        narratorClass: 'intro-narrator',
        anim: 'animate__animated animate__fadeIn animate__slow',
        timer: 5000
      },
      {
        narrator: 'You left behind a wife and two children.',
        narratorClass: 'intro-narrator',
        anim: 'animate__animated animate__fadeIn animate__slow',
        timer: 4000
      },
      {
        narrator: "It was a painless death. The EMTs tried their best to save you, but to no avail.",
        narratorClass: 'intro-narrator',
        anim: 'animate__animated animate__fadeIn animate__slow',
        timer: 5000
      },
      {
        narrator: "Your body was so utterly shattered you were better off, trust me.",
        narratorClass: 'intro-narrator',
        anim: 'animate__animated animate__fadeIn animate__slow',
        timer: 5000
      },
      {
        narrator: "And that\’s when you met me.",
        narratorClass: 'intro-narrator',
        anim: 'animate__animated animate__fadeIn animate__slow',
        timer: 5000
      }
    ],

    // Dialogue sequence content
    dialogue: [
      {
        narrator: '',
        narratorClass: 'narrator',
        person: '"What… what happened?" <span class="nar">You asked.</span> "Where am I?"',
        personClass: 'person p-pos-mid',
        anim: 'animate__animated animate__fadeIn animate__slower',
        hasButton: true,
        lingerP: false,
        skipFadeP: false
      },
      {
        narrator: '"You died," <span class="small-narrator">I said, matter-of-factly no point in mincing words.</span>',
        narratorClass: 'narrator n-pos-top animate__animated animate__fadeIn',
        person: '"What… what happened?" <span class="nar">You asked.</span> "Where am I?"',
        personClass: 'person p-pos-mid fade-to-grey',
        hasButton: false,
        timer: 6000,
        lingerN: false,
        lingerP: false,
        skipFadeN: false,
        skipFadeP: false
      },
      {
        narrator: '',
        narratorClass: 'narrator',
        person: '"There was a… a truck and it was skidding…"',
        personClass: 'person p-pos-mid animate__animated animate__fadeIn',
        hasButton: true,
        lingerP: false,
        skipFadeP: false
      },
      {
        narrator: '"Yup," <span class="nar">I said.</span>',
        narratorClass: 'narrator n-pos-mid animate__animated animate__fadeIn',
        person: '"There was a… a truck and it was skidding…"',
        personClass: 'person fade-to-grey p-pos-mid',
        hasButton: false,
        timer: 3000,
        lingerN: false,
        lingerP: true,
        skipFadeN: false,
        skipFadeP: false
      },
      {
        narrator: '',
        narratorClass: 'narrator',
        person: '<span class="grey-text">"There was a… a truck and it was skidding…"</span><br><span class="animate__animated animate__fadeIn">"I...I died?"</span>',
        personClass: 'person p-pos-mid',
        hasButton: true,
        lingerP: true,
        skipFadeP: false
      },
      {
        narrator: '"Yup. But don\'t feel bad about it. Everyone dies,"',
        narratorClass: 'narrator n-pos-mid animate__animated animate__fadeIn',
        person: '<span class="grey-text">"There was a… a truck and it was skidding…"</span><br><span class="fade-to-gray">"I...I died?"</span>',
        personClass: 'person p-pos-mid',
        hasButton: false,
        timer: 4000,
        lingerN: false,
        lingerP: false,
        skipFadeN: false,
        skipFadeP: false
      },
      {
        narrator: '',
      },
      {
        narrator: '',
        narratorClass: 'narrator',
        person: '“My kids… my wife,”<span class="nar"> you said.</span>',
        personClass: 'person p-pos-bot animate__animated animate__fadeIn',
        hasButton: true,
        lingerN: false,
        lingerP: true,
      },
      {
        narrator: '“What about them?”',
        narratorClass: 'narrator n-pos-mid animate__animated animate__fadeIn',
        person: '<span class="fade-to-grey">“My kids… my wife,”</span><span class="nar fade-to-grey"> you said.</span>',
        personClass: 'person p-pos-bot',
        hasButton: false,
        timer: 4000,
        lingerN: true,
        lingerP: true,
        skipFadeN: true,
        skipFadeP: true
      },
      {
        narrator: '<span class = "fade-to-grey">“What about them?”<span>',
        narratorClass: 'narrator n-pos-mid',
        person: '<span class="grey-text">“My kids… my wife,”</span><span class="nar grey-text"> you said.</span><br><span class="animate__animated animate__fadeIn">Will they be all right?</span>',
        personClass: 'person p-pos-bot',
        hasButton: true,
        lingerN: false,
        lingerP: true,
        skipFadeN: false,
        skipFadeP: false
      },
      {
        narrator: '<span class="animate__animated animate__fadeIn">“That\’s what I like to see,” <span class="nar"> I said.</span>',
        narratorClass: 'narrator n-pos-mid',
        person: '<span class="grey-text">“My kids… my wife,”</span><span class="nar grey-text"> you said.</span><br><span class="grey-text">Will they be all right?</span>',
        personClass: 'person p-pos-bot',
        hasButton: false,
        lingerN: true,
        lingerP: true,
        timer: 2000,
        skipFadeN: true,
        skipFadeP: false
      },
      {
        narrator: '<span class="fade-to-grey">“That\’s what I like to see,”<span class="nar"> I said.</span></span><br><span class="animate__animated animate__fadeIn">“You just died and your main concern is for your family. That\’s good stuff right there.”</span>',
        narratorClass: 'narrator n-pos-mid animate__slower',
        person: '<span class="grey-text">“My kids… my wife,”</span><span class="nar grey-text"> you said.</span><br><span class="grey-text">Will they be all right?</span>',
        personClass: 'person p-pos-bot animate__slower',
        hasButton: false,
        lingerN: false,
        lingerP: false,
        timer: 6000,
        skipFadeN: false,
        skipFadeP: false
      },
      {
        narrator: 'You looked at me with fascination. To you, I didn\’t look like God. I just looked like some man. Or possibly a woman. Some vague authority figure, maybe. More of a grammar school teacher than the almighty.',
        narratorClass: 'narrator-center n-pos-mid animate__animated animate__fadeIn animate__slower',
        personClass: 'person',
        lingerN: false,
        lingerP: false,
        hasButton: true,
        skipFadeN: true,
        skipFadeP: false
      },
      {
        narrator: '“Dont worry”<span class="nar">I said.</span> "They\'ll be fine. Your kids will remember you as perfect in every way."',
        narratorClass: 'narrator n-pos-mid animate__animated animate__fadeIn',
        person: '',
        personClass: 'person',
        hasButton: false,
        timer: 4000,
        lingerN: false,
        lingerP: false,
        skipFadeN: false,
        skipFadeP: false
      },
      {
        narrator: 'They didn\’t have time to grow contempt for you.',
        narratorClass: 'narrator n-pos-mid animate__animated animate__fadeIn',
        person: '',
        personClass: 'person',
        hasButton: false,
        timer: 4000,
        lingerN: false,
        lingerP: false,
        skipFadeN: false,
        skipFadeP: false
      },
      {
        narrator: 'Your wife will cry on the outside, but will be secretly relieved. To be fair, your marriage was falling apart.',
        narratorClass: 'narrator n-pos-mid animate__animated animate__fadeIn',
        person: '',
        personClass: 'person',
        hasButton: false,
        timer: 4000,
        lingerN: false,
        lingerP: false,
        skipFadeN: false,
        skipFadeP: false
      },
      {
        narrator: '"If it\’s any consolation, she\’ll feel very guilty for feeling relieved.”',
        narratorClass: 'narrator n-pos-mid animate__animated animate__fadeIn',
        person: '',
        personClass: 'person',
        hasButton: false,
        timer: 4000,
        lingerN: true,
        lingerP: false,
        skipFadeN: false,
        skipFadeP: false
      },
      {
        narrator: '<span class="fade-to-grey">"If it\’s any consolation, she\’ll feel very guilty for feeling relieved.”</span>',
        narratorClass: 'narrator n-pos-mid',
        person: '"oh", <span class= "nar"> you said </span>',
        personClass: 'person p-pos-bot animate__animated animate__fadeIn',
        hasButton: true,

        lingerN: false,
        lingerP: false,
        skipFadeN: false,
        skipFadeP: false
      },
      {
        narrator: '',
        narratorClass: 'narrator',
        person: '“So what happens now? Do I go to heaven or hell or something?”',
        personClass: 'person p-pos-bot animate__animated animate__fadeIn',
        hasButton: true,

        lingerN: false,
        lingerP: true,
        skipFadeN: false,
        skipFadeP: false
      },
      {
        narrator: '“Neither,”<span class="nar"> I said.</span> “You’ll be reincarnated.”',
        narratorClass: 'narrator n-pos-top animate__animated animate__fadeIn',
        person: '',
        personClass: 'person',
        hasButton: false,
        timer: 3000,
        lingerN: false,
        lingerP: true,
        skipFadeN: true,
        skipFadeP: false
      },
      {
        narrator: '<span class= "fade-to-grey">“Neither,”<span class="nar"> I said.</span> “You’ll be reincarnated.”</span>',
        narratorClass: 'narrator n-pos-top',
        person: '“Ah,” <span class="nar">you said.</span> “So the Hindus were right,”',
        personClass: 'person p-pos-top animate__animated animate__fadeIn',
        hasButton: true,

        lingerN: false,
        lingerP: true,
        skipFadeN: false,
        skipFadeP: false
      },
      {
        narrator: '“All religions are right in their own way,” <span class="nar">I said.</span> “Walk with me.”',
        narratorClass: 'narrator n-pos-top animate__animated animate__fadeIn',
        person: '',
        personClass: 'person',
        hasButton: false,
        timer: 4000,
        lingerN: false,
        lingerP: true,
        skipFadeN: false,
        skipFadeP: false
      },
      {
        narrator: '',
      },
      {
        narrator: 'I stopped walking and took you by the shoulders.',
        narratorClass: 'narrator-center n-pos-mid animate__animated animate__fadeIn',
        person: '',
        personClass: 'person',
        hasButton: false,
        timer: 4000,
        lingerN: true,
        lingerP: true,
        skipFadeN: true,
        skipFadeP: false
      },
      {
        narrator: '<span class="fade-to-grey">I stopped walking and took you by the shoulders.</span><span class = "animate__animated animate__fadeIn">“Your soul is more magnificent, beautiful, and gigantic than you can possibly imagine. A human mind can only contain a tiny fraction of what you are.</span>',
        narratorClass: 'narrator-center n-pos-mid ',
        person: '',
        personClass: 'person',
        hasButton: false,
        timer: 5000,
        lingerN: false,
        lingerP: true,
        skipFadeN: true,
        skipFadeP: false
      },
      {
        narrator: '<span class="grey-text">I stopped walking and took you by the shoulders.</span><span class = "fade-to-grey">“Your soul is more magnificent, beautiful, and gigantic than you can possibly imagine. A human mind can only contain a tiny fraction of what you are.</span><span class = "animate__animated animate__fadeIn">It\’s like sticking your finger in a glass of water to see if it\’s hot or cold.</span>',
        narratorClass: 'narrator-center n-pos-mid ',
        person: '',
        personClass: 'person',
        hasButton: false,
        timer: 5000,
        lingerN: false,
        lingerP: true,
        skipFadeN: true,
        skipFadeP: true
      },
      {
        narrator: '<span class="grey-text animate__animated animate__fadeOut">I stopped walking and took you by the shoulders.</span><span class = "grey-text animate__animated animate__fadeOut">“Your soul is more magnificent, beautiful, and gigantic than you can possibly imagine. A human mind can only contain a tiny fraction of what you are.</span><span class = "fade-to-grey animate__animated animate__fadeOut">It\’s like sticking your finger in a glass of water to see if it\’s hot or cold.</span><br> <span class = "animate__animated animate__fadeIn">You put a tiny part of yourself into the vessel, and when you bring it back out, you\’ve gained all the experiences it had.</span>',
        narratorClass: 'narrator-center n-pos-mid ',
        person: '',
        personClass: 'person',
        hasButton: false,
        timer: 8000,
        lingerN: false,
        lingerP: true,
        skipFadeN: false,
        skipFadeP: true
      },
      {
        narrator: '“You\’ve been in a human for the last 48 years, so you haven\’t stretched out yet and felt the rest of your immense consciousness.',
        narratorClass: 'narrator-center n-pos-mid animate__animated animate__fadeIn',
        person: '',
        personClass: 'person',
        hasButton: false,
        timer: 4000,
        lingerN: true,
        lingerP: true,
        skipFadeN: true,
        skipFadeP: false
      },
      {
        narrator: '<span class="fade-to-grey">“You\’ve been in a human for the last 48 years, so you haven\’t stretched out yet and felt the rest of your immense consciousness.</span><span class = "animate__animated animate__fadeIn">If we hung out here for long enough, you\’d start remembering everything.</span>',
        narratorClass: 'narrator-center n-pos-mid',
        person: '',
        personClass: 'person',
        hasButton: false,
        timer: 4000,
        lingerN: true,
        lingerP: true,
        skipFadeN: true,
        skipFadeP: false
      },
      {
        narrator: '<span class="grey-text">“You\’ve been in a human for the last 48 years, so you haven\’t stretched out yet and felt the rest of your immense consciousness.</span><span class = "fade-to-grey">If we hung out here for long enough, you\’d start remembering everything.</span><span class = "animate__animated animate__fadeIn">But there\’s no point to doing that between each life.”</span>',
        narratorClass: 'narrator-center n-pos-mid',
        person: '',
        personClass: 'person',
        hasButton: false,
        timer: 4000,
        lingerN: true,
        lingerP: true,
        skipFadeN: true,
        skipFadeP: false
      },
      {
        narrator: '<span class="grey-text">“You\’ve been in a human for the last 48 years, so you haven\’t stretched out yet and felt the rest of your immense consciousness.</span><span class = "grey-text">If we hung out here for long enough, you\’d start remembering everything.</span><span class = "grey-text">But there\’s no point to doing that between each life.”</span>',
        narratorClass: 'narrator-center n-pos-mid',
        person: '“How many times have I been reincarnated, then?”',
        personClass: 'person p-pos-bot animate__animated animate__fadeIn',
        hasButton: true,
        lingerN: false,
        lingerP: true,
        skipFadeN: false,
        skipFadeP: true,
      },
      {
        //fade on button work around
        narrator: '<span class="grey-text">“You\’ve been in a human for the last 48 years, so you haven\’t stretched out yet and felt the rest of your immense consciousness.</span><span class = "grey-text">If we hung out here for long enough, you\’d start remembering everything.</span><span class = "grey-text">But there\’s no point to doing that between each life.”</span>',
        narratorClass: 'narrator-center n-pos-mid',
        person: '“How many times have I been reincarnated, then?”',
        personClass: 'person p-pos-bot',
        hasButton: false,
        timer: 50,
        lingerN: false,
        lingerP: true,
        skipFadeN: false,
        skipFadeP: true,
      },
      {
        narrator: '“Oh lots. Lots and lots. And into lots of different lives.” <span class="nar">I said.</span> “This time around, you\’ll be a Chinese peasant girl in 540 AD.”',
        narratorClass: 'narrator n-pos-mid animate__animated animate__fadeIn',
        person: '<span class="fade-to-grey">“How many times have I been reincarnated, then?”</span>',
        personClass: 'person p-pos-bot',
        hasButton: false,
        timer: 8000,
        lingerN: true,
        lingerP: false,
        skipFadeN: true,
        skipFadeP: true,
      },
      {
        narrator: '<span class="fade-to-grey">“Oh lots. Lots and lots. And into lots of different lives.” <span class="nar">I said.</span> “This time around, you\’ll be a Chinese peasant girl in 540 AD.”</span>',
        narratorClass: 'narrator n-pos-mid',
        person: '<span class="grey-text">“How many times have I been reincarnated, then?”</span><span class="animate__animated animate__fadeIn"> "Wait what?"<span class="nar"> You stammered.</span> “You\’re sending me back in time?”</span>',
        personClass: 'person p-pos-bot',
        hasButton: true,
        lingerN: false,
        lingerP: true,
        skipFadeN: false,
        skipFadeP: true,
      },
      {
        narrator: 'Well, I guess technically.',
        narratorClass: 'narrator n-pos-mid animate__animated animate__fadeIn',
        person: '<span class="grey-text">“How many times have I been reincarnated, then?”</span><span class="fade-to-grey"> "Wait what?"<span class="nar"> You stammered.</span> “You\’re sending me back in time?”</span>',
        personClass: 'person p-pos-bot',
        hasButton: false,
        timer: 2000,
        lingerN: true,
        lingerP: true,
        skipFadeN: true,
        skipFadeP: true,
      },
      {
        narrator: '<span class="fade-to-grey">Well, I guess technically.</span> <span class = "animate__animated animate__fadeIn">Time, as you know it, only exists in your universe. Things are different where I come from.”</span>',
        narratorClass: 'narrator n-pos-mid',
        person: '<span class="grey-text">“How many times have I been reincarnated, then?”</span><span class="grey-text"> "Wait what?"<span class="nar"> You stammered.</span> “You\’re sending me back in time?”</span>',
        personClass: 'person p-pos-bot',
        hasButton: false,
        timer: 5000,
        lingerN: true,
        lingerP: false,
        skipFadeN: true,
        skipFadeP: false,
      },
      {
        narrator: '<span class="grey-text">Well, I guess technically.</span> <span class = "fade-to-grey">Time, as you know it, only exists in your universe. Things are different where I come from.”</span>',
        narratorClass: 'narrator n-pos-mid',
        person: '“Where you come from?” <span class="nar">You said.</span>',
        personClass: 'person p-pos-mid animate__animated animate__fadeIn',
        hasButton: true,

        lingerN: false,
        lingerP: true,
        skipFadeN: false,
        skipFadeP: true,
      },
      {
        narrator: '“Oh sure,” <span class="nar">I explained</span> “I come from somewhere. Somewhere else. And there are others like me.',
        narratorClass: 'narrator n-pos-top animate__animated animate__fadeIn',
        person: '<span class="fade-to-grey">“Where you come from?” <span class="nar">You said.</span></span>',
        personClass: 'person p-pos-mid',
        hasButton: false,
        timer: 6000,
        lingerN: true,
        lingerP: true,
        skipFadeN: true,
        skipFadeP: true,
      },
      {
        narrator: '<span class="fade-to-grey">“Oh sure,” <span class="nar">I explained</span> “I come from somewhere. Somewhere else. And there are others like me.</span><span class = "animate__animated animate__fadeIn"> I know you\’ll want to know what it\’s like there, but honestly you wouldn\’t understand.”</span>',
        narratorClass: 'narrator n-pos-top',
        person: '<span class="grey-text">“Where you come from?” <span class="nar">You said.</span></span>',
        personClass: 'person p-pos-mid',
        hasButton: false,
        timer: 6000,
        lingerN: true,
        lingerP: false,
        skipFadeN: true,
        skipFadeP: false,
      },

      {
        narrator: '<span class="grey-text">“Oh sure,” <span class="nar">I explained</span> “I come from somewhere. Somewhere else. And there are others like me.</span><span class = "fade-to-grey"> I know you\'ll want to know what it\'s like there, but honestly you wouldn\'t understand.”</span>',
        narratorClass: 'narrator n-pos-top',
        person: '“Oh,” <span class="nar">you said, a little let down.</span> “But wait. If I get reincarnated to other places in time, I could have interacted with myself at some point.”',
        personClass: 'person p-pos-bot animate__animated animate__fadeIn',
        hasButton: true,
        lingerN: false,
        lingerP: true,
        skipFadeN: false,
        skipFadeP: true,
      },
      {
        narrator: '"Sure. Happens all the time. And with both lives only aware of their own lifespan you don\'t even know it\'s happening."',
        narratorClass: 'narrator n-pos-mid animate__animated animate__fadeIn',
        person: '<span class="fade-to-grey">"Oh," <span class="nar">you said, a little let down.</span> "But wait. If I get reincarnated to other places in time, I could have interacted with myself at some point."</span>',
        personClass: 'person p-pos-bot',
        hasButton: false,
        timer: 6000,
        lingerN: true,
        lingerP: false,
        skipFadeN: true,
        skipFadeP: false,
      },
      {
        narrator: '<span class="fade-to-grey">"Sure. Happens all the time. And with both lives only aware of their own lifespan you don\'t even know it\'s happening."</span>',
        narratorClass: 'narrator n-pos-mid',
        person: '"So what\'s the point of it all?"',
        personClass: 'person p-pos-mid animate__animated animate__fadeIn',
        hasButton: true,
        lingerN: false,
        lingerP: true,
        skipFadeN: false,
        skipFadeP: true,
      },
      {
        narrator: '"Seriously?" <span class="nar">I asked.</span> "Seriously? You\'re asking me for the meaning of life? Isn\'t that a little stereotypical?"',
        narratorClass: 'narrator n-pos-top animate__animated animate__fadeIn',
        person: '<span class="fade-to-grey">"So what\'s the point of it all?"</span>',
        personClass: 'person p-pos-mid',
        hasButton: false,
        timer: 6000,
        lingerN: true,
        lingerP: false,
        skipFadeN: true,
        skipFadeP: false,
      },
      {
        narrator: '<span class="fade-to-grey">"Seriously?" <span class="nar">I asked.</span> "Seriously? You\'re asking me for the meaning of life? Isn\'t that a little stereotypical?"</span>',
        narratorClass: 'narrator n-pos-top',
        person: '"Well it\'s a reasonable question," <span class="nar">you persisted.</span>',
        personClass: 'person p-pos-bot animate__animated animate__fadeIn',
        hasButton: true,
        lingerN: false,
        lingerP: true,
        skipFadeN: false,
        skipFadeP: true,
      },
      {
        narrator: '<span class="nar">I looked you in the eye.</span> "The meaning of life, the reason I made this whole universe, is for you to mature."',
        narratorClass: 'narrator n-pos-mid animate__animated animate__fadeIn',
        person: '<span class="fade-to-grey">"Well it\'s a reasonable question," <span class="nar">you persisted.</span></span>',
        personClass: 'person p-pos-bot',
        hasButton: false,
        timer: 6000,
        lingerN: true,
        lingerP: false,
        skipFadeN: true,
        skipFadeP: false,
      },
      {
        narrator: '<span class="fade-to-grey"><span class="nar">I looked you in the eye.</span> "The meaning of life, the reason I made this whole universe, is for you to mature."</span>',
        narratorClass: 'narrator n-pos-mid',
        person: '"You mean mankind? You want us to mature?"',
        personClass: 'person p-pos-mid animate__animated animate__fadeIn',
        hasButton: true,
        lingerN: false,
        lingerP: true,
        skipFadeN: false,
        skipFadeP: true,
      },
      {
        narrator: '"No, just you. I made this whole universe for you.',
        narratorClass: 'narrator n-pos-top animate__animated animate__fadeIn',
        person: '<span class="fade-to-grey">"You mean mankind? You want us to mature?"</span>',
        personClass: 'person p-pos-mid',
        hasButton: false,
        timer: 3000,
        lingerN: true,
        lingerP: true,
        skipFadeN: true,
        skipFadeP: true,
      },
      {
        narrator: '<span class="fade-to-grey">"No, just you. I made this whole universe for you.</span><span class="animate__animated animate__fadeIn"> With each new life you grow and mature and become a larger and greater intellect."</span>',
        narratorClass: 'narrator n-pos-top',
        person: '<span class="grey-text">"You mean mankind? You want us to mature?"</span>',
        personClass: 'person p-pos-mid',
        hasButton: false,
        timer: 6000,
        lingerN: true,
        lingerP: false,
        skipFadeN: true,
        skipFadeP: false,
      },
      {
        narrator: '<span class="grey-text">"No, just you. I made this whole universe for you.</span><span class="fade-to-grey"> With each new life you grow and mature and become a larger and greater intellect."</span>',
        narratorClass: 'narrator n-pos-top',
        person: '"Just me? What about everyone else?"',
        personClass: 'person p-pos-bot animate__animated animate__fadeIn',
        hasButton: true,
        lingerN: false,
        lingerP: true,
        skipFadeN: false,
        skipFadeP: true,
      },
      {
        narrator: '"There is no one else," <span class="nar">I said.</span> "In this universe, there\'s just you and me."',
        narratorClass: 'narrator n-pos-mid animate__animated animate__fadeIn',
        person: '<span class="fade-to-grey">"Just me? What about everyone else?"</span>',
        personClass: 'person p-pos-bot',
        hasButton: false,
        timer: 5000,
        lingerN: true,
        lingerP: false,
        skipFadeN: true,
        skipFadeP: false,
      },
      {
        narrator: '<span class="fade-to-grey">"There is no one else," <span class="nar">I said.</span> "In this universe, there\'s just you and me."</span>',
        narratorClass: 'narrator n-pos-mid',
        person: '<span class="nar">You stared blankly at me.</span> "But all the people on earth…"',
        personClass: 'person p-pos-mid animate__animated animate__fadeIn',
        hasButton: true,
        lingerN: false,
        lingerP: true,
        skipFadeN: false,
        skipFadeP: true,
      },
      {
        narrator: '"All you. Different incarnations of you."',
        narratorClass: 'narrator n-pos-top animate__animated animate__fadeIn',
        person: '<span class="fade-to-grey"><span class="nar">You stared blankly at me.</span> "But all the people on earth…"</span>',
        personClass: 'person p-pos-mid',
        hasButton: false,
        timer: 4000,
        lingerN: true,
        lingerP: false,
        skipFadeN: true,
        skipFadeP: false,
      },
      {
        narrator: '<span class="fade-to-grey">"All you. Different incarnations of you."</span>',
        narratorClass: 'narrator n-pos-top',
        person: '"Wait. I\'m <em>everyone</em>!?"',
        personClass: 'person p-pos-bot animate__animated animate__fadeIn',
        hasButton: true,
        lingerN: false,
        lingerP: true,
        skipFadeN: false,
        skipFadeP: true,
      },
      {
        narrator: '"Now you\'re getting it," <span class="nar">I said, with a congratulatory slap on the back.</span>',
        narratorClass: 'narrator n-pos-mid animate__animated animate__fadeIn',
        person: '<span class="fade-to-grey">"Wait. I\'m <em>everyone</em>!?"</span>',
        personClass: 'person p-pos-bot',
        hasButton: false,
        timer: 4000,
        lingerN: true,
        lingerP: false,
        skipFadeN: true,
        skipFadeP: false,
      },
      {
        narrator: '<span class="fade-to-grey">"Now you\'re getting it," <span class="nar">I said, with a congratulatory slap on the back.</span></span>',
        narratorClass: 'narrator n-pos-mid',
        person: '"I\'m every human being who ever lived?"',
        personClass: 'person p-pos-mid animate__animated animate__fadeIn',
        hasButton: true,
        lingerN: false,
        lingerP: true,
        skipFadeN: false,
        skipFadeP: true,
      },
      {
        narrator: '"Or who will ever live, yes."',
        narratorClass: 'narrator n-pos-top animate__animated animate__fadeIn',
        person: '<span class="fade-to-grey">"I\'m every human being who ever lived?"</span>',
        personClass: 'person p-pos-mid',
        hasButton: false,
        timer: 3000,
        lingerN: true,
        lingerP: false,
        skipFadeN: true,
        skipFadeP: false,
      },
      {
        narrator: '<span class="fade-to-grey">"Or who will ever live, yes."</span>',
        narratorClass: 'narrator n-pos-top',
        person: '"I\'m Abraham Lincoln?"',
        personClass: 'person p-pos-bot animate__animated animate__fadeIn',
        hasButton: true,
        lingerN: false,
        lingerP: true,
        skipFadeN: false,
        skipFadeP: true,
      },
      {
        narrator: '"And you\'re John Wilkes Booth, too," <span class="nar">I added.</span>',
        narratorClass: 'narrator n-pos-mid animate__animated animate__fadeIn',
        person: '<span class="fade-to-grey">"I\'m Abraham Lincoln?"</span>',
        personClass: 'person p-pos-bot',
        hasButton: false,
        timer: 4000,
        lingerN: true,
        lingerP: false,
        skipFadeN: true,
        skipFadeP: false,
      },
      {
        narrator: '<span class="fade-to-grey">"And you\'re John Wilkes Booth, too," <span class="nar">I added.</span></span>',
        narratorClass: 'narrator n-pos-mid',
        person: '"I\'m Hitler?" <span class="nar">You said, appalled.</span>',
        personClass: 'person p-pos-mid animate__animated animate__fadeIn',
        hasButton: true,
        lingerN: false,
        lingerP: true,
        skipFadeN: false,
        skipFadeP: true,
      },
      {
        narrator: '"And you\'re the millions he killed."',
        narratorClass: 'narrator n-pos-top animate__animated animate__fadeIn',
        person: '<span class="fade-to-grey">"I\'m Hitler?" <span class="nar">You said, appalled.</span></span>',
        personClass: 'person p-pos-mid',
        hasButton: false,
        timer: 4000,
        lingerN: true,
        lingerP: false,
        skipFadeN: true,
        skipFadeP: false,
      },
      {
        narrator: '<span class="fade-to-grey">"And you\'re the millions he killed."</span>',
        narratorClass: 'narrator n-pos-top',
        person: '"I\'m Jesus?"',
        personClass: 'person p-pos-bot animate__animated animate__fadeIn',
        hasButton: true,
        lingerN: false,
        lingerP: true,
        skipFadeN: false,
        skipFadeP: true,
      },
      {
        narrator: '"And you\'re everyone who followed him."',
        narratorClass: 'narrator n-pos-mid animate__animated animate__fadeIn',
        person: '<span class="fade-to-grey">"I\'m Jesus?"</span>',
        personClass: 'person p-pos-bot',
        hasButton: false,
        timer: 4000,
        lingerN: false,
        lingerP: false,
        skipFadeN: false,
        skipFadeP: false,
      },
      {
        narrator: '<span class="nar">You fell silent.</span>',
        narratorClass: 'narrator-center n-pos-mid animate__animated animate__fadeIn',
        person: '',
        personClass: 'person',
        hasButton: false,
        timer: 3000,
        lingerN: false,
        lingerP: false,
        skipFadeN: false,
        skipFadeP: false,
      },
      {
        narrator: '"Every time you victimized someone, you were victimizing yourself.',
        narratorClass: 'narrator-center n-pos-mid animate__animated animate__fadeIn',
        person: '',
        personClass: 'person',
        hasButton: false,
        timer: 5000,
        lingerN: true,
        lingerP: false,
        skipFadeN: true,
        skipFadeP: false,
      },
      {
        narrator: '<span class="fade-to-grey">"Every time you victimized someone, you were victimizing yourself.</span><span class="animate__animated animate__fadeIn"> Every act of kindness you\'ve done, you\'ve done to yourself.</span>',
        narratorClass: 'narrator-center n-pos-mid',
        person: '',
        personClass: 'person',
        hasButton: false,
        timer: 5000,
        lingerN: true,
        lingerP: false,
        skipFadeN: true,
        skipFadeP: false,
      },
      {
        narrator: '<span class="grey-text">"Every time you victimized someone, you were victimizing yourself.</span><span class="fade-to-grey"> Every act of kindness you\'ve done, you\'ve done to yourself.</span><span class="animate__animated animate__fadeIn"> Every happy and sad moment ever experienced by any human was, or will be, experienced by you."</span>',
        narratorClass: 'narrator-center n-pos-mid',
        person: '',
        personClass: 'person',
        hasButton: false,
        timer: 6000,
        lingerN: false,
        lingerP: false,
        skipFadeN: false,
        skipFadeP: false,
      },
      {
        narrator: '<span class="nar">You thought for a long time.</span>',
        narratorClass: 'narrator-center n-pos-mid animate__animated animate__fadeIn',
        person: '',
        personClass: 'person',
        hasButton: false,
        timer: 4000,
        lingerN: false,
        lingerP: false,
        skipFadeN: false,
        skipFadeP: false,
      },
      {
        narrator: '',
        narratorClass: 'narrator',
        person: '"Why?" <span class="nar">You asked me.</span> "Why do all this?"',
        personClass: 'person p-pos-mid animate__animated animate__fadeIn',
        hasButton: true,
        lingerN: false,
        lingerP: true,
        skipFadeN: false,
        skipFadeP: true,
      },
      {
        narrator: '"Because someday, you will become like me. Because that\'s what you are. You\'re one of my kind. You\'re my child."',
        narratorClass: 'narrator n-pos-top animate__animated animate__fadeIn',
        person: '<span class="fade-to-grey">"Why?" <span class="nar">You asked me.</span> "Why do all this?"</span>',
        personClass: 'person p-pos-mid',
        hasButton: false,
        timer: 6000,
        lingerN: true,
        lingerP: false,
        skipFadeN: true,
        skipFadeP: false,
      },
      {
        narrator: '<span class="fade-to-grey">"Because someday, you will become like me. Because that\'s what you are. You\'re one of my kind. You\'re my child."</span>',
        narratorClass: 'narrator n-pos-top',
        person: '"Whoa," <span class="nar">you said, incredulous.</span> "You mean I\'m a god?"',
        personClass: 'person p-pos-bot animate__animated animate__fadeIn',
        hasButton: true,
        lingerN: false,
        lingerP: true,
        skipFadeN: false,
        skipFadeP: true,
      },
      {
        narrator: '"No. Not yet. You\'re a fetus. You\'re still growing."',
        narratorClass: 'narrator n-pos-mid animate__animated animate__fadeIn',
        person: '<span class="fade-to-grey">"Whoa," <span class="nar">you said, incredulous.</span> "You mean I\'m a god?"</span>',
        personClass: 'person p-pos-bot',
        hasButton: false,
        timer: 4000,
        lingerN: true,
        lingerP: false,
        skipFadeN: true,
        skipFadeP: false,
      },
      {
        narrator: '<span class="fade-to-grey">"No. Not yet. You\'re a fetus. You\'re still growing.</span><span class="animate__animated animate__fadeIn"> Once you\'ve lived every human life throughout all time, you will have grown enough to be born."</span>',
        narratorClass: 'narrator n-pos-mid',
        person: '',
        personClass: 'person',
        hasButton: false,
        timer: 6000,
        lingerN: true,
        lingerP: false,
        skipFadeN: true,
        skipFadeP: false,
      },
      {
        narrator: '<span class="grey-text">"No. Not yet. You\'re a fetus. You\'re still growing.</span><span class="fade-to-grey"> Once you\'ve lived every human life throughout all time, you will have grown enough to be born."</span>',
        narratorClass: 'narrator n-pos-mid',
        person: '"So the whole universe," <span class="nar">you said,</span> "it\'s just…"',
        personClass: 'person p-pos-bot animate__animated animate__fadeIn',
        hasButton: true,
        lingerN: false,
        lingerP: true,
        skipFadeN: false,
        skipFadeP: true,
      },
      {
        narrator: '"An egg." <span class="nar">I answered.</span> "Now it\'s time for you to move on to your next life."',
        narratorClass: 'narrator n-pos-top animate__animated animate__fadeIn',
        person: '<span class="fade-to-grey">"So the whole universe," <span class="nar">you said,</span> "it\'s just…"</span>',
        personClass: 'person p-pos-bot',
        hasButton: false,
        timer: 5000,
        lingerN: false,
        lingerP: false,
        skipFadeN: false,
        skipFadeP: false,
      },
      {
        narrator: '<span class="nar">And I sent you on your way.</span>',
        narratorClass: 'narrator-center n-pos-mid animate__animated animate__fadeIn animate__slower',
        person: '',
        personClass: 'person',
        hasButton: false,
        timer: 5000,
        lingerN: false,
        lingerP: false,
        skipFadeN: false,
        skipFadeP: false,
      }


    ],



    //question sequence
    questions: {
      setup: {
        text: "You looked around. There was nothingness. Just you and me. You asked...",
        class: "small-narrator animate__animated animate__fadeIn"

      },
      options: [
        {
          id: "afterlife",
          text: '"is this the afterlife?"',
          class: 'person question-options-button',
          answer: {
            text: '"More or less"',
            class: 'narrator animate__animated animate__fadeIn',
            timer: 5000
          }
        },
        {
          id: 'god',
          text: 'Are you god?',
          class: 'person question-options-button',
          answer: {
            text: '"Yup, I\'m God"',
            class: 'narrator animate__animated animate__fadeIn',
            timer: 5000
          }
        }
      ],


    },

    //walking sequence 
    // Scroll sequence content
    scrollSection: [
      {
        id: 'scroll-1',
        content: '<span class="nar">You followed along as we strode through the void.</span><span class="person">“Where are we going?”</span>',
        class: 'scroll-text',
        triggerPosition: 0 // Triggers on load
      },
      {
        id: 'scroll-2',
        content: '<span class="narrator">“Nowhere in particular,” <span class="nar">I said.</span> “It’s just nice to walk while we talk.”</span>',
        class: 'scroll-text',
        triggerPosition: 0.3 // Triggers when scrolled 30% of viewport height
      },
      {
        id: 'scroll-3',
        content: '<span class="person">“So what\’s the point, then?”</span><span class="nar"> You asked.</span><span class="person">“When I get reborn, I\’ll just be a blank slate, right? A baby. So all my experiences and everything I did in this life won\’t matter.”',
        class: 'scroll-text',
        triggerPosition: 0.8
      },
      {
        id: 'scroll-4',
        content: '<span class="narrator">“Not so!”<span class="nar"> I said.</span> “You have within you all the knowledge and experiences of all your past lives. You just don\’t remember them right now.”</span>',
        class: 'scroll-text',
        triggerPosition: 1,

      }
    ],

  };

  // Initialize the story engine
  StoryEngine.init();
});