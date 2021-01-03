import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { StorageService } from '../../../services/storage.service';
import { UserService } from '../../../services/user.service';
import { storage } from '../../../app.constants';
import { User } from '../../../models/user';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  createForm: FormGroup;
  submitted: boolean = false;
  loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private storageService: StorageService) { }

  get f() { return this.createForm.controls; }

  async onSubmit() {
    this.submitted = true;

    if (this.createForm.invalid) return;

    this.loading = true;

    await this.userService.add(this.f.username.value)
      .then((newUser: User) => {
        this.storageService.set(storage.userId, newUser.id);
        this.userService.user = newUser;
        this.submitted = false;
      })
      .catch(() => {
        this.f.username.setErrors( {'serverError': true} );
      })
      .finally(() => {
        this.loading = false;
      });
  }

  ngOnInit() {
    this.createForm = this.formBuilder.group({
      username: ['',  Validators.compose([
        Validators.required, Validators.pattern(/^[a-zA-Z0-9]{1,12}$/)
      ])]
    });
  }

}
