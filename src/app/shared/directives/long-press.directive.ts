import { AfterViewInit, Directive, ElementRef, EventEmitter, Input, NgZone, Output } from '@angular/core';
import { GestureController } from '@ionic/angular';

@Directive({
  selector: '[longPress]'
})
export class LongPressDirective implements AfterViewInit {
    @Output() press = new EventEmitter();
    @Input() delay = 1000;
    action: any; // Not stacking actions

    private longPressActive = false;

    constructor(
        private el: ElementRef,
        private gestureCtrl: GestureController,
        private zone: NgZone
    ) { }

    ngAfterViewInit() {
      this.loadLongPressOnElement();
    }

    loadLongPressOnElement() {
      const gesture = this.gestureCtrl.create({
        el: this.el.nativeElement,
        threshold: 0,
        gestureName: 'long-press',
        onStart: _ev => {
          this.longPressActive = true;
          this.longPressAction();
        },
        onEnd: _ev => {
          this.longPressActive = false;
        }
      });
      gesture.enable(true);
    }

    private longPressAction() {
      if (this.action) {
        clearInterval(this.action);
      }

      this.action = setTimeout(() => {
        this.zone.run(() => {
          if (this.longPressActive === true) {
            this.longPressActive = false;
            this.press.emit();
          }
        });
      }, this.delay);
    }
}
