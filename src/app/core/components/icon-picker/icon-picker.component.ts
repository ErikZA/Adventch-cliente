import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'icon-picker',
  templateUrl: './icon-picker.component.html',
  styleUrls: ['./icon-picker.component.scss']
})
export class IconPickerComponent implements OnInit {

  @Input() public color: string = '#000';
  @Input('icon') public selectedIcon: string;
  @Output() public change: EventEmitter<any> = new EventEmitter();

  icons: string[][] = [
    ['alarm', 'account_box', 'announcement', 'assessment', 'assignment', 'bookmark', 'build'],
    ['change_history', 'credit_card', 'date_range', 'extension', 'face', 'favorite', 'store'],
    ['group_work', 'home', 'label', 'lightbulb_outline', 'list', 'line_weight', 'question_answer'],
    ['whatshot', 'reorder', 'report_problem', 'room', 'settings', 'shopping_cart', 'work'],
    ['star_rate', 'monetization_on', 'view_list', 'visibility', 'error', 'equalizer', 'new_releases'],
    ['mic', 'videocam', 'call', 'chat', 'chat_bubble', 'email', 'link'],
    ['report', 'flag', 'attach_file', 'attachment', 'attach_money', 'bubble_chart', 'folder'],
    ['business', 'device_hub', 'flash_on', 'image', 'lens', 'photo_camera', 'style'],
    ['view_comfy', 'wb_incandescent', 'directions_bus', 'directions_car', 'flight', 'hotel', 'local_offer'],
    ['restaurant', 'restaurant_menu', 'local_shipping', 'all_inclusive', 'business_center', 'notifications', 'share']
  ]

  constructor() { }

  ngOnInit() {
    if (this.selectedIcon)
      this.change.emit({ icon: this.selectedIcon });
  }

  setIcon(icon: string) {
    let changed = this.selectedIcon != icon;
    this.selectedIcon = icon;
    if (changed)
      this.change.emit({ icon: icon });
  }

}
