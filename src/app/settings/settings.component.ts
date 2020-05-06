import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  updateForm: FormGroup;
  submitted: Boolean = false;
  loading: Boolean = false;

  constructor(private formBuilder: FormBuilder) { }

  buildupdateForm(){
    this.updateForm = this.formBuilder.group({
      username: ['',  Validators.compose([
        Validators.required, Validators.pattern(/^[a-zA-Z0-9]{1,12}$/)
      ])]
    });
  }

  ngOnInit() {
    this.buildupdateForm()
  }

  get f() { return this.updateForm.controls }

  async onSubmit(){
    this.submitted = true;

    if (this.updateForm.invalid) {
      return;
    }

    this.loading = false;
    this.submitted = false;
    this.updateForm.reset();
  }
}
