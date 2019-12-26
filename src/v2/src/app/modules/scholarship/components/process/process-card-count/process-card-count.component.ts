import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-process-card-count',
  templateUrl: './process-card-count.component.html',
  styleUrls: ['./process-card-count.component.scss']
})
export class ProcessCardCountComponent implements OnInit {

  @Input() title = 'Processos';
  @Input() count = 0;
  @Input() total = 0;
  @Input() color = 'white';
  constructor() { }

  ngOnInit() {
  }

  public getColorText(): string {
    return this.color !== 'white' ? 'white' : 'black';
  }

}
