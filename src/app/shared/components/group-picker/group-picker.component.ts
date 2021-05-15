import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { GENERAL_GROUP } from '@core/constants';
import { IGroup, SimpleGroup } from '@groups/model';
import { ModalController } from '@ionic/angular';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'group-picker',
  templateUrl: 'group-picker.html',
  styleUrls: ['group-picker.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupPickerComponent implements OnChanges, OnInit {
  @Input() group: SimpleGroup;
  @Output() groupChange = new EventEmitter<SimpleGroup>();

  private groups: Array<IGroup>;

  constructor(
    @Inject(ModalController) private modalController: ModalController,
    @Inject(AppService) private appService: AppService
  ) {
    this.getGroups();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.group.currentValue) {
      if (this.groups) {
        const group = this.groups.find(_group => {
          return _group.id === this.group.id;
        });
        this.group = group ?? GENERAL_GROUP;
      }
    }
  }

  ngOnInit() {
    if (!this.group) {
      this.group = GENERAL_GROUP;
    }
  }

  async getGroups() {
    this.groups = await this.appService.getGroups();
    this.groups.unshift(GENERAL_GROUP);
    if (this.group?.id && this.group.id !== GENERAL_GROUP.id) {
      const group = this.groups.find(_group => {
        return _group.id === this.group.id;
      });
      this.group = group ?? GENERAL_GROUP;
      this.groupChange.emit(this.group);
    }
  }

  async showGroups() {
    const modal = await this.modalController.create({
      component: GroupsModalComponent,
      componentProps: {
        group: this.group,
        groups: this.groups
      }
    });

    modal.onWillDismiss().then(res => {
      if (res.data) {
        this.group = res.data;
        this.groupChange.emit(res.data);
      }
    });

    return modal.present();
  }
}

@Component({
  selector: 'groups-modal',
  templateUrl: 'groups-modal.html',
  styleUrls: ['group-picker.scss']
})
export class GroupsModalComponent {
  @Input() group: SimpleGroup;
  @Input() groups: Array<IGroup> = [];

  selectableGroups: Array<IGroup & {active: boolean}> = [];

  constructor(
    @Inject(ModalController) private modalController: ModalController
  ) {}

  ionViewWillEnter() {
    this.groups.forEach(_group => {
      if (_group.id === this.group.id) {
        this.selectableGroups.push(Object.assign({}, _group, { active: true }));
      } else {
        this.selectableGroups.push(Object.assign({}, _group, { active: false }));
      }
    });
  }

  close() {
    this.modalController.dismiss();
  }

  selectGroup(group: SimpleGroup) {
    this.modalController.dismiss(group);
  }
}
