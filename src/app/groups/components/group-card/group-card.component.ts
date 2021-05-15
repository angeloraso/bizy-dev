import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
@Component({
  selector: 'group-card',
  templateUrl: 'group-card.html',
  styleUrls: ['group-card.scss']
})
export class GroupCardComponent implements OnInit {
  @Input() group: any;
  @Output() onclick = new EventEmitter();
  @Output() showOptions = new EventEmitter();

  usersText: string;

  ngOnInit() {
    this.usersText = 'miembro';
    if (this.group?.users?.length > 1) {
      this.usersText += 's';
    }
  }
}
