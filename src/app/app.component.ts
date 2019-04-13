
import { Component, OnInit } from '@angular/core';
import { AppService } from './app.service';

import questions from '../data/questions.json';
import answer from '../data/answers.json';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  currentIndex = 0;
  answer;
  questions = [];
  result = {
    correct: [],
    wrong: [],
    unattended: [],
    data: [],
    score: '0.0'
  };

  timer = {
    hours: 1,
    minutes: 0,
    seconds: 0

  }
  totalTime: number = parseInt(JSON.stringify((this.timer.hours * 60 * 60) + (this.timer.minutes * 60) + this.timer.seconds));
  interval;
  timerClass: string = 'bg-success';
  unAttended;
  questionnaire: boolean = false;
  username: string;
  userError: boolean = false;
  visibleBlock: string = 'welcome';
  requiredError: boolean = false;
  warningDialog: boolean = false;

  constructor(private appService: AppService) { }

  ngOnInit() {

    // this.appService.getQuestions().subscribe((res: any[]) => {
    //   console.log(res);
    // });

    this.answer = answer.answer;
    this.questions = questions.questions;
    // this.currentQuestion = this.questions[this.currentIndex];


    //after all initilization start timer
    // setTimeout(() => { this.startTimer(); }, 5000);


    // checking window events
    window.onblur = this.windowMinimized.bind(this);
    window.onfocus = this.windowFocus.bind(this);

  }
  startMCQ() {
    this.userError = false;
    if (!this.username) {
      this.userError = true;
    } else {
      this.visibleBlock = 'questionnaire';
      this.questionnaire = true;
      this.startTimer();
    }
  }
  windowMinimized() {
    console.log('windowMinimized');
    if (this.visibleBlock == 'questionnaire') {
      this.warningDialog = true;
      clearInterval(this.interval);
      setTimeout(() => { this.submit(true); }, 5000);
    }

  }
  windowFocus() {
    console.log('windowFocus');
  }
  get enableSubmit() {
    if (this.currentIndex === this.questions.length - 1) { return true; } else { return false; }
  }

  get currentQuestion() {
    return this.questions[this.currentIndex];
  }

  selectOption(question, option) {
    if (!this.warningDialog) {
      question.answer = option;
    }
  }

  next() {
    this.requiredError = false;
    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
    }
  }

  prev() {
    this.requiredError = false;
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }

  jump(i) {
    this.currentIndex = i;
  }

  submit(autoSubmit?) {
    this.warningDialog = false;
    this.checkUnattended();
    this.requiredError = false;
    if (this.unAttended.length > 0 && !autoSubmit) {
      this.currentIndex = this.unAttended[0];
      this.requiredError = true;
    } else {
      console.log(JSON.stringify(this.questions));
      this.unAttended = [];
      this.questions.forEach((e, i) => {
        if (e.answer) {
          let x = this.getIndex(e.answer.aId, this.answer);
          if (x) {
            this.result.correct.push(e);
          } else {
            this.result.wrong.push(e);
          }
        } else {
          this.result.unattended.push(e);
        }
      });

      this.result.data = [this.result.correct.length, this.result.wrong.length, this.result.unattended.length]

      this.result.score = ((this.result.correct.length / this.questions.length) * 100).toFixed(2);
      console.log(this.result);
      console.log(this.unAttended);
      clearInterval(this.interval);
      this.visibleBlock = 'result';
    }
  }

  checkUnattended() {
    this.unAttended = [];
    this.questions.forEach((e, i) => {
      if (!e.answer) {
        this.unAttended.push(i);
      }
    });
  }
  getIndex(aId, array) {
    // for (var i = 0; i < array.length; i++) {
    for (let i in array) {
      if (array[i].aId === aId) {
        return true;
        // return array[i];
        // return i;
      }
    }
  }

  startTimer() {
    this.timer.hours--;
    this.timer.minutes = 60;
    this.interval = setInterval(() => {

      if (this.timer.seconds > 0) {
        this.timer.seconds--;
      } else {
        this.timer.minutes--;
        this.timer.seconds = 60;

        if (this.timer.minutes < 0) {
          this.timer.hours--;
          this.timer.minutes = 59;
        }

        if (this.timer.hours < 0) {
          // alert('Time Up');
          this.timer.hours = 0;
          this.timer.minutes = 0;
          this.timer.seconds = 0;
          this.submit(true);
          // clearInterval(this.interval);
        }
      }


      //check remaining time
      let rem = (this.timer.hours * 60 * 60) + (this.timer.minutes * 60) + this.timer.seconds;
      // console.log('rem...' + rem);
      if (((rem / this.totalTime) * 100) < 20) {
        this.timerClass = 'bg-danger';
      } else if (((rem / this.totalTime) * 100) < 50) {
        this.timerClass = 'bg-warning';
      }


    }, 1000);
  }

  pauseTimer() {
    clearInterval(this.interval);
  }
}

