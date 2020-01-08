import { Component, OnInit } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms'
import { UserSettingsService } from '../services/user-settings';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  resetForm: FormGroup;
  formBuilder: FormBuilder;
  loading = false;

  constructor(
    private settings: UserSettingsService) { }

  ngOnInit() {
    this.formBuilder = new FormBuilder();
    this.resetForm = this.formBuilder.group({
      blockEasy: [false],
      blockHard: [false],
      blockImpossible: [false],
      blockFlappy: [false],
      matchingOriginal: [false]
    });
  }

  get f() { return this.resetForm.controls }

  onSubmit(){
    this.loading = true;

    if (this.resetForm.invalid) {
      this.loading = false;
      return;
    }

    this.settings.resetScores(this.f.blockEasy.value, this.f.blockHard.value, this.f.blockImpossible.value, this.f.blockFlappy.value, this.f.matchingOriginal.value);

    this.loading = false;
    this.resetForm.reset();
  }
}
