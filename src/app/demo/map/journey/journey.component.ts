import {Component, EventEmitter, inject, Output} from '@angular/core';
import {SbbFormField} from '@sbb-esta/angular/form-field';
import {JsonPipe, KeyValuePipe, NgClass} from '@angular/common';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {SbbInputModule} from '@sbb-esta/angular/input';
import {SbbSelect} from '@sbb-esta/angular/select';
import {SbbOptionModule} from '@sbb-esta/angular/core';
import {zip} from 'rxjs';
import {SbbRadioButton, SbbRadioGroup} from '@sbb-esta/angular/radio-button';
import {SbbButton} from '@sbb-esta/angular/button';
import {JourneyService} from './journey.service';

type Car = { id: number, name: string };

@Component({
  selector: 'app-journey',
  standalone: true,
  imports: [
    SbbFormField,
    NgClass,
    ReactiveFormsModule,
    SbbInputModule,
    KeyValuePipe,
    JsonPipe,
    FormsModule,
    SbbSelect,
    SbbOptionModule,
    SbbRadioGroup,
    SbbRadioButton,
    SbbButton
  ],
  templateUrl: './journey.component.html',
  styleUrl: './journey.component.scss'

})
export class JourneyComponent {
  cars = [{id: 1, name: 'Car 1'}, {id: 2, name: 'Car 2'}, {id: 3, name: 'Car 3'}];
  private journeyService: JourneyService = inject(JourneyService);
  status = ['ON', 'OFF'];
  @Output() journeyCoordinates = new EventEmitter<{ startLocation: [number, number], endLocation: [number, number], carId: string }>();
  journeyForm: FormGroup;

  startLocation: FormControl = new FormControl('', [Validators.required]);
  private fb = inject(FormBuilder);
  start = this.journeyService.endLocationSignal();

  constructor() {
    this.journeyForm = this.fb.group({
      carId: ['', Validators.required],
      startLocation: ['', Validators.required],
      endLocation: ['', Validators.required]
    });
  }

  onSubmit(): void {
    const formData = this.journeyForm.value;
    const startLocation$ = this.journeyService.lookupCoordinates(formData.startLocation);
    const endLocation$ = this.journeyService.lookupCoordinates(formData.endLocation);

    zip(startLocation$, endLocation$).subscribe({
      next: ([startResult, endResult]: [any, any]) => {
        this.journeyCoordinates.emit({
          startLocation: [startResult[0].lat, startResult[0].lon],
          endLocation: [endResult[0].lat, endResult[0].lon],
          carId: formData.carId
        });

        formData.startLocation = { lat: startResult[0].lat, lon: startResult[0].lon };
        formData.endLocation = { lat: endResult[0].lat, lon: endResult[0].lon };
        this.journeyService.sendJourney(formData);
      },
      error: (err) => console.error('Error occurred:', err),
      complete: () => console.log('Both observables completed.')
    });
  }
}
