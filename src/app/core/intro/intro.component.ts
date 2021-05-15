import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
import { IonSlides } from '@ionic/angular';
import { INTRO_KEY } from '../guards/intro.guard';
const { Storage } = Plugins;

@Component({
  selector: 'app-intro',
  templateUrl: './intro.html',
  styleUrls: ['./intro.scss']
})
export class IntroComponent implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  next() {
    this.slides.slideNext();
  }

  async start() {
    await Storage.set({ key: INTRO_KEY, value: 'true' });
    this.router.navigateByUrl('/', { replaceUrl: true });
  }
}
