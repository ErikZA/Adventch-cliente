import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubscriptionService } from '../subscription.service';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Subscription } from 'src/app/actions/subscription.action';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {

  public formInformation: FormGroup;

  public nameEvent: string;
  public products = [];
  public event: Event;

  constructor(
    public router: ActivatedRoute,
    private _subscription: SubscriptionService,
    private store: Store<any>,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {

    this.formInformation = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      cpf: ['', Validators.required],
      fieldResponses: this.fb.array([]),
    })

    const fields = this.formInformation.controls.fieldResponses as FormArray

    this.router.params.subscribe((res: any) => {
      this.nameEvent = res.id
      this._subscription.OneEvent(res.id).subscribe((res: any) => {
        const { event } = res.data[0]

        for (let f of event.fields) {
          const { name, isRequired } = f;
          fields.push(this.fb.group({
            [`${name}`]: ['', isRequired ? Validators.required : null]
          }))
        }

        this.store.dispatch(Subscription(event))
        this.event = event
        this.products = event.products;
        console.log(res.data)
      })
    });
  }

}
