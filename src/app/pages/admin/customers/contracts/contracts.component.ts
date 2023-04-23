import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.scss']
})
export class ContractsComponent implements OnInit {

  horizontalStepperForm: UntypedFormGroup;

  /**
   * Constructor
   */
  constructor(private _formBuilder: UntypedFormBuilder)
  {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void
  {
      // Horizontal stepper form
      this.horizontalStepperForm = this._formBuilder.group({
          step1: this._formBuilder.group({
              email   : ['', [Validators.required, Validators.email]],
              country : ['', Validators.required],
              language: ['', Validators.required]
          }),
          step2: this._formBuilder.group({
              firstName: ['', Validators.required],
              lastName : ['', Validators.required],
              userName : ['', Validators.required],
              about    : ['']
          }),
          step3: this._formBuilder.group({
              byEmail          : this._formBuilder.group({
                  companyNews     : [true],
                  featuredProducts: [false],
                  messages        : [true]
              }),
              pushNotifications: ['everything', Validators.required]
          })
      });

  }
}
